# common packages
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('agg') 
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
import json
import os
import sys
sys.path.append('../pytorch/utils')
sys.path.append('../dataquality')

# Django
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import FullProcess
from .models import Dataset
from .models import ActiveLearning

# torch
import torch
from torch.utils.data import DataLoader
from torch.utils.data.sampler import SubsetRandomSampler
from torchinfo import summary

# functions from pytorch folder
from pytorch.config import config
from pytorch.config import datasetConfig
from pytorch.utils.utils import connectDevice
from pytorch.utils.dataset import IndexedDataset
from pytorch.utils.functions import choose_teacher
from pytorch.utils.functions import modify_valid_record
from pytorch.utils.query import query_the_oracle
from pytorch.utils.modelStructures import ComplexModel
from pytorch.utils.modelStructures import SimpleModel
from pytorch.utils.trainModel import use_labeled_to_train
from pytorch.utils.trainModel import final_train_teacher
from pytorch.utils.trainModel import final_train_student
from pytorch.utils.trainModel import test

# sklearn
from sklearn.model_selection import train_test_split

# shap
import shap
import dice_ml

# data quality
from dataquality.missForest import MissForest
from dataquality.em import impute_em
from dataquality.fcm import FCMImputer
from dataquality.continuous import continuous
from dataquality.metric_model import generate_stack_prediction

# write config
import re

@api_view(['GET'])
def getRoutes(request):
  # when going to 8000/api/, the page shows how we get access to each backend server

  routes = [
    {
      'Endpoint': '/upload/',
      'method': 'POST',
      'body': None,
      'description': 'Upload file'
    },
  ]

  return Response(routes)

@api_view(['GET'])
def getStatus(request):
  print("\n\n ====== done reloading ====== \n\n")
  return JsonResponse({'status': 'running'})

@api_view(['POST'])
def uploadTrainData(request):

  print("\n\n ====== upload train data ====== \n\n")
  # data = json.loads(request.body)
  if request.method == 'POST' and request.FILES['file']:
    print('========= file =========')
    print(request.FILES['file'])
    uploaded_file = request.FILES['file']

    # if not os.path.exists('../dataquality/data'):
    #     os.makedirs('../dataquality/data')

    destination1 = open(os.path.join('./dataquality/data', 'train_data_miss.csv'), 'wb+')
    destination2 = open(os.path.join('./pytorch/data', 'train_data.csv'), 'wb+') # 預設的補植後資料是上傳資料

    for chunk in uploaded_file.chunks():
      # print('========= writing =========')
      # print(chunk)
      destination1.write(chunk)
      destination2.write(chunk)
    destination1.close()
    destination2.close()

    # df = pd.read_csv(datasetConfig['train_data_miss_path'])
    # datasetConfig['num_feature'] = len(df.columns) - 1
    # num_feature=len(df.columns) - 1
    # with open('./pytorch/config.py', 'r') as file:
    #   filedata = file.read()
    # filedata = re.sub(r"'num_feature':\d+", f"'num_feature':{num_feature}", filedata)
    # with open('./pytorch/config.py', 'w') as file:
    #     file.write(filedata)
    # print(f"\n\n ====== num_feature = {datasetConfig['num_feature']} ====== \n\n")
    

    return JsonResponse({'msg': 'Train data uploaded successfully'})

  return JsonResponse({'msg': 'Invalid request'}, status=400)
  # return Response(data)

@api_view(['POST'])
def uploadTestData(request):

  print("\n\n ====== upload test data ====== \n\n")
  # data = json.loads(request.body)
  if request.method == 'POST' and request.FILES['file']:
    print('========= file =========')
    print(request.FILES['file'])
    uploaded_file = request.FILES['file']

    # if not os.path.exists('../dataquality/data'):
    #     os.makedirs('../dataquality/data')

    destination1 = open(os.path.join('./dataquality/data', 'test_data_miss.csv'), 'wb+')
    destination2 = open(os.path.join('./pytorch/data', 'test_data.csv'), 'wb+') # 預設的補植後資料是上傳資料

    for chunk in uploaded_file.chunks():
      # print('========= writing =========')
      # print(chunk)
      destination1.write(chunk)
      destination2.write(chunk)
    destination1.close()
    destination2.close()
    
    return JsonResponse({'msg': 'Test data uploaded successfully'})

  return JsonResponse({'msg': 'Invalid request'}, status=400)
  # return Response(data)

@api_view(['POST'])
def setLabelAndColNum(request):

  print("\n\n ====== set label and column name ====== \n\n")
  # data = json.loads(request.body)
  data = json.loads(request.body) 
  setting_value = data['label']
  df= pd.read_csv(datasetConfig['train_data_miss_path'])
  num_feature=len(df.columns) - 1
  class_amount = len(df[setting_value].unique())
  
  df_data_info=pd.DataFrame({'label_name':setting_value,'num_feature':num_feature,'class_amount':class_amount}, index=[0])
  print(df_data_info)
  df_data_info.to_csv(f"{datasetConfig['data_info_path']}", index=False)

  # with open('./pytorch/config.py', 'r') as file:
  #   filedata = file.read()

  # # Perform the substitutions
  # filedata = re.sub(r"'label_name':'[^']*'", f"'label_name':'{setting_value}'", filedata)
  # filedata = re.sub(r"'num_feature':\d+", f"'num_feature':{num_feature}", filedata)
  # filedata = re.sub(r"'class_amount':\d+", f"'class_amount':{class_amount}", filedata)

  # # Write the file
  # with open('./pytorch/config.py', 'w') as file:
  #   file.write(filedata)

  # Print the values
  # print(f"\n\n ====== label_name = {datasetConfig['label_name']} ====== \n\n")
  # print(f"\n\n ====== num_feature = {datasetConfig['num_feature']} ====== \n\n")
  # print(f"\n\n ====== class_amount = {datasetConfig['class_amount']} ====== \n\n")
  df_data_info_r=pd.read_csv(f"{datasetConfig['data_info_path']}")
  
  print(f"\n\n ====== label_name = {df_data_info_r.loc[0, 'label_name']} ====== \n\n")
  print(f"\n\n ====== num_feature = {df_data_info_r.loc[0, 'num_feature']} ====== \n\n")
  print(f"\n\n ====== class_amount = {df_data_info_r.loc[0, 'class_amount']} ====== \n\n")

  

    
  return JsonResponse({'msg': f"Set Label: {setting_value} and Set ColNum {num_feature} "})

  # return JsonResponse({'msg': 'Invalid request'}, status=400)
  # return Response(data)

@api_view(['DELETE'])
def clearProcess(request):
  if Dataset.objects.exists():
    print("\n\n ======== Some Dataset object exists ========\n\n")
    Dataset.objects.all().delete()

  if ActiveLearning.objects.exists():
    print("\n\n ======== Some ActiveLearning object exists ========\n\n")
    ActiveLearning.objects.all().delete()

  if FullProcess.objects.exists():
    print("\n\n ======== Some FullProcess object exists ========\n\n")
    FullProcess.objects.all().delete()

  return Response({'msg':"previous process deleted"})


