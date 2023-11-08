# common packages
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('agg') 
import matplotlib.pyplot as plt
import json
import os
import sys
sys.path.append('../pytorch/utils')

# Django
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
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


@api_view(['POST'])
def uploadFile(request):
    # print("\nUploading file...\n")
    # print(request)
    data = json.loads(request.body)
    return Response(data)


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
    process = FullProcess.objects.create(
        processID = 1, # just use as a foreign key
        initTrainingDataNum = 0,
        initTrainingDataSelectMethod = 'Randomly Generate',
        trainingModel = '3 Layer Neural Network Model',
        uncertaintyQueryMethod = 'Margin',
        querySize = 20,
        poolingSize = 300,
        learningRate = 1e-3,
        numEpochs = 100,
        batchSize = 16,
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

    print("\n\n============== initProcess done ==============\n\n")

    return Response({'msg':"init process done"})


@api_view(['POST'])
def readData(request):
    df = pd.read_csv(r'./pytorch/data/preprocessed_beans_train.csv')
    df_train, df_valid = train_test_split(df, test_size=0.2, random_state=42) # valid_ratio = 0.2
    df_train = df_train.reset_index(drop=True)

    df_test = pd.read_csv(r'./pytorch/data/preprocessed_beans_test.csv')

    msg = ''
    if not Dataset.objects.filter(name = 'train-raw').exists():
        # at least one object satisfying query exists
        msg = 'dataset does not exist, now store one in'
        print(f"\n\n{msg}\n\n")

        process = FullProcess.objects.all().order_by("-id")[0] # the greatest id

        # store training dataset
        num_train = df_train.shape[0]
        process.dataset.create(
            name = 'train-raw', df = df_train,
            data = df_train.drop('Class', axis=1), labels = df_train['Class'],
            labelOrNot = [0 for _ in range(num_train)],
            predictionRecord = [[] for _ in range(num_train)],
        )
        process.save()

        # store validation dataset
        num_valid = df_valid.shape[0]
        process.dataset.create(
            name = 'valid-raw', df = df_valid,
            data = df_valid.drop('Class', axis=1), labels = df_valid['Class'],
            labelOrNot = [1 for _ in range(num_valid)],
            predictionRecord = [[] for _ in range(num_valid)],
        )
        process.save()

        # store testing dataset
        num_test = df_test.shape[0]
        process.dataset.create(
            name = 'test-raw', df = df_test,
            data = df_test.drop('Class', axis=1), labels = df_test['Class'],
            labelOrNot = [1 for _ in range(num_test)],
            predictionRecord = [[] for _ in range(num_test)],
        )
        process.save()
    else:
        # no object satisfying query exists
        msg = 'dataset already exists, no need to store again'
        print(f"\n\n{msg}\n\n")

    return Response({'msg':f'{msg}'})


@api_view(['GET'])
def getData(request, pk):
    # 實際上，應該是丟進一個資料集，回傳長度。可能是初始資料、某一次迭代的訓練集等
    dataset = Dataset.objects.get(name=pk)
    if not Dataset.objects.filter(name=pk).exists():
        print(f"dataset {pk} does not exist!")

    df = dataset.df
    rawData = df.to_dict(orient='records')
    numRows = df.shape[0]
    numCols = df.shape[1] - 1 # 前端叫的是訓練集，所以欄位數量要扣掉標籤欄

    data = {
        'rawData': rawData, 'keys': list(rawData[0].keys()),
        'numRows': numRows, 'numCols': numCols}
    return Response(data)

######################################################

@api_view(['DELETE'])
def deleteTest(request):
    print(f"\n\n======== DELETE ========\n\n")


    Dataset.objects.all().delete()
    FullProcess.objects.all().delete()
    return Response({'msg':"all dataset deleted"})

######################################################



@api_view(['POST']) # not yet in urls
def setDataset(request):
    # 實際上，應該是組合出一個資料集。包括初始資料集（隨機跟指定 index 的方法都要做出來）、某一次迭代的訓練集等
    # 初始資料集可以是 dataset0，往後 AL 就從 dataset1 開始

    return 


@api_view(['POST', 'PUT']) # 'DELETE'? 
def setMethodsAndConfigs(request):
    data = json.loads(request.body) 
    setting_type = data['type']
    setting_value = data['value']

    process = FullProcess.objects.all().order_by("-id")[0] 

    if setting_type == 'SetInitNumData':
        process.initTrainingDataNum = setting_value
    elif setting_type == 'SelectInitData':
        process.initTrainingDataSelectMethod = setting_value
    elif setting_type == 'SelectModel':
        process.trainingModel = setting_value
    elif setting_type == 'SetNumDataPerIter':
        process.querySize = setting_value
    elif setting_type == 'SelectUncertaintyMethod':
        process.uncertaintyQueryMethod = setting_value
    elif setting_type == 'SetLearningRate':
        process.learningRate = setting_value
    elif setting_type == 'SetPoolingSize':
        process.poolingSize = setting_value
    elif setting_type == 'SetNumEpoch':
        process.numEpochs = setting_value
    elif setting_type == 'SetBatchingSize':
        process.batchSize = setting_value
    
    process.save()

    print(f"\n\nsetting type = {data['type']}, value = {data['value']}\n\n")
    return Response(data)


@api_view(['GET'])
def getUncertaintyRank(request, iter):
    # 拿前一次模型去對 test data 預測（回去看一下 pytorch 那邊怎寫的）
    # 也要配合相對應的 uncertainty query method（conf, margin, ...）
    # 模型：理想中會存在 backend 的一個資料夾

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
        'msg': f"get uncertainty ranking iter {iteration}(an list or a bar chart figure)",
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

    num_data_plot_name = 'iter-numData.png'
    num_data_plot_path = f'{dashboard_plots_path}/{num_data_plot_name}'
    plt.plot(iters, num_datas)
    plt.xlabel('Iteration')
    plt.ylabel('Number of Training Data')
    plt.title('Cumulated Number of Training Data')
    plt.savefig(f'{num_data_plot_path}')
    plt.close()

    train_acc_plot_name = 'iter-trainAcc.png'
    train_acc_plot_path = f'{dashboard_plots_path}/{train_acc_plot_name}'
    plt.plot(iters, train_accs)
    plt.xlabel('Iteration')
    plt.ylabel('Accuracy')
    plt.title('Training Accuracy by Iteration')
    plt.savefig(f'{train_acc_plot_path}')
    plt.close()

    test_acc_plot_name = 'iter-testAcc.png'
    test_acc_plot_path = f'{dashboard_plots_path}/{test_acc_plot_name}'
    plt.plot(iters, test_accs)
    plt.xlabel('Iteration')
    plt.ylabel('Accuracy')
    plt.title('Test Accuracy by Iteration')
    plt.savefig(f'{test_acc_plot_path}')
    plt.close()

    return Response({
        'msg': 'plotting cumulated info...',
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

    train_df = process.dataset.get(name='train-raw').df
    dataset_train = IndexedDataset(train_df)

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
        al.trainAcc.append(train_acc)
    else:
        al.trainAcc[0] = train_acc
    if len(al.testAcc) == 0:
        al.testAcc.append(test_acc)
    else:
        al.testAcc[0] = test_acc
    
    al.save()

    data = { 'acc':test_acc }
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
        'msg': f'train AL model {iteration}', 
        'status': 'successful',
        'iteration':iteration, 
        'cumuNumData': al.cumulatedNumData[-1],
        'trainAcc': train_acc,
        'testAcc': test_acc,
    }
    return Response(data)


@api_view(['POST'])
def saveModel(request):
    
    data = json.loads(request.body)

    return Response(data)


@api_view(['POST'])
def trainFinalTeacher(request):
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
        'msg':"train final teacher",
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
    summary_teacher = summary(teacher_model, input_size=(batch_size,16))
    summary_student = summary(student_model, input_size=(batch_size,16))
    
    data = {
        'msg': 'do KD...',
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
def getShapPlotImage(request, img):
    print("\n ================= getShapPlotImage ================= \n")
    image_path = f"./shap-images/{img}"

    with open(image_path, 'rb') as img:
        response = HttpResponse(img.read(), content_type='image/png')
    return response


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
    test_loader = DataLoader(dataset_test, batch_size=batch_size,shuffle=False, drop_last=True)

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
    shap.summary_plot(shap_values_teacher, datas, valid_df.columns[:-1], show=False)
    plt.savefig(f'{shap_img_path}/all_class.png')
    plt.close()
    
    shap.summary_plot(shap_values_teacher[int(shapClass)], datas, valid_df.columns[:-1])
    summaryimage_filename = 'class_summary.png'
    plt.savefig(f'{shap_img_path}/{summaryimage_filename}')
    plt.close()

    shap.summary_plot(shap_values_teacher[int(shapClass)], datas, valid_df.columns[:-1], plot_type='bar')
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
    plt.savefig(f'{shap_img_path}/{gPieImage_filename}')
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
    test_loader = DataLoader(dataset_test, batch_size=batch_size,shuffle=False, drop_last=True)

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
    
    process = FullProcess.objects.all().order_by("-id")[0] 
    valid_df = process.dataset.get(name='valid-raw').df
    Xcol=valid_df.columns[:-1].tolist()

    d = dice_ml.Data(dataframe=valid_df, continuous_features=Xcol, outcome_name='Class')
    backend ='PYT' 
    device = connectDevice()
    teacher_model = ComplexModel().to(device)
    teacher_model.load_state_dict(torch.load('./trainingModels/LargeModel.ckpt', map_location=torch.device('cpu')))
    m = dice_ml.Model(model=teacher_model, backend=backend)
    
    exp_random = dice_ml.Dice(d, m) # initiate DiCE

    # Get parameters from the JSON request data
    data = json.loads(request.body)

    desired_y = int(data['desired_y'])
    inputX = data['inputX']

    floatX = [[float(i) for i in inputX]]
    query_instances = pd.DataFrame(floatX, columns =Xcol)
    # query_instances = test_df.iloc[4:5, :]  
    dice_exp = exp_random.generate_counterfactuals(query_instances, total_CFs=2, desired_class=desired_y, verbose=False)   
    df_qi=dice_exp.cf_examples_list[0].test_instance_df
    df_cf=dice_exp.cf_examples_list[0].final_cfs_df
    df = df_qi.append(df_cf)
    df_json = df.to_json(orient='records')

    return Response({'data': df_json})
    