import random
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torch.utils.data.sampler import SubsetRandomSampler
from .functions import loss_kd

# import sys
# sys.path.append('../utils')
from .utils import connectDevice
from .dataset import IndexedDataset
from .modelStructures import ComplexModel
from .query import query_the_oracle
from .plotting import plot_pred_record
from .functions import modify_valid_record, choose_teacher

device = connectDevice()


def test(model, device, data_loader): #可能是test也可能是valid，只看準確度
    test_df = pd.read_csv('./pytorch/data/preprocessed_beans_test.csv')
    dataset_test = IndexedDataset(test_df, TestOrValid=True)

    test_correct = 0
    model.eval()
    with torch.no_grad():
        for batch in data_loader:
            datas, labels, _ = batch
            datas, labels = datas.to(device), labels.to(device)
            outputs = model(datas)
            _, test_pred = torch.max(outputs, 1) # get the index of the class with the highest probability
            test_correct += (test_pred.cpu() == labels.cpu()).sum().item()
    return test_correct/(len(dataset_test))


def train(model, device, train_loader, teacher_model, kd=False):  #直接對傳入的model訓練
    model.train()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(),lr=3e-3,weight_decay=1e-4)
    #optimizer = optim.SGD(model.parameters(), lr=0.01, momentum=0.9, dampening=0, weight_decay=0.0001)
    epoch_loss = 0
    train_correct = 0
    m_train = 0 #這次有幾筆labeled資料用來訓練
    for batch in train_loader:
        datas, labels, _ = batch # _ is idx
        m_train += datas.size(0)
        datas, labels = datas.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(datas)
        _, train_pred = torch.max(outputs, 1) #不關心最大的數值，只要index
        train_correct += (train_pred.detach() == labels.detach()).sum().item()
        if kd:
            teacher_outputs = teacher_model(datas) # 教師output
            teacher_outputs = teacher_outputs.detach()  # 切斷教師反向傳播
            loss = loss_kd(outputs, labels, teacher_outputs)
        else:
            loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        epoch_loss += loss.item()
    return epoch_loss / m_train, m_train, train_correct / m_train 


def use_labeled_to_train(model, device, dataset_train, valid_loader, teacher_model, labeled_idx, true_labels_by_idx, batch_size, kd=False):
    # # Train the model on the data that has been labeled so far:
    # labeled_idx = np.where(dataset_train.unlabeled_mask == 0)[0]
    labeled_idx = np.array(labeled_idx)

    # 只包含有標記過training data 的dataloader
    labeled_train_loader = DataLoader(dataset_train, batch_size=batch_size, num_workers=0, sampler=SubsetRandomSampler(labeled_idx))

    previous_best_acc = 0
    fail_cnt = 0
    while fail_cnt < 2 : #反覆對這些資料訓練直到valid準確率不再上升n輪
        train_loss, train_data_num, train_acc = train(model, device, labeled_train_loader, teacher_model=teacher_model, kd=kd) #固定都會傳teacher,但kd=True才會用到
        current_valid_acc = test(model, device, valid_loader)
        if current_valid_acc > previous_best_acc:
            fail_cnt = 0 #重新計算，因為成功找到更好的model
            previous_best_acc = current_valid_acc
        else:
            fail_cnt += 1
        #print(f'train_acc: {train_acc}')
    print(f"train acc: {train_acc}, train loss:{train_loss}, valid loss:{previous_best_acc}, how many train data:{train_data_num}")

    return train_acc, train_loss, previous_best_acc, train_data_num


# def compare_strategy_get_acc(strategy='random'):
#     # 初始化一開始的訓練集,測試集，隨機放一些資料進去，random時query_the_oracle的model放誰不重要
#     test_acc_list = []
#     teacher_list = [0]
#     dataset_train = IndexedDataset(train_df)
#     dataset_valid = IndexedDataset(valid_df, TestOrValid=True, Valid=True)
#     valid_loader = DataLoader(dataset_valid, batch_size=batch_size, shuffle=True, drop_last=True)


#     # 第0個model, 初始的model用20個統一初始資料來訓練，理論上三種取樣方式的起始test_acc會差不多
#     model = ComplexModel().to(device) #先訓練一個seed model 用初始隨機資料
#     query_the_oracle(model, device, dataset_train, query_size=query_size_define, query_strategy='init', pool_size=pool_size_define) #取得的參數統一為init
#     use_labeled_to_train(model, device, dataset_train, valid_loader, teacher_model=model, kd=False) #訓練, teacher隨便放

#     # Test the model on test set
#     test_acc = test(model, device, test_loader)
#     print(f"Iteration: 0, test acc: {test_acc}\n")
#     test_acc_list.append(test_acc)
#     PATH = f'./models/model_0.pt'
#     torch.save(model.state_dict(), PATH) #儲存model

#     """這邊改iteration數"""
#     num_iteration = config['query_iteration'] #50
#     for iteration in range(1, num_iteration):
#         # 每個iteration的開始加入一些labeled data 到training，用上個迴圈還沒被重置的model
#         query_the_oracle(model, device, dataset_train, query_size=query_size_define, query_strategy=strategy, pool_size=pool_size_define) #用上一輪的model去拿到新的資料
#         modify_valid_record(model, device, valid_loader, dataset_valid) #用上一輪的model去更新valid上的預測至目前

#         '''看看當今model會錯在哪裡用來更新C(correct consistency),也代表著這個被傳入的model不會是teacher(除了前面兩輪)
#             同時找到過往的teacher -> '''
#         number_teacher = choose_teacher(model, dataset_valid, valid_loader, previous_model_num = iteration) #iteration從1~50 拿到teacher是哪個過往model
#         teacher_list.append(number_teacher)
#         model = ComplexModel().to(device) #重新訓練一個model在每個iteration, 跟一個代表過往模型的teacher_model
#         print(f'This iteration {iteration}, the teacher is {number_teacher}')
#         teacher_model = ComplexModel().to(device)
#         teacher_model.load_state_dict(torch.load(f'./models/model_{number_teacher}.pt'))
#         teacher_model.eval()
#         '''此處採用Knowledge Distillation來訓練'''
#         use_labeled_to_train(model, device, dataset_train, valid_loader, teacher_model=teacher_model, kd=True) #kd=true 給teacher


#         # Test the model on test set, save the model for this iteration
#         test_acc = test(model, device, test_loader)
#         print(f"Iteration: {iteration}, test acc: {test_acc}\n\n")
#         test_acc_list.append(test_acc)
#         PATH = f'./models/model_{iteration}.pt'
#         torch.save(model.state_dict(), PATH) #儲存model

#     pred_record = dataset_valid.prediction_record
#     selected_lists = random.sample(pred_record, 50) #隨機選50個出來show
#     plot_pred_record(selected_lists) #畫出預測紀錄
#     return test_acc_list, teacher_list, dataset_train #回傳每個iteration在此策略上的測試準確度, 各個iteration的教師, 最後使用了哪些train_Data