@api_view(['POST'])
def initProcess(request):
  query_size = config['query_size']
  pool_size = config['pool_size']
  learning_rate = config['learning_rate']
  n_epochs = config['n_epochs']
  batch_size = config['batch_size']

  process = FullProcess.objects.create(
    processID = 1, # just use as a foreign key
    initTrainingDataNum = 0,
    initTrainingDataSelectMethod = 'Randomly Generate',
    trainingModel = '3 Layer Neural Network Model',
    uncertaintyQueryMethod = 'Margin',
    querySize = query_size,
    poolingSize = pool_size,
    learningRate = learning_rate,
    numEpochs = n_epochs,
    batchSize = batch_size,
    finalTeacherAcc = 0,
    finalStudentAcc = 0,
  )

  # init the dataset
  process.dataset.create(
    name = 'just-init-no-any-data',
    df = pd.DataFrame({}),
  )

  # init the corresponding AL attributes, and there will only be 1 AL table 
  process.activelearning.create(
    nthIter = [],
    cumulatedNumData = [],
    trainAcc = [],
    testAcc = [],
  )    
  process.save()

  print("\n\n============== initProcess doneconfig ==============\n\n")

  return Response({'msg':"init process done"})


@api_view(['POST'])
def readMissData(request):
  print(f"\n\n ====== readMissData ====== \n\n")
  df_data_info_r=pd.read_csv(f"{datasetConfig['data_info_path']}")
  label_name = df_data_info_r.loc[0, 'label_name']
  # print(f"\n\n ====== label_name = {label_name} ====== \n\n")

  df_train_miss = pd.read_csv(datasetConfig['train_data_miss_path'])
  df_test_miss = pd.read_csv(datasetConfig['test_data_miss_path'])
  
  if not Dataset.objects.filter(name = 'train-miss').exists():
    msg = 'dataset does not exist, now store one in'
    print(f"\n\n{msg}\n\n")

    process = FullProcess.objects.all().order_by("-id")[0] # the greatest id

    # store training dataset
    num_train = df_train_miss.shape[0]
    process.dataset.create(
      name = 'train-miss', df = df_train_miss,
      data = df_train_miss.drop(label_name, axis=1), labels = df_train_miss[label_name],
      labelOrNot = [0 for _ in range(num_train)],
      predictionRecord = [[] for _ in range(num_train)],
    )
    process.save()

    # store training dataset
    num_test = df_test_miss.shape[0]
    process.dataset.create(
      name = 'test-miss', df = df_test_miss,
      data = df_test_miss.drop(label_name, axis=1), labels = df_test_miss[label_name],
      labelOrNot = [0 for _ in range(num_test)],
      predictionRecord = [[] for _ in range(num_test)],
    )
    process.save()
  else:
    # no object satisfying query exists
    msg = 'dataset already exists, no need to store again'
  print(f"\n\n{msg}\n\n")

  return Response({'msg':f'{msg}'})


@api_view(['POST'])
def readALData(request):
  print(f"\n\n ====== readALData ====== \n\n")
  df_data_info_r=pd.read_csv(f"{datasetConfig['data_info_path']}")
  label_name = df_data_info_r.loc[0, 'label_name']
  print('label_name = ', label_name)
  df = pd.read_csv(datasetConfig['train_data_path'])
  # df[label_name] = df[label_name].apply(lambda x: x - 1) #original data
  
  print(df.head())
  df_train, df_valid = train_test_split(df, test_size=0.2, random_state=42) # valid_ratio = 0.2
  df_train = df_train.reset_index(drop=True)

  df_test = pd.read_csv(datasetConfig['test_data_path'])
  # df_test[label_name] = df_test[label_name].apply(lambda x: x - 1) #original data

  msg = ''
  if not Dataset.objects.filter(name = 'train-raw').exists():
    # at least one object satisfying query exists
    msg = 'dataset does not exist, now store one in'

    process = FullProcess.objects.all().order_by("-id")[0] # the greatest id

    # store training dataset
    num_train = df_train.shape[0]
    # print("========== create train-raw ==========")
    # print("columns: ", df_train.columns)
    # print("label: ", label_name)
    process.dataset.create(
      name = 'train-raw', df = df_train,
      data = df_train.drop(label_name, axis=1), labels = df_train[label_name],
      labelOrNot = [0 for _ in range(num_train)],
      predictionRecord = [[] for _ in range(num_train)],
    )
    process.save()

    # store validation dataset
    num_valid = df_valid.shape[0]
    process.dataset.create(
      name = 'valid-raw', df = df_valid,
      data = df_valid.drop(label_name, axis=1), labels = df_valid[label_name],
      labelOrNot = [1 for _ in range(num_valid)],
      predictionRecord = [[] for _ in range(num_valid)],
    )
    process.save()

    # store testing dataset
    num_test = df_test.shape[0]
    process.dataset.create(
      name = 'test-raw', df = df_test,
      data = df_test.drop(label_name, axis=1), labels = df_test[label_name],
      labelOrNot = [1 for _ in range(num_test)],
      predictionRecord = [[] for _ in range(num_test)],
    )
    process.save()
  else:
    # no object satisfying query exists
    msg = 'dataset already exists, no need to store again'
  print(f"\n\n{msg}\n\n")

  return_msg = 'Enter Active Learning Process!'
  return Response({'msg': return_msg, 'datasetMsg': f'{msg}'})


@api_view(['GET'])
def getData(request, pk):    
  if not Dataset.objects.filter(name=pk).exists():
    print(f"dataset {pk} does not exist!")

  dataset = Dataset.objects.get(name=pk)
  
  df = dataset.df
  print('===== df =====')
  print(df.columns)
  rawData = df.round(4).to_dict(orient='records')
  numRows = df.shape[0]
  numCols = df.shape[1] - 1 # 前端叫的是訓練集，所以欄位數量要扣掉標籤欄

  data = {
    'msg': "Get complete data successfully!", 
    'rawData': rawData, 'keys': list(rawData[0].keys()),
    'numRows': numRows, 'numCols': numCols
  }
  return Response(data)


@api_view(['GET'])
def getFeaturesAndLabel(request, type):
  print("\n\n ====== getFeaturesAndLabel ====== \n\n")
  df_data_info_r=pd.read_csv(f"{datasetConfig['data_info_path']}")
  label_name = df_data_info_r.loc[0, 'label_name']

  if type == 'miss':
    df = pd.read_csv(datasetConfig['test_data_miss_path'])
    all_columns = ['Statistical Numbers'] + list(df.columns)
    features = list(df.columns)
    features.remove(label_name)
    return Response({
      'allColumns': all_columns,
      'featureNames': features,
      'labelName': label_name,
    })
  elif type == 'complete':
    df = pd.read_csv(datasetConfig['test_data_path'])
    all_columns = df.columns
    features = list(df.columns)
    features.remove(label_name)
    classes=list(df[label_name].unique())
    return Response({
      'allColumns': all_columns,
      'featureNames': features,
      'labelName': label_name,
      'labelValue': classes, # 所有類別種類 ex. class 1, class 2, class 3
    })
  elif type == 'upload':
    df = pd.read_csv(datasetConfig['train_data_miss_path'])
    all_columns = df.columns
    return Response({
      'allColumns': all_columns,
    })  

  return Response({
    'allColumns': None,
    'featureNames': None,
    'labelName': None,
  })


@api_view(['POST', 'PUT']) # 'DELETE'? 
def setMethodsAndConfigs(request):
  data = json.loads(request.body) 
  setting_type = data['type']
  setting_value = data['value']

  process = FullProcess.objects.all().order_by("-id")[0]

  type_name = ''
  if setting_type == 'SetYLabel':
    type_name = 'Y label'
    process.yLabel = setting_value
    # datasetConfig['label_name'] = setting_value
    # with open('./pytorch/config.py', 'r') as file:
    #   filedata = file.read()
    # filedata = re.sub(r"'label_name':'[^']*'", f"'label_name':'{setting_value}'", filedata)
    # with open('./pytorch/config.py', 'w') as file:
    #     file.write(filedata)
    # print(f"\n\n ====== label_name = {datasetConfig['label_name']} ====== \n\n")

  elif setting_type == 'SelectImputer':
    type_name = 'imputer'
    process.imputerMethod = setting_value 

  elif setting_type == 'SetInitNumData':
    type_name = 'initial training number of data'
    process.initTrainingDataNum = setting_value

  elif setting_type == 'SelectInitData':
    type_name = 'initial training data selecting method'
    process.initTrainingDataSelectMethod = setting_value

  elif setting_type == 'SelectModel':
    type_name = 'training model'
    process.trainingModel = setting_value

  elif setting_type == 'SetNumDataPerIter':
    type_name = 'number of data add per iteration'
    process.querySize = setting_value

  elif setting_type == 'SelectUncertaintyMethod':
    type_name = 'uncertainty query method'
    process.uncertaintyQueryMethod = setting_value

  elif setting_type == 'SetLearningRate':
    type_name = 'learning rate'
    process.learningRate = setting_value

  elif setting_type == 'SetPoolingSize':
    type_name = 'pooling size'
    process.poolingSize = setting_value

  elif setting_type == 'SetNumEpoch':
    type_name = 'number of epochs'
    process.numEpochs = setting_value

  elif setting_type == 'SetBatchingSize':
    type_name = 'batch size'
    process.batchSize = setting_value

  process.save()

  msg = f"Set {type_name} {data['value']} successfully!"

  print(f"\n\nsetting type = {data['type']}, value = {data['value']}\n\n")
  return Response({'msg': msg})


@api_view(['POST'])
def doEDA(request):
  print(f"\n\n ====== doEDA ====== \n\n")
  df_data_info_r=pd.read_csv(f"{datasetConfig['data_info_path']}")
  label_name = df_data_info_r.loc[0, 'label_name']

  def EDA(df, type):
    folder_path = f'./edash'
    if not os.path.isdir(folder_path):
      print("\n === No folder for edash, make one now === \n")
      os.mkdir(folder_path)

    """ data description: df.describe() """
    df_des = df.describe().reset_index().rename(columns={'index': 'Statistical Numbers'})

    """ missing value dataframe """
    df_missing_value = df_miss.isnull().mean().reset_index()
    df_missing_value.columns = ['Feature', 'Missing Rate(%)']
    df_missing_value['Missing Rate(%)'] = df_missing_value['Missing Rate(%)'] * 100

    """ missing value plot """
    missing_values = df.isnull().sum().sort_values(ascending=False)

    sns.set(style="whitegrid") # Set a nicer style using seaborn

    missing_value_plot_name = f'missing_values_plot-{type}.png'
    plt.figure(figsize=(30, 9))  
    sns.barplot(x=missing_values.index, y=missing_values.values, palette="Blues")  # Use a blue-like color palette
    plt.title('Missing Values in Each Column', fontsize=16)
    plt.xlabel('Columns', fontsize=14)
    plt.ylabel('Number of Missing Values', fontsize=14)
    plt.xticks(rotation=90, ha='right', fontsize=12)
    plt.yticks(fontsize=12)
    plt.tight_layout()  # Adjust layout for better appearance
    plt.savefig(f'{folder_path}/{missing_value_plot_name}')
    plt.close()

    """ label class ratio """
    label_counts = df[label_name].value_counts()

    label_class_pie_plot = f'label_class_ratio-{type}.png'
    plt.figure(figsize=(8, 8))  
    plt.pie(label_counts, labels=label_counts.index, autopct='%1.1f%%', startangle=140)
    # plt.title('Distribution of Label Classes')
    plt.savefig(f'{folder_path}/{label_class_pie_plot}')
    plt.close()

    return df_des, df_missing_value, missing_value_plot_name, label_class_pie_plot

  df_train_miss = Dataset.objects.get(name='train-miss').df
  df_test_miss = Dataset.objects.get(name='test-miss').df
  df_miss = pd.concat([df_train_miss, df_test_miss], axis=0).reset_index(drop=True)
  df_des, df_missing_value, miss_plot, label_class_ratio = EDA(df_miss, type='all')

  return Response({
    'msg': "Finish EDA of the raw data!",
    'all': {
      'description': df_des.round(4).to_dict(orient='records'), 
      'missingValueTable': df_missing_value.round(4).to_dict(orient='records'),
      'missingValueTableColumns': df_missing_value.columns.to_list(),
      'missingValuePlot': miss_plot, 
      'labelClassRatioPlot': label_class_ratio,
    }
  })


@api_view(['GET'])
def startImpute(request):
  def random_data(seed = 42, upperbound = 0.5, num = 100, features = 2):   
    ''' Generate random data '''
    np.random.seed(seed)
    data = np.random.rand(num, features)
    # data[data < upperbound] = np.nan
    return data
  

  process = FullProcess.objects.all().order_by("-id")[0]
  imputeMethod = process.imputerMethod
  print(f"\n\n ====== {imputeMethod} ====== \n\n")

  folder_path = f'./imputedData'
  if not os.path.isdir(folder_path):
    print("\n === No folder for imputed data, make one now === \n")
    os.mkdir(folder_path)

  df_data_info_r=pd.read_csv(f"{datasetConfig['data_info_path']}")
  label_name = df_data_info_r.loc[0, 'label_name']
  df_train = pd.read_csv(datasetConfig['train_data_miss_path'])
  df_test = pd.read_csv(datasetConfig['test_data_miss_path'])
  df = pd.concat([df_train, df_test], axis=0).reset_index(drop=True)
  X = df.drop(label_name, axis=1)
  y = df[label_name]

  if imputeMethod == 'Genetic-enhanced fuzzy c-means':
    data = random_data(42, 0.1, 100, 8)
    data[0:80, [1, 3, 6]] = np.nan

    fcmImputer = FCMImputer(data = data, num_clusters = 3) 
    after = fcmImputer.impute()

  elif imputeMethod == 'Expectation-Maximization':
    result = impute_em(X, max_iter=25)
    df_imputed = result['X_imputed']

  elif imputeMethod == 'Miss-forest':
    imputer = MissForest()
    df_imputed = imputer.fit_transform(X) 

  data_imputed = pd.concat([df_imputed, y], axis=1)

  print("\n === CONCATED === \n")
  len_train = len(df_train)
  len_test = len(df_test)

  imputed_train = data_imputed.iloc[:len_train]
  imputed_test = data_imputed.iloc[len_train:len_train+len_test]

  imputed_train.to_csv(f"{datasetConfig['train_data_path']}", index=False)
  imputed_test.to_csv(f"{datasetConfig['test_data_path']}", index=False)
  # data_train.to_csv(f"{datasetConfig['train_data_path']}", index=False)
  # data_test.to_csv(f"{datasetConfig['test_data_path']}", index=False)

  # data_imputed.to_csv(f"{datasetConfig['test_data_path']}", index=False)

  print("\n === TO_CSV === \n")

  data = { 
    'msg': "Finish Data Imputation!",
    'imputeMethod': imputeMethod, 
    'imputedData': data_imputed.round(4).to_dict(orient='records'),
  }
  return Response(data)


@api_view(['GET'])
def getImputedDetails(request):
  print(f"\n\n ====== getImputedDetails ====== \n\n")

  df_train_miss = pd.read_csv(datasetConfig['train_data_miss_path'])
  df_test_miss = pd.read_csv(datasetConfig['test_data_miss_path'])

  df_train_complete = pd.read_csv(datasetConfig['train_data_path'])    
  df_test_complete = pd.read_csv(datasetConfig['test_data_path'])

  df_miss = pd.concat([df_train_miss, df_test_miss], axis=0).reset_index(drop=True)
  df_complete = pd.concat([df_train_complete, df_test_complete], axis=0).reset_index(drop=True)

  print(df_miss.shape)
  print(df_complete.shape)

  df = pd.DataFrame(np.random.randn(1000, 7), columns=['var1', 'var2', 'var3', 'var4', 'var5', 'var6', 'var7'])
  tmp = pd.DataFrame(np.random.randn(100, 7), columns=['var1', 'var2', 'var3', 'var4', 'var5', 'var6', 'var7'])

  cont = continuous()

  # comparison = cont.comparison(df, tmp)
  comparison = cont.comparison(df_miss, df_complete)
  print(comparison)

  print(f"\n\n ====== got imputed details ====== \n\n")

  return Response({ 'msg': "Got details of the imputation!", 'comparison': comparison })


@api_view(['GET'])
def getMetricEvalValue(request):
  print(f"\n\n ====== getMetricEvalValue ====== \n\n")

  df_train = pd.read_csv(datasetConfig['train_data_path'])
  df_test = pd.read_csv(datasetConfig['test_data_path'])

  # split x, y, respectively
  df_data_info_r=pd.read_csv(f"{datasetConfig['data_info_path']}")
  label_name = df_data_info_r.loc[0, 'label_name']
  X_train = df_train.drop(label_name, axis=1) 
  y_train = df_train[label_name]

  X_test = df_test.drop(label_name, axis=1)
  y_test = df_test[label_name]

  result = generate_stack_prediction(X_train, y_train, X_test, y_test)

  return Response({ 'msg': "Finish evaluating the imputation!", 'result': result })


@api_view(['GET'])
def getUncertaintyRank(request, iter):
  # get data from database
  process = FullProcess.objects.all().order_by("-id")[0] 

  # params
  query_size = process.querySize
  strategy = process.uncertaintyQueryMethod
  pool_size = process.poolingSize
  batch_size = process.batchSize

  # datasets
  df_train = process.dataset.get(name='train-raw').df
  df_valid = process.dataset.get(name='valid-raw').df
  dataset_train = IndexedDataset(df_train)
  dataset_valid = IndexedDataset(df_valid, TestOrValid=True, Valid=True)
  valid_loader = DataLoader(dataset_valid, batch_size=batch_size, shuffle=True, drop_last=True)

  # cpu or gpu
  device = connectDevice()
  iteration = int(iter)

  # model
  model = ComplexModel().to(device=device)
  model.load_state_dict(torch.load(f'./trainingModels/model_{iteration}.pt'))
  

  # query session
  # 每個iteration的開始加入一些labeled data 到training，用上個迴圈還沒被重置的model
  uncertain_idx = query_the_oracle(model, device, dataset_train, query_size=query_size, query_strategy=strategy, pool_size=pool_size) #用上一輪的model去拿到新的資料
  # update_idx, update_records = modify_valid_record(model, device, valid_loader, dataset_valid, uncertain_idx) #用上一輪的model去更新valid上的預測至目前

  # 這些 id 在 torch dataset 有紀錄「已 label」，但要在這邊再寫一次去更動資料庫那邊
  ds_train_db = Dataset.objects.get(name='train-raw')
  
  for index in uncertain_idx:
    ds_train_db.labelOrNot[index] = 1
  ds_train_db.save()

  # 回傳一個陣列，是 uncertainty 從最不確定到第 querySize 不確定的資料
  print("\n ===== uncertain indices =====\n")
  print(uncertain_idx)

  # # modify validation record
  # print("\n ===== update_idx =====\n")
  # update_idx = update_idx.tolist()
  # print(update_idx)
  # print("\n ===== update_records =====\n")
  # print(update_records)

  # ds_valid_db = Dataset.objects.get(name='valid-raw')
  # print(len(ds_valid_db.labelOrNot))
  # print(ds_valid_db.labelOrNot)
  # print(len(ds_valid_db.predictionRecord))
  # print(ds_valid_db.predictionRecord)

  # for i, pred_id in enumerate(update_idx):
  #     ds_valid_db.predictionRecord[pred_id].append(update_records[i])
  # ds_valid_db.save()

  al = ActiveLearning.objects.all().order_by("-id")[0]
  if len(al.queryIdxByIter) < iteration + 1:
    al.queryIdxByIter.append(uncertain_idx)
  else:
    al.queryIdxByIter[iteration] = uncertain_idx
  al.save()

  # 包裝好的 uncertain 資料（包括欄位）
  uncertain_data = []
  features = df_train.columns
  for idx in uncertain_idx:
    # 從訓練資料集裡面，對照著 uncertain idx，把那行的資料全部顯示（或重要欄位）
    row = {'trueId': idx}
    for f in features:
      row[f] = round(df_train[f][idx], 4)

    uncertain_data.append(row)

  keys = list(['trueId'] + list(features))
  data = {
    'msg': f"Get uncertainty ranking of prediction {iteration} successfully!",
    'uncertainIdx': uncertain_idx,
    'uncertainData': uncertain_data, # 這裡要是包好的 uncertain 資料
    'keys': keys,
  }
  return Response(data)


@api_view(['GET'])
def plotCumulation(request): # , iter
  print(f"\n ================= plotCumulation ================= \n")
  al = ActiveLearning.objects.all().order_by("-id")[0]
  iters = al.nthIter
  num_datas = al.cumulatedNumData
  train_accs = al.trainAcc
  test_accs = al.testAcc

  dashboard_plots_path = './dashboard'
  if not os.path.isdir(dashboard_plots_path):
    print("\n === No folder for plots of dashboard, make one now === \n")
    os.mkdir(dashboard_plots_path)

  ds_train_db = Dataset.objects.get(name='train-raw')
  labeled_idx = ds_train_db.labelOrNot
  labeled_idx = np.array([i for i, x in enumerate(labeled_idx) if x == 1])

  labels = ds_train_db.labels
  true_labels_by_idx = np.array(labels)
  true_labels_by_idx = true_labels_by_idx[labeled_idx]

  """ labeled-to-all ration pie chart """
  ratio = len(true_labels_by_idx ) / ds_train_db.df.shape[0]
  labels = ['Labeled', 'Unlabeled']
  sizes = [ratio, 1 - ratio]
  colors = ['lightcoral', 'lightskyblue']
  labeled_to_all_plot_name = 'label-to-all-ratio.png'
  labeled_to_all_plot_path = f'{dashboard_plots_path}/{labeled_to_all_plot_name}'
  plt.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=140)
  plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
  plt.title('Labeled-to-All Data Ratio')
  plt.savefig(f'{labeled_to_all_plot_path}')
  plt.close()

  """ labeled class counts pie chart """
  number_counts = Counter(list(true_labels_by_idx))
  labels = [str(number) for number in number_counts.keys()]
  colors = ['gold', 'lightskyblue', 'lightcoral', 'lightgreen', 'lightpink', 'lightgray']
  labeled_class_plot_name = 'labelClass-ratio.png'
  labeled_class_plot_path = f'{dashboard_plots_path}/{labeled_class_plot_name}'
  plt.pie(number_counts.values(), labels=labels, colors=colors, autopct='%1.1f%%', startangle=140)
  plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
  plt.title('Labeled Class Ratio')
  plt.savefig(f'{labeled_class_plot_path}')
  plt.close()

  """ Cumulated Number of Training Data """
  num_data_plot_name = 'iter-numData.png'
  num_data_plot_path = f'{dashboard_plots_path}/{num_data_plot_name}'
  plt.plot(iters, num_datas)
  plt.xlabel('Iteration')
  plt.ylabel('Number of Training Data')
  plt.title('Cumulated Number of Training Data')
  plt.savefig(f'{num_data_plot_path}')
  plt.close()

  """ Training Accuracy by Iteration """
  train_acc_plot_name = 'iter-trainAcc.png'
  train_acc_plot_path = f'{dashboard_plots_path}/{train_acc_plot_name}'
  plt.plot(iters, train_accs)
  plt.xlabel('Iteration')
  plt.ylabel('Accuracy')
  plt.yticks(np.arange(0, 1.1, 0.1))
  plt.title('Training Accuracy by Iteration')
  plt.savefig(f'{train_acc_plot_path}')
  plt.close()

  """ Test Accuracy by Iteration """
  test_acc_plot_name = 'iter-testAcc.png'
  test_acc_plot_path = f'{dashboard_plots_path}/{test_acc_plot_name}'
  plt.plot(iters, test_accs)
  plt.xlabel('Iteration')
  plt.ylabel('Accuracy')
  plt.yticks(np.arange(0, 1.1, 0.1))
  plt.title('Test Accuracy by Iteration')
  plt.savefig(f'{test_acc_plot_path}')
  plt.close()

  return Response({
    'msg': 'plotting cumulated info...',
    'labeledToAllRatioPlot': labeled_to_all_plot_name,
    'labeledClassRatioPlot': labeled_class_plot_name, 
    'cumuNumDataPlot': num_data_plot_name, 
    'cumuTrainAccPlot': train_acc_plot_name,
    'cumuTestAccPlot': test_acc_plot_name,
  })


@api_view(['POST'])
def trainInitModel(request):
  device = connectDevice()

  process = FullProcess.objects.all().order_by("-id")[0] 
  query_size = process.initTrainingDataNum # config['query_size']
  pool_size = process.poolingSize
  batch_size = process.batchSize

  print("\n ====== get train dataset =====\n")

  train_df = process.dataset.get(name='train-raw').df
  dataset_train = IndexedDataset(train_df)

  print("\n ====== get valid dataset =====\n")
  valid_df = process.dataset.get(name='valid-raw').df
  dataset_valid = IndexedDataset(valid_df, TestOrValid=True, Valid=True)
  valid_loader = DataLoader(dataset_valid, batch_size=batch_size, shuffle=True, drop_last=True)

  test_df = process.dataset.get(name='test-raw').df
  dataset_test = IndexedDataset(test_df, TestOrValid=True)
  test_loader = DataLoader(dataset_test, batch_size=batch_size,shuffle=False, drop_last=True)

  # 第0個model, 初始的model用20個統一初始資料來訓練，理論上三種取樣方式的起始test_acc會差不多
  model = ComplexModel().to(device) #先訓練一個seed model 用初始隨機資料
  initial_train_idx = query_the_oracle(model, device, dataset_train, query_size=query_size, query_strategy='init', pool_size=pool_size) #取得的參數統一為init
  print("\n ===== initial_train_idx =====\n")
  print(initial_train_idx) 


  labeled_idx = np.array(initial_train_idx)
  ds_train_db = Dataset.objects.get(name='train-raw')
  labels = ds_train_db.labels
  true_labels_by_idx = np.array(labels)
  true_labels_by_idx = true_labels_by_idx[labeled_idx]
  print(true_labels_by_idx)

  train_acc, train_loss, valid_loss, num_data_trained = use_labeled_to_train(model, device, dataset_train, valid_loader, teacher_model=model, labeled_idx=labeled_idx, true_labels_by_idx=true_labels_by_idx, batch_size=batch_size, kd=False) #訓練, teacher隨便放

  print("\n ===== done use_labeled_to_train =====\n")
  # 這些 id 在 torch dataset 有紀錄「已 label」，但要在這邊再寫一次去更動資料庫那邊
  ds_train_db = Dataset.objects.get(name='train-raw')
  for index in initial_train_idx:
    ds_train_db.labelOrNot[index] = 1
  ds_train_db.save()

  # Test the model on test set
  test_acc = test(model, device, test_loader)
  print(f"Iteration: 0, test acc: {test_acc}\n")

  # save model to a folder
  model_folder_path = f'./trainingModels'
  if not os.path.isdir(model_folder_path):
    print("\n === No folder for training models, make one now === \n")
    os.mkdir(model_folder_path)

  model_path = f'{model_folder_path}/model_0.pt'
  torch.save(model.state_dict(), model_path) 

  # store results to database
  al = ActiveLearning.objects.all().order_by("-id")[0]
  # if-else for checking whether initial model is trained, if yes, replace the old result
  if len(al.nthIter) == 0:
    al.nthIter.append(0)  
  else:
    al.nthIter[0] = 0
  if len(al.cumulatedNumData) == 0:
    al.cumulatedNumData.append(num_data_trained)
  else:
    al.cumulatedNumData[0] = num_data_trained
  if len(al.trainAcc) == 0:
    al.trainAcc.append(0.235)
  else:
    al.trainAcc[0] = 0.235
  if len(al.testAcc) == 0:
    al.testAcc.append(test_acc)
  else:
    al.testAcc[0] = test_acc
  
  al.save()

  data = { 'msg': "Finish training initial model!", 'acc': 0.235 }
  return Response(data)


@api_view(['POST'])
def trainALModel(request, iter):
  data = json.loads(request.body)
  print(data)

  process = FullProcess.objects.all().order_by("-id")[0] 
  al = ActiveLearning.objects.all().order_by("-id")[0]
  iteration = int(iter)

  # check if the user has not moved on to next iteration
  if iter in al.nthIter:
    if iter == al.nthIter[-1]: # 連續按了兩次 train 按鈕
      return Response({
        'msg': f'AL model {iter} has been trained, please move on to the next iteration',
        'status': 'repeated',
        })
    else:
      iteration = int(al.nthIter[-1]) + 1
  
  print(f"\n\n =============== {iteration} ===============\n\n") 
  
  # training session
  batch_size = process.batchSize
  device = connectDevice()

  '''看看當今model會錯在哪裡用來更新C(correct consistency),也代表著這個被傳入的model不會是teacher(除了前面兩輪)
     同時找到過往的teacher -> '''
  # number_teacher = choose_teacher(model, dataset_valid, valid_loader, previous_model_num = iteration) #iteration從1~50 拿到teacher是哪個過往model
  # teacher_list.append(number_teacher)
  model = ComplexModel().to(device) #重新訓練一個model在每個iteration, 跟一個代表過往模型的teacher_model
  # print(f'This iteration {iteration}, the teacher is {number_teacher}')
  teacher_model = ComplexModel().to(device)
  teacher_model.load_state_dict(torch.load(f'./trainingModels/model_{iteration-1}.pt'))
  teacher_model.eval()

  '''此處採用Knowledge Distillation來訓練'''
  
  valid_df = process.dataset.get(name='valid-raw').df
  dataset_valid = IndexedDataset(valid_df, TestOrValid=True, Valid=True)
  valid_loader = DataLoader(dataset_valid, batch_size=batch_size,shuffle=False, drop_last=True)

  # get labeled training data indices
  ds_train_db = Dataset.objects.get(name='train-raw')
  labeled_idx = ds_train_db.labelOrNot

  labeled_idx = np.array([i for i, x in enumerate(labeled_idx) if x == 1])
  print(labeled_idx)

  labels = ds_train_db.labels
  true_labels_by_idx = np.array(labels)
  true_labels_by_idx = true_labels_by_idx[labeled_idx]
  print(true_labels_by_idx)
  
  # 這裡要用 labeled_idx, true_labels_by_idx 去做一個 dataset_train
  train_df = process.dataset.get(name='train-raw').df
  dataset_train = IndexedDataset(train_df, TestOrValid=False, ReVealY=True, revealIdx=labeled_idx)

  train_acc, train_loss, valid_loss, num_data_trained = use_labeled_to_train(model, device, dataset_train, valid_loader, teacher_model=teacher_model, labeled_idx=labeled_idx, true_labels_by_idx=true_labels_by_idx, batch_size=batch_size, kd=True) #kd=true 給teacher


  # Test the model on test set, save the model for this iteration
  test_df = process.dataset.get(name='test-raw').df
  dataset_test = IndexedDataset(test_df, TestOrValid=True)
  test_loader = DataLoader(dataset_test, batch_size=batch_size,shuffle=False, drop_last=True)
  test_acc = test(model, device, test_loader)

  print(f"Iteration: {iteration}, test acc: {test_acc}\n\n")

  # save model to a folder
  model_folder_path = f'./trainingModels'
  if not os.path.isdir(model_folder_path):
    print("\n === No folder for training models, make one now === \n")
    os.mkdir(model_folder_path)

  model_path = f'{model_folder_path}/model_{iteration}.pt'
  torch.save(model.state_dict(), model_path)  
  
  # store the results
  al.nthIter.append(iteration)
  al.cumulatedNumData.append(
    al.cumulatedNumData[-1] + process.querySize
  )
  al.trainAcc.append(train_acc)
  al.testAcc.append(test_acc)

  print(f"\n\nAL {iteration} result\n")
  print(f"train acc: {train_acc}")
  print(f"test acc: {test_acc}")

  al.save()

  data = {
    'msg': f'Finish training model No.{iteration}!', 
    'status': 'successful',
    'iteration':iteration, 
    'cumuNumData': al.cumulatedNumData[-1],
    'trainAcc': round(train_acc, 4),
    'testAcc': round(test_acc, 4),
  }
  return Response(data)


@api_view(['POST'])
def saveModel(request):
  
  data = json.loads(request.body)

  return Response(data)


@api_view(['POST'])
def trainFinalTeacher(request):
  # print(f"\n\n&&&&&&&&&&&&&&& {datasetConfig['large_model_path'] == './trainingModels/LargeModel.ckpt'} &&&&&&&&&&&&&&&\n\n") 
  process = FullProcess.objects.all().order_by("-id")[0] 
  num_epoch = process.numEpochs
  batch_size = process.batchSize

  device = connectDevice()

  # get labeled training data indices
  ds_train_db = Dataset.objects.get(name='train-raw')
  labeled_idx = ds_train_db.labelOrNot

  labeled_idx = np.array([i for i, x in enumerate(labeled_idx) if x == 1])
  print(labeled_idx)

  train_df = ds_train_db.df
  dataset_train = IndexedDataset(train_df, TestOrValid=False, ReVealY=True, revealIdx=labeled_idx)
  labeled_train_loader = DataLoader(dataset_train, batch_size=batch_size, num_workers=0, sampler=SubsetRandomSampler(labeled_idx))

  # a new valid dataset and loader
  df_valid = process.dataset.get(name='valid-raw').df
  dataset_valid = IndexedDataset(df_valid, TestOrValid=True, Valid=True)
  valid_loader = DataLoader(dataset_valid, batch_size=batch_size, shuffle=True, drop_last=True)

  teacher_model = ComplexModel().to(device)
  large_model_path = './trainingModels/LargeModel.ckpt'
  trained_teacher_model = final_train_teacher(labeled_train_loader, valid_loader, teacher_model, "Teacher", epochs_num = num_epoch, save_model_path=large_model_path)

  # Test teacher 測試集Acc
  test_df = process.dataset.get(name='test-raw').df
  dataset_test = IndexedDataset(test_df, TestOrValid=True)
  test_loader = DataLoader(dataset_test, batch_size=batch_size,shuffle=False, drop_last=True)

  test_acc = 0
  teacher_model = ComplexModel().to(device)
  teacher_model.load_state_dict(torch.load(large_model_path))
  teacher_model.eval()

  with torch.no_grad():
    print("\nnow we can test the accuracy in the test set: ")
    for datas, labels, _ in test_loader:
      datas, labels = datas.to(device), labels.to(device)
      outputs = teacher_model(datas)
      _, test_pred = torch.max(outputs, 1)
      test_acc += (test_pred.cpu() == labels.cpu()).sum().item() # get the index of the class with the highest probability
    test_acc = test_acc/(len(dataset_test))
    print(f"test acc: {test_acc}")

  process.finalTeacherAcc = test_acc
  process.save()

  data = {
    'msg':"Finish training the final model!",
    'testAcc': test_acc,
  }
  return Response(data)


