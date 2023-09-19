import pandas as pd
from torch.utils.data import DataLoader
from sklearn.model_selection import train_test_split
from utils.utils import *
from utils.modelStructures import *
from utils.dataset import *
from utils.query import *
from config import config



############### main ###############

# device = connectDevice()

df = pd.read_csv('./data/preprocessed_beans_train.csv')
valid_ratio = config['valid_ratio']
train_df, valid_df = train_test_split(df, test_size=valid_ratio, random_state=42) # valid_ratio = 0.2
train_df = train_df.reset_index(drop=True)
valid_df = valid_df.reset_index(drop=True)

test_df = pd.read_csv('./data/preprocessed_beans_test.csv')
print("Training set shape:", train_df.shape)
print("Validation set shape:", valid_df.shape)
print("Test set shape:", test_df.shape)

#dataset_train = IndexedDataset(train_df)
dataset_valid = IndexedDataset(valid_df, TestOrValid=True, Valid=True)
dataset_test = IndexedDataset(test_df, TestOrValid=True)

batch_size = config['batch_size']
#train_loader = DataLoader(dataset_train ,batch_size=batch_size, shuffle=True, drop_last=True)
valid_loader = DataLoader(dataset_valid, batch_size=batch_size, shuffle=True, drop_last=True)
test_loader = DataLoader(dataset_test, batch_size=batch_size,shuffle=False, drop_last=True)


print(len(test_loader))
for data, labels, idx in valid_loader:
    print(data.shape)
    print(labels.shape)
    print(idx)
    break


