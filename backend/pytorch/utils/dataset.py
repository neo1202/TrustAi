import numpy as np
import torch
from torch.utils.data import Dataset


class IndexedDataset(Dataset):
    # data loading
    def __init__(self, df, TestOrValid=False, Valid=False, ReVealY=False, revealIdx=None): # if ReVealY=False, revealIdx must be none. They are passed together
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

        if ReVealY:
            self.labels[revealIdx] = self.hidden_y[revealIdx]

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