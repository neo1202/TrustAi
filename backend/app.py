from flask import Flask, request, jsonify, send_file
import matplotlib
matplotlib.use('Agg')
from flask_cors import CORS

# shap & CF
import shap
import dice_ml

# always needed
import os, random, csv, math
from math import gamma
from tabnanny import verbose # 偵測不良縮排
import pandas as pd
import numpy as np

# log and save
import json, logging, pickle, sys, shutil, copy
from argparse import ArgumentParser, Namespace
from pathlib import Path
from copy import copy
import joblib

# torch
import torch
import torch.nn
import torch.nn as nn
import torch.nn.functional as F
from torch.nn import Conv2d, MaxPool2d, Flatten, Linear, ReLU

import torch.optim as optim
from torch.optim import lr_scheduler
from torch.optim.lr_scheduler import StepLR

from torch.utils.data import Dataset, DataLoader, ConcatDataset
from torch.utils.data.sampler import SubsetRandomSampler
import torchvision
from torchvision import datasets, models, transforms


# For plotting "learning curve"
# from torch.utils.tensorboard import SummaryWriter  #電腦好像找不到 tensorboard
# %matplotlib inline
import seaborn as sns
from tqdm.auto import tqdm

# others
import matplotlib.pyplot as plt
from PIL import Image

# sklearn
from sklearn import preprocessing
from sklearn.preprocessing import StandardScaler, RobustScaler, MinMaxScaler, RobustScaler
from sklearn.feature_selection import SelectKBest, chi2, f_regression
from sklearn.model_selection import KFold, cross_val_score, StratifiedKFold, train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.decomposition import PCA
from sklearn.linear_model import ElasticNet, Lasso,  BayesianRidge, LassoLarsIC
from sklearn.ensemble import RandomForestRegressor,  GradientBoostingRegressor
from sklearn.kernel_ridge import KernelRidge
from sklearn.pipeline import make_pipeline
from sklearn.base import BaseEstimator, TransformerMixin, RegressorMixin, clone
from sklearn.metrics import mean_squared_error
from sklearn.neural_network import MLPRegressor
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor

# statistics
from scipy import stats
from statsmodels.stats.outliers_influence import variance_inflation_factor
import statistics


# seeds
def same_seeds(seed):
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed(seed)
        torch.cuda.manual_seed_all(seed)
    np.random.seed(seed)
    random.seed(seed)
    torch.backends.cudnn.benchmark = False
    torch.backends.cudnn.deterministic = True

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

config = {
    'seed': 507,
    'valid_ratio': 0.20,
    'n_epochs': 100,
    'batch_size': 80, #16
    'learning_rate': 1e-3,
    'early_stop': 10,
    'query_iteration': 50,
    'save_path_large': './model_weights/LargeModel.ckpt',
#     'save_path_small': './model_weights/SmallModel.ckpt',
    'query_size': 20,
    'pool_size': 300
}

class IndexedDataset(Dataset):
    # data loading
    def __init__(self, df, TestOrValid=False, Valid=False):
        #df = pd.read_csv(file_name)
        self.x = torch.from_numpy(df.drop(columns=['Class']).to_numpy())
        self.x = self.x.to(torch.float32)

        '''真實的y, 但會顯示出的是label, 這邊的y幫助之後自動update unlabeled'''
        self.hidden_y = torch.from_numpy(df['Class'].to_numpy())
        self.n_samples = self.x.shape[0] #總共多少筆資料，不管有沒有label過
        #print(self.x.shape[0]) 多少個資料

        if TestOrValid: #如果是測試或驗證集，都會有答案的label
          self.labels = self.hidden_y
          self.unlabeled_mask = np.zeros(self.n_samples)
        else :
          self.labels = torch.from_numpy(np.array([-1]*self.n_samples)) #一開始將train label都設為-1
          self.unlabeled_mask = np.ones(self.n_samples)

        if Valid: #另外紀錄valid的一連串list
          self.prediction_record =  [[] for _ in range(self.n_samples)] #所有instance在valid set都有一串拿來紀錄的list

    # working for indexing
    def __getitem__(self, idx):
        return self.x[idx], self.labels[idx], idx
    def __len__(self):
        return self.n_samples

    # 這筆資料的當前資訊
    def display(self, idx):
        print(f'Data for this X:{self.x[idx]}')
        print(f'Label, mask for this X: label-{self.labels[idx]}, mask-{self.unlabeled_mask[idx]}')
        return
    def update_label_from_idx(self, idx):
        self.labels[idx] = self.hidden_y[idx]
        self.unlabeled_mask[idx] = 0 #代表他現在被標記了
        return
    def update_prediction_record(self, idx, prediction):
        self.prediction_record[idx].append(prediction)
        return

df = pd.read_csv('./data/preprocessed_beans_train.csv')
train_df, valid_df = train_test_split(df, test_size=0.2, random_state=42) # valid_ratio = 0.2
train_df = train_df.reset_index(drop=True)
valid_df = valid_df.reset_index(drop=True)

test_df = pd.read_csv('./data/preprocessed_beans_test.csv')
'''
print("Training set shape:", train_df.shape)
print("Validation set shape:", valid_df.shape)
print("Test set shape:", test_df.shape)
'''
Xcol=valid_df.columns[:-1].tolist()

dataset_train = IndexedDataset(train_df)
dataset_valid = IndexedDataset(valid_df, TestOrValid=True, Valid=True)
dataset_test = IndexedDataset(test_df, TestOrValid=True)

batch_size = config['batch_size']
train_loader = DataLoader(dataset_train ,batch_size=batch_size, shuffle=True, drop_last=True)
valid_loader = DataLoader(dataset_valid, batch_size=batch_size, shuffle=True, drop_last=True)
test_loader = DataLoader(dataset_test, batch_size=batch_size,shuffle=False, drop_last=True)

#LOAD MODEL
class ComplexModel(nn.Module):
    def __init__(self):
        super(ComplexModel, self).__init__()

        self.linear1 = nn.Linear(16, 216)
        self.act1 = nn.LeakyReLU()
        self.linear2 = nn.Linear(216, 128)
        self.act2 = nn.ReLU()
        self.linear3 = nn.Linear(128, 42)
        self.act3 = nn.ReLU()
        self.linear4 = nn.Linear(42, 7)

        self.dropout = nn.Dropout(0.1)
        self.bn1 = nn.BatchNorm1d(216)
        self.bn2 = nn.BatchNorm1d(84)

    def forward(self, x, training=False):
        x = self.act1(self.linear1(x))
        #x = self.bn1(x)
        x = self.dropout(x)
        x = self.act2(self.linear2(x))
        #x = self.bn2(x)
        x = self.dropout(x)
        x = self.act3(self.linear3(x))
        x = self.linear4(x)
        return x
teacher_model = ComplexModel().to(device)
teacher_model.load_state_dict(torch.load(config['save_path_large'], map_location=torch.device('cpu')))

#SHAP
for batch in test_loader:
  datas, labels, _ = batch
  datas, labels = datas.to(device), labels.to(device)
  explainer = shap.DeepExplainer(teacher_model, datas)
  break

#savefig
shap_values_teacher = explainer.shap_values(datas)
shap.summary_plot(shap_values_teacher, datas, valid_df.columns[:-1], show=False)
plt.savefig('shap-images/all_class.png')
plt.close()

#CF
d = dice_ml.Data(dataframe=valid_df, continuous_features=Xcol, outcome_name='Class')
backend ='PYT' 
m = dice_ml.Model(model=teacher_model, backend=backend)
# initiate DiCE
exp_random = dice_ml.Dice(d, m)
###############################################################
app = Flask(__name__)

# Configure CORS to allow requests from the React development server
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

@app.route('/api/process_shapClassPlot', methods=['POST']) #post selected shap class 
def process_shapClassPlot():
    try:
        # Get parameters from the JSON request data
        data = request.get_json()
        shapClass = data.get('shapClass')

        shap.summary_plot(shap_values_teacher[int(shapClass)], datas, valid_df.columns[:-1])
        summaryimage_filename = 'class_summary.png'
        plt.savefig('shap-images\\'+ summaryimage_filename)
        plt.close()
        shap.summary_plot(shap_values_teacher[int(shapClass)], datas, valid_df.columns[:-1], plot_type='bar')
        gbarimage_filename = 'class_gbar.png'
        plt.savefig('shap-images\\'+ gbarimage_filename)
        plt.close()
        #correlation
        posX=[]
        negX=[]
        for i in range(len(Xcol)):
            cor=np.corrcoef(datas[:,i:i+1].numpy().T, shap_values_teacher[int(shapClass)][:,i:i+1].T)[0,1]
            if cor>0: 
                posX.append(Xcol[i])
            elif cor<0:
                negX.append(Xcol[i])
        #pie chart
        abs_mean=np.abs(shap_values_teacher[1]).mean(0).tolist()  
        df = pd.DataFrame([abs_mean], columns =valid_df.columns[:-1])
        id=df.loc[0].sort_values().index
        val=df.loc[0].sort_values().values
        total=sum(val)
        labels = [f'{l}, {(s/total*100):0.1f}%' for l, s in zip(id, val)]
        pie = plt.pie(val,autopct='%1.1f%%', startangle=90)
        plt.axis('equal')
        plt.legend(bbox_to_anchor=(0.85, 1), loc='upper left', labels=labels)
        gPieImage_filename="gPie.png"
        plt.savefig('shap-images\\'+ gPieImage_filename)
        plt.close()
        
        # Send the image file's path to the frontend
        return jsonify({'image_path': summaryimage_filename,
                        'gBarImagePath': gbarimage_filename,
                        'posX':posX,
                        'negX':negX,
                        'gPieImagePath': gPieImage_filename})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get-plot-image/<image_filename>', methods=['GET'])
def get_plot_image(image_filename):
    print("get in")
    try:
        image_filename="shap-images/"+image_filename
        # Send the plot image file to the frontend
        return send_file(image_filename, mimetype='image/png')

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/process_cf', methods=['POST']) #post desired Y(class) to do CF
def process_cf():
    
    try:
        # Get parameters from the JSON request data
        data = request.get_json()
        
        desired_y = int(data.get('desired_y'))
        inputX=data.get('inputX')
        floatX = [[float(i) for i in inputX]]
        query_instances = pd.DataFrame(floatX, columns =Xcol)
        # query_instances = test_df.iloc[4:5, :]   
        dice_exp = exp_random.generate_counterfactuals(query_instances, total_CFs=2, desired_class=desired_y, verbose=False)   
        df_qi=dice_exp.cf_examples_list[0].test_instance_df
        df_cf=dice_exp.cf_examples_list[0].final_cfs_df
        df_json = df_qi.append(df_cf).to_json(orient='records')

        return jsonify(df_json)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Return a default response when there are no exceptions
    return jsonify({'message': 'Success'})

@app.route('/api/process_depClassPlot', methods=['POST']) #post selected shap classes and  plor dependence_plot
def process_depClassPlot():
    try:
        # Get parameters from the JSON request data
        data = request.get_json()
        class1 = data.get('depClass1')
        class2= data.get('depClass2')
        depY = data.get('depY')

        shap.dependence_plot(class1, shap_values_teacher[int(depY)], datas.numpy(), valid_df.columns[:-1], interaction_index=class2)
        image_filename_d1 = 'dep1.png'
        plt.savefig('shap-images\dep1.png')
        plt.close()
        shap.dependence_plot(class2, shap_values_teacher[int(depY)], datas.numpy(), valid_df.columns[:-1], interaction_index=class1)
        image_filename_d2 = 'dep2.png'
        plt.savefig('shap-images\dep2.png')
        plt.close()
        # Send the image file's path to the frontend
        return jsonify({'image_pathD1': image_filename_d1, 'image_pathD2': image_filename_d2})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
