import torch
import torch.nn as nn
from ..config import datasetConfig
import pandas as pd

# 不論是 complex(teacher) 還是 simple(student)，第一層的第一個數字都要跟資料集的特徵數一樣，不然矩陣無法相乘
# class ComplexModel(nn.Module):
#     def __init__(self):
#         super(ComplexModel, self).__init__()

#         self.linear1 = nn.Linear(datasetConfig['num_feature'], 216)
#         self.act1 = nn.LeakyReLU()
#         self.linear2 = nn.Linear(216, 128)
#         self.act2 = nn.ReLU()
#         self.linear3 = nn.Linear(128, 42)
#         self.act3 = nn.ReLU()
#         self.linear4 = nn.Linear(42, 7)

#         self.dropout = nn.Dropout(0.1)
#         self.bn1 = nn.BatchNorm1d(216)
#         self.bn2 = nn.BatchNorm1d(84)

#     def forward(self, x):
#         x = self.act1(self.linear1(x))
#         #x = self.bn1(x)
#         x = self.dropout(x)
#         x = self.act2(self.linear2(x))
#         #x = self.bn2(x)
#         x = self.dropout(x)
#         x = self.act3(self.linear3(x))
#         x = self.linear4(x)
#         return x


class ComplexModel(nn.Module):
            def __init__(self):
                df_data_info_r=pd.read_csv(f"{datasetConfig['data_info_path']}")
                num_feature = df_data_info_r.loc[0, 'num_feature']    
                class_amount = df_data_info_r.loc[0, 'class_amount']  

                super(ComplexModel, self).__init__()
                self.linear1 = nn.Linear(num_feature, 216)
                self.act1 = nn.LeakyReLU()
                self.linear2 = nn.Linear(216, 732)
                self.act2 = nn.ReLU()
                self.linear3 = nn.Linear(732, 256)
                self.act3 = nn.ReLU()
                self.linear4 = nn.Linear(256, 72)
                self.act4 = nn.LeakyReLU()
                self.linear5 = nn.Linear(72, class_amount) # original was 6
                self.dropout = nn.Dropout(0.2)
                self.bn1 = nn.BatchNorm1d(216)
                self.bn2 = nn.BatchNorm1d(732)
                self.bn3 = nn.BatchNorm1d(256)
        
            def forward(self, x):
                x = self.act1(self.linear1(x))
                x = self.bn1(x)
                x = self.dropout(x)
                x = self.act2(self.linear2(x))
                x = self.bn2(x)
                x = self.dropout(x)
                x = self.act3(self.linear3(x))
                x = self.bn3(x)
                x = self.dropout(x)
                x = self.act4(self.linear4(x))
                x = self.linear5(x)
                return x

# class SimpleModel(nn.Module):
#     def __init__(self):
#         super(SimpleModel, self).__init__()
#         self.linear1 = torch.nn.Linear(datasetConfig['num_feature'], 42)
#         self.linear2 = torch.nn.Linear(42, 7)
#         self.relu = nn.ReLU()

#     def forward(self, x):
#         x = self.linear1(x)
#         x = self.relu(x)
#         x = self.linear2(x)
#         return x
    
class SimpleModel(nn.Module):
            def __init__(self):
                df_data_info_r=pd.read_csv(f"{datasetConfig['data_info_path']}")
                num_feature = df_data_info_r.loc[0, 'num_feature']    
                class_amount = df_data_info_r.loc[0, 'class_amount']  

                super(SimpleModel, self).__init__()
                self.linear1 = torch.nn.Linear(num_feature, 256)
                self.linear2 = torch.nn.Linear(256, 112)
                self.linear3 = torch.nn.Linear(112, class_amount) # original was 6
                self.relu = nn.ReLU()
                self.dropout = nn.Dropout(0.2)
                self.bn = nn.BatchNorm1d(256)

            def forward(self, x):
                x = self.linear1(x)
                x = self.relu(x)
                x = self.bn(x)
                self.dropout = nn.Dropout(0.2)
                x = self.linear2(x)
                x = self.relu(x)
                self.dropout = nn.Dropout(0.2)
                x = self.linear3(x)
                return x