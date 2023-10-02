import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F

# import sys
# sys.path.append('../utils')
from .modelStructures import ComplexModel
from .utils import connectDevice


device = connectDevice()


# 自定義T, alpha KD_loss_function
def loss_kd(student_logits, labels, teacher_logits, temparature=5, alpha=0.7):
    soft_loss = nn.KLDivLoss(reduction="batchmean") #KLdistance算student軟標籤和teacher軟標籤
    distillation_loss = soft_loss(
                  F.log_softmax(student_logits/temparature, dim=1),
                  F.softmax(teacher_logits/temparature,dim=1)
                  )* (temparature * temparature)
    student_loss = F.cross_entropy(student_logits, labels)
    #print(f'student_loss: {student_loss}, distill_loss: {distillation_loss}')
    total_loss = (1-alpha)*student_loss + alpha*distillation_loss
    return total_loss


def modify_valid_record(model, device, data_loader, dataset_valid, uncertain_idx):
    model.eval()
    #print('prediction_record: ',dataset_valid.prediction_record)
    with torch.no_grad():
        for batch in data_loader:
            datas, labels, idx = batch
            datas, labels = datas.to(device), labels.to(device)
            outputs = model(datas)
            _, test_pred = torch.max(outputs, 1) # test_pred就是類別預測值

            # idx = uncertain_idx
            # idx = torch.tensor(uncertain_idx) # 這行解開註解會出問題
            # print("\n\n\n\n ======== idx ========\n\n\n\n")
            # print(idx)
            update_idx = idx
            update_records = []

            # print(len(test_pred))
            # print(test_pred)
            # print(len(labels))
            # print(labels)
            # print(idx)

            # labels[i] 是資料集本身的答案，但在 AL 中應該要是使用者的答案
            for i in range(len(idx)):
                if test_pred[i] == labels[i]:
                  #print(f"Sample {idx[i]} prediction is correct")
                #   dataset_valid.update_prediction_record(idx[i], 1) #idx, prediction
                  update_records.append(1)
                else:
                  #print(f"Sample {idx[i]} prediction is incorrect")
                #   dataset_valid.update_prediction_record(idx[i], 0) #idx, prediction
                  update_records.append(0)

        return update_idx, update_records


def choose_teacher(current_model, dataset_valid, valid_loader, previous_model_num): #previous_model_num=2代表有model_0, model_1 可供選擇

    if previous_model_num == 1 or previous_model_num == 2: return 0 #前面兩輪的選擇必定直接為第0個model

    '''
    如果當前iteration傳入的model(current_model)預測這筆資料正確label的softmax, 低於
    過往model的softmax probability -> 採用這筆C
    原始論文說要過softmax,但會使得概率差距過大,所以我直接用歸一化
    current_model為上一輪訓練出的model, 我們要知道他預測錯哪些data
    '''
    #用當前current_model 算出每個data的C
    sum_list = [sum(sub_list) for sub_list in dataset_valid.prediction_record] #每個data的原始C總和,之後只有這個model預測錯的會被留著
    predict_proba_list = np.zeros(dataset_valid.n_samples) #初始化一個list儲存current_model對每個data的softmax預測值
    current_model.eval()
    for batch in valid_loader:
        datas, labels, idx = batch
        datas, labels = datas.to(device), labels.to(device)
        outputs = current_model(datas)
        outputs = F.softmax(outputs, dim=1) #過softmax
        best_proba, test_pred = torch.max(outputs, 1) # best_proba為對該類別的預測機率，test_pred就是類別預測
        for i in range(len(idx)):
            predict_proba_list[idx[i]] = best_proba[i].detach().cpu().numpy() #probability加入list，方便之後比較
            if test_pred[i] == labels[i]: #這筆資料預測對了
                sum_list[idx[i]] = 0 #就不用考慮這筆的C

    # 平滑化操作，用上面得到需要採用的C's 並平滑化作為底下選擇的基準
    total_sum = sum(sum_list)
    consistency_list = [x / total_sum for x in sum_list] #用來選這次teacher的C list

    ''' consistency_list長的會像 [0.1, 0, 0, 0, 0.5, 0.05, 0, 0, 0.25, 0.1, 0] 理論上0會很多
        如果previous model預測在softmax後，在某一筆上面表現比current_model在那筆資料好，
        且該筆資料的consistency_list 不為0, 代表是好事，把它 (probability*C) 加進current score 裏'''
    best_model = 0
    best_score = 0
    for t in range(previous_model_num - 1): #跑過所有過往的model除了上一輪的
        current_score = 0
        PATH = f'./models/model_{t}.pt'
        previous_model = ComplexModel().to(device)
        previous_model.load_state_dict(torch.load(PATH))
        previous_model.eval()
        for batch in valid_loader: #valid set的資料用來選teacher
            datas, labels, idx = batch
            datas, labels = datas.to(device), labels.to(device)
            outputs = previous_model(datas)
            outputs = F.softmax(outputs, dim=1)
            best_proba, _ = torch.max(outputs, 1) # best_proba為對該類別的預測機率
            for i in range(len(idx)):
                if best_proba[i] > predict_proba_list[idx[i]]: #若是這個過往模型對於這筆資料的預測值大於current_model，score += 這個模型Output的機率＊這筆資料的Ｃ
                    current_score += best_proba[i].detach().cpu().numpy() * consistency_list[idx[i]] #這樣下來，若是預測C=0的就會變成+0 沒有用
        #在每一輪過往的model，看他的score有沒有比當前最好的更高，若是有，更新他為best_model, 更新best_score
        if current_score >= best_score:
            best_model = t
            best_score = current_score

        #print(f'current_score: {current_score}')
        #print(f'best_model: {best_model}')

    return best_model