import random
import math
import numpy as np
import pandas as pd
from tqdm.auto import tqdm
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torch.utils.data.sampler import SubsetRandomSampler

# import sys
# sys.path.append('../utils')
from .utils import connectDevice, show_loss
from .dataset import IndexedDataset
from .modelStructures import ComplexModel
from .query import query_the_oracle
from .plotting import plot_pred_record
from .functions import modify_valid_record, choose_teacher, loss_kd

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


def final_train_teacher(train_loader, valid_loader, model, model_name, epochs_num, save_model_path):

    criterion = nn.CrossEntropyLoss(label_smoothing = 0.1)
    optimizer = optim.AdamW(model.parameters(),lr=1e-3,weight_decay=1e-4)
    loss_train = []
    loss_valid = []
    best_loss, early_stop_count = math.inf, 0

    for epoch in range(epochs_num):
        #print(f'loss_train:{loss_train}')
        model.train() # Set model to train mode
        cur_train_loss = []
        cur_valid_loss = []
        train_pbar = tqdm(train_loader, position=0, leave=True)
        for datas, labels, _ in train_pbar: #each batch
            datas, labels = datas.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(datas)
            loss = criterion(outputs, labels)
            loss.backward() #反向傳播
            optimizer.step()
            cur_train_loss.append(loss.detach().cpu().numpy())
        #print(cur_train_loss)
        mean_loss_train = sum(cur_train_loss)/len(cur_train_loss)
        #-----------------------validation----------------------#
        model.eval()
        with torch.no_grad(): #代表這裡面不會有backpropagation梯度，不會有調整優化
            for datas, labels, _ in valid_loader:
                datas, labels = datas.to(device), labels.to(device)
                outputs = model(datas)
                loss = criterion(outputs, labels)
                cur_valid_loss.append(loss.detach().cpu().numpy())

            mean_loss_valid = sum(cur_valid_loss)/len(cur_valid_loss)
            print(f"Epoch [{epoch+1}/{epochs_num}]: Train loss: {mean_loss_train:.4f}, Valid loss: {mean_loss_valid:.4f}")
            loss_train.append(mean_loss_train)
            loss_valid.append(mean_loss_valid)
            if mean_loss_valid < best_loss:
                best_loss = mean_loss_valid
                torch.save(model.state_dict(), save_model_path)
                print(f'Saving model with loss {best_loss:.4f}')
                early_stop_count = 0
            else:
                early_stop_count += 1
            
            early_stop = 10 # not yet in django model
            if early_stop_count >= early_stop:
                print('\n Model is not improving, Stop training session.')
                return

    # show_loss(loss_train, loss_valid)
    print(loss_train)
    print(loss_valid)

    return model


def final_train_student(train_loader, valid_loader, student_model, teacher_model, model_name, epochs_num, save_model_path):

    teacher_model.eval()
    criterion = nn.CrossEntropyLoss(label_smoothing = 0.1)
    optimizer = optim.AdamW(student_model.parameters(),lr=1e-3,weight_decay=1e-4)
    loss_train = []
    loss_valid = []
    best_loss, early_stop_count = math.inf, 0

    for epoch in range(epochs_num):
        student_model.train() # Set model to train mode
        cur_train_loss = []
        cur_valid_loss = []
        train_pbar = tqdm(train_loader, position=0, leave=True)
        for datas, labels, _ in train_pbar: #each batch
            datas, labels = datas.to(device), labels.to(device)
            optimizer.zero_grad()
            student_outputs = student_model(datas)
            teacher_outputs = teacher_model(datas) # 教師output
            teacher_outputs = teacher_outputs.detach()  # 切斷教師反向傳播

            loss = loss_kd(student_outputs, labels, teacher_outputs, temparature=3, alpha=0.95)
            loss.backward() #反向傳播
            optimizer.step()
            cur_train_loss.append(loss.detach().cpu().numpy())

        mean_loss_train = sum(cur_train_loss)/len(cur_train_loss)
        #-----------------------validation----------------------#
        student_model.eval()
        with torch.no_grad(): #代表這裡面不會有backpropagation梯度，不會有調整優化
            for datas, labels, _ in valid_loader:
                datas, labels = datas.to(device), labels.to(device)
                student_outputs = student_model(datas)
                teacher_outputs = teacher_model(datas) # 教師output
                teacher_outputs = teacher_outputs.detach()  # 切斷教師反向傳播
                loss = loss_kd(student_outputs, labels, teacher_outputs, temparature=3, alpha=0.95)
                cur_valid_loss.append(loss.detach().cpu().numpy())

            mean_loss_valid = sum(cur_valid_loss)/len(cur_valid_loss)
            print(f"Epoch [{epoch+1}/{epochs_num}]: Train loss: {mean_loss_train:.4f}, Valid loss: {mean_loss_valid:.4f}")
            loss_train.append(mean_loss_train)
            loss_valid.append(mean_loss_valid)
            if mean_loss_valid < best_loss:
                best_loss = mean_loss_valid
                torch.save(student_model.state_dict(), save_model_path)
                print(f'Saving model with loss {best_loss:.4f}')
                early_stop_count = 0
            else:
                early_stop_count += 1
            
            early_stop = 10
            if early_stop_count >= early_stop:
                print('\n Model is not improving, Stop training session.')
                return

    # show_loss(loss_train, loss_valid)