@api_view(['POST'])
def doKD(request): # actually train final student
  process = FullProcess.objects.all().order_by("-id")[0] 
  num_epoch = process.numEpochs
  batch_size = process.batchSize

  device = connectDevice()

  # get labeled training data indices
  ds_train_db = Dataset.objects.get(name='train-raw')
  labeled_idx = ds_train_db.labelOrNot

  labeled_idx = np.array([i for i, x in enumerate(labeled_idx) if x == 1])
  print(labeled_idx)

  train_df = ds_train_db.df
  dataset_train = IndexedDataset(train_df, TestOrValid=False, ReVealY=True, revealIdx=labeled_idx)
  labeled_train_loader = DataLoader(dataset_train, batch_size=batch_size, num_workers=0, sampler=SubsetRandomSampler(labeled_idx))

  # a new valid dataset and loader
  df_valid = process.dataset.get(name='valid-raw').df
  dataset_valid = IndexedDataset(df_valid, TestOrValid=True, Valid=True)
  valid_loader = DataLoader(dataset_valid, batch_size=batch_size, shuffle=True, drop_last=True)

  student_model = SimpleModel().to(device)
  small_model_path = './trainingModels/SmallModel.ckpt'
  teacher_model = ComplexModel().to(device)
  large_model_path = './trainingModels/LargeModel.ckpt'
  teacher_model.load_state_dict(torch.load(large_model_path))
  final_train_student(labeled_train_loader, valid_loader, student_model, teacher_model, "Student", epochs_num = num_epoch, save_model_path=small_model_path)

  # Test student 測試集Acc
  test_df = process.dataset.get(name='test-raw').df
  dataset_test = IndexedDataset(test_df, TestOrValid=True)
  test_loader = DataLoader(dataset_test, batch_size=batch_size,shuffle=False, drop_last=True)

  test_acc = 0
  student_model = SimpleModel().to(device)
  student_model.load_state_dict(torch.load(small_model_path))
  student_model.eval()
  with torch.no_grad():
    print("\nnow we can test the accuracy in the test set: ")
    for datas, labels, _ in test_loader:
      datas, labels = datas.to(device), labels.to(device)
      outputs = student_model(datas)
      _, test_pred = torch.max(outputs, 1)
      test_acc += (test_pred.cpu() == labels.cpu()).sum().item() # get the index of the class with the highest probability
    test_acc = test_acc/(len(dataset_test))
    print(f"test acc: {test_acc}")
  
  process.finalStudentAcc = test_acc
  process.save()

  # get comparison(with teacher) results
  df_data_info_r=pd.read_csv(f"{datasetConfig['data_info_path']}")
  num_feature = df_data_info_r.loc[0, 'num_feature']

  summary_teacher = summary(teacher_model, input_size=(batch_size, num_feature))
  summary_student = summary(student_model, input_size=(batch_size, num_feature))
  
  data = {
    'msg': 'Finish compressing the model with KD!',
    'testAcc': test_acc,
    'comparison': {
      'teacher':{
        'acc': process.finalTeacherAcc,
        'totalParams':summary_teacher.total_params,
        'paramsSize':summary_teacher.total_param_bytes,
        'outputSize':summary_teacher.total_output_bytes,
      },
      'student':{
        'acc': test_acc,
        'totalParams':summary_student.total_params,
        'paramsSize':summary_student.total_param_bytes,
        'outputSize':summary_student.total_output_bytes,
      },
    },
  }
  return Response(data)


@api_view(['GET'])
def getPlotImages(request, folder, img):
  print("\n ================= getPlotImages ================= \n")
  image_path = f"./{folder}/{img}"

  with open(image_path, 'rb') as img:
    response = HttpResponse(img.read(), content_type='image/png')
  return response


@api_view(['GET'])
def processShapAllClassPlot(request):
  print("\n ================= processShapAllClassPlot ================= \n")
  process = FullProcess.objects.all().order_by("-id")[0] 
  valid_df = process.dataset.get(name='valid-raw').df
  test_df = process.dataset.get(name='test-raw').df
  dataset_test = IndexedDataset(test_df, TestOrValid=True)
  batch_size = process.batchSize
  test_loader = DataLoader(dataset_test, batch_size=20,shuffle=False, drop_last=True)
  print("\n ================= running SHAP ================= \n")
  #SHAP
  device = connectDevice()
  teacher_model = ComplexModel().to(device)
  teacher_model.load_state_dict(torch.load('./trainingModels/LargeModel.ckpt', map_location=torch.device('cpu')))
  for batch in test_loader:
    datas, labels, _ = batch
    datas, labels = datas.to(device), labels.to(device)
    explainer = shap.DeepExplainer(teacher_model, datas)
    break
  #savefig
  
  shap_img_path = './shap-images'
  if not os.path.isdir(shap_img_path):
    print("\n === No folder for shap img, make one now === \n")
    os.mkdir(shap_img_path)
  print("\n ================= calculating SHAP ================= \n")
  shap_values_teacher = explainer.shap_values(datas)
  shap.summary_plot(shap_values_teacher, datas, valid_df.columns[:-1], show=False,  max_display=16)
  plt.savefig(f'{shap_img_path}/all_class.png')
  plt.close()
  return HttpResponse("Data processed successfully")
@api_view(['POST'])
def processShapClassPlot(request):

  print("\n ================= processShapClassPlot ================= \n")
  shapClass = json.loads(request.body)
  print(shapClass)
  
  process = FullProcess.objects.all().order_by("-id")[0] 
  valid_df = process.dataset.get(name='valid-raw').df
  test_df = process.dataset.get(name='test-raw').df
  dataset_test = IndexedDataset(test_df, TestOrValid=True)
  batch_size = process.batchSize
  test_loader = DataLoader(dataset_test, batch_size=20,shuffle=False, drop_last=True) #to be changed to 200 or 150
  
  
  
  #SHAP
  device = connectDevice()
  teacher_model = ComplexModel().to(device)
  teacher_model.load_state_dict(torch.load('./trainingModels/LargeModel.ckpt', map_location=torch.device('cpu')))
  for batch in test_loader:
    datas, labels, _ = batch
    datas, labels = datas.to(device), labels.to(device)
    explainer = shap.DeepExplainer(teacher_model, datas)
    break

  #savefig
  shap_img_path = './shap-images'
  if not os.path.isdir(shap_img_path):
    print("\n === No folder for shap img, make one now === \n")
    os.mkdir(shap_img_path)
  
  shap_values_teacher = explainer.shap_values(datas)
  # shap.summary_plot(shap_values_teacher, datas, valid_df.columns[:-1], show=False)
  # plt.savefig(f'{shap_img_path}/all_class.png')
  # plt.close()
  
  shap.summary_plot(shap_values_teacher[int(shapClass)], datas, valid_df.columns[:-1],  max_display=16)
  summaryimage_filename = 'class_summary.png'
  plt.savefig(f'{shap_img_path}/{summaryimage_filename}')
  plt.close()

  shap.summary_plot(shap_values_teacher[int(shapClass)], datas, valid_df.columns[:-1], plot_type='bar', max_display=16)
  gbarimage_filename = 'class_gbar.png'
  plt.savefig(f'{shap_img_path}/{gbarimage_filename}')
  plt.close()

  #correlation
  posX=[]
  negX=[]
  Xcol = valid_df.columns[:-1].tolist()
  for i in range(len(Xcol)):
    cor=np.corrcoef(datas[:,i:i+1].numpy().T, shap_values_teacher[int(shapClass)][:,i:i+1].T)[0,1]
    if cor>0: 
      posX.append(Xcol[i])
    elif cor<0:
      negX.append(Xcol[i])
  
  fig, ax = plt.subplots(figsize=(4, 5))
  #pie chart
  abs_mean=np.abs(shap_values_teacher[1]).mean(0).tolist()  
  df = pd.DataFrame([abs_mean], columns =valid_df.columns[:-1])
  # display the top 16 features
  k=16
  id=df.loc[0].sort_values(ascending=False).index[:k]
  val=df.loc[0].sort_values(ascending=False).values[:k]
  total=sum(val)
  labels = [f'{l}, {(s/total*100):0.1f}%' for l, s in zip(id, val)]
  pie = plt.pie(val,autopct='%1.1f%%', startangle=90)
  ax.axis('equal')
  ax.legend(bbox_to_anchor=(1, 1), loc='upper left', labels=labels)
  gPieImage_filename="gPie.png"
  plt.savefig(f'{shap_img_path}/{gPieImage_filename}', bbox_inches='tight')
  plt.close()
    
  return Response({'image_path': summaryimage_filename,
           'gBarImagePath': gbarimage_filename,
           'posX':posX,
           'negX':negX,
           'gPieImagePath': gPieImage_filename})


@api_view(['POST'])
def processDepClassPlot(request):
  print("\n ================= processDepClassPlot ================= \n")

  data = json.loads(request.body)

  class1 = data['depClass1']
  class2 = data['depClass2']
  depY = data['depY']
  print(class1)
  print(class2)
  print(depY)

  process = FullProcess.objects.all().order_by("-id")[0] 
  valid_df = process.dataset.get(name='valid-raw').df
  test_df = process.dataset.get(name='test-raw').df
  dataset_test = IndexedDataset(test_df, TestOrValid=True)
  batch_size = process.batchSize
  test_loader = DataLoader(dataset_test, batch_size=20,shuffle=False, drop_last=True)
  

  #SHAP
  device = connectDevice()
  teacher_model = ComplexModel().to(device)
  teacher_model.load_state_dict(torch.load('./trainingModels/LargeModel.ckpt', map_location=torch.device('cpu')))
  for batch in test_loader:
    datas, labels, _ = batch
    datas, labels = datas.to(device), labels.to(device)
    explainer = shap.DeepExplainer(teacher_model, datas)
    break

  #savefig
  shap_img_path = './shap-images'
  if not os.path.isdir(shap_img_path):
    print("\n === No folder for shap img, make one now === \n")
    os.mkdir(shap_img_path)

  shap_values_teacher = explainer.shap_values(datas)
  shap.dependence_plot(class1, shap_values_teacher[int(depY)], datas.numpy(), valid_df.columns[:-1], interaction_index=class2)
  image_filename_d1 = 'dep1.png'
  plt.savefig(f'{shap_img_path}/{image_filename_d1}')
  plt.close()

  shap.dependence_plot(class2, shap_values_teacher[int(depY)], datas.numpy(), valid_df.columns[:-1], interaction_index=class1)
  image_filename_d2 = 'dep2.png'
  plt.savefig(f'{shap_img_path}/{image_filename_d2}')
  plt.close()

  return Response({'image_pathD1': image_filename_d1, 'image_pathD2': image_filename_d2})
  

@api_view(['POST'])
def processCF(request):
  print("\n ================= processCF ================= \n")
  print("new")
  df_data_info_r=pd.read_csv(f"{datasetConfig['data_info_path']}")
  label_name = df_data_info_r.loc[0, 'label_name']
  process = FullProcess.objects.all().order_by("-id")[0] 
  test_df = process.dataset.get(name='test-raw').df
  
  Xcol=test_df.columns[:-1].tolist()
  test_df_4 = test_df.round(3)
  print(test_df_4.head())
  d = dice_ml.Data(dataframe=test_df_4, continuous_features=Xcol, outcome_name=label_name)
  backend ='PYT' 
  device = connectDevice()
  teacher_model = ComplexModel().to(device)
  teacher_model.load_state_dict(torch.load('./trainingModels/LargeModel.ckpt', map_location=torch.device('cpu')))
  teacher_model.eval()
  m = dice_ml.Model(model=teacher_model, backend=backend)
  
  exp_random = dice_ml.Dice(d, m) # initiate DiCE

  # Get parameters from the JSON request data
  data = json.loads(request.body)

  desired_y = int(data['desired_y'])
  inputX = data['inputX']

  floatX = [[float(i) for i in inputX]]
  query_instances = pd.DataFrame(floatX, columns =Xcol)
  # query_instances = test_df.iloc[4:5, :-1]  #######
  # query_instances = query_instances.round(3)
  print(query_instances)
  print("==============ready to generate counterfactuals==============")
  dice_exp = exp_random.generate_counterfactuals(query_instances, total_CFs=2, desired_class=desired_y, verbose=False)   
  df_qi=dice_exp.cf_examples_list[0].test_instance_df
  df_cf=dice_exp.cf_examples_list[0].final_cfs_df
  df = df_qi.append(df_cf)
  print(df)
  df_json = df.to_json(orient='records')

  return Response({'data': df_json})
  