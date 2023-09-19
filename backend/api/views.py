from django.shortcuts import render
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Dataset
from .models import FullProcess

# Create your views here.

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


@api_view(['POST'])
def readData(request):
    import pandas as pd

    msg = ''
    if not Dataset.objects.filter(name = 'raw').exists():
        # at least one object satisfying query exists
        msg = 'dataset does not exist, now store one in'
        print(f"\n\n{msg}\n\n")
        df = pd.read_csv(r'./pytorch/data/preprocessed_beans_train.csv')
        dataset = Dataset()
        dataset.name = 'raw'
        dataset.df = df
        dataset.save()
    else:
        # no object satisfying query exists
        msg = 'dataset already exists, no need to store again'
        print(f"\n\n{msg}\n\n")

    return Response({'msg':f'{msg}'})

@api_view(['POST'])
def initProcess(request):
    process = FullProcess()

    process.initTrainingDataNum = 0
    process.initTrainingDataSelectMethod = 'Randomly Generate'
    process.model = '3 Layer Neural Network Model'
    process.uncertaintyQueryMethod = 'Margin'
    process.querySize = 20
    process.poolingSize = 300
    process.learningRate = 1e-3
    process.numEpochs = 100
    process.batchSize = 16

    process.nthIter = []
    process.cumulatedNumData = []
    process.trainAcc = []
    process.testAcc = []

    process.save()

    return Response({'msg':"init process done"})

@api_view(['GET'])
def getNumOfData(request, pk):
    # 實際上，應該是丟進一個資料集，回傳長度。可能是初始資料、某一次迭代的訓練集等

    # print(f"\n\nget number of rows of dataset {pk}\n\n")

    dataset = Dataset.objects.get(name=pk)
    # if dataset.DoesNotExist:
    if not Dataset.objects.filter(name=pk).exists():
        print(f"dataset {pk} does not exist!")

    numRows = dataset.df.shape[0]
    numCols = dataset.df.shape[1]
    print(dataset.df.shape)

    data = {'numRows': numRows, 'numCols': numCols}
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
    # 設定各種設定，包括初始資料選擇方法、模型選擇、AL query、各種參數。目前想到的方法是用 django model 存
    
    data = json.loads(request.body)
    print(f"\n\nsetting type = {data['type']}, value = {data['value']}\n\n")
    return Response(data)


@api_view(['POST'])
def trainInitModel(request):
    # 看最一開始的訓練跟之後的訓練要不要分開（回去看 pytorch 程式碼）
    # 可以（應該是必須）存下這個（還有之後每個 iter 的） model，因為要拿這個去 predict_prob 並計算 uncertainty

    import sys
    sys.path.append('../pytorch/utils')

    import pandas as pd
    from sklearn.model_selection import train_test_split
    from torch.utils.data import DataLoader
    from pytorch.config import config
    from pytorch.utils.dataset import IndexedDataset
    from pytorch.utils.utils import connectDevice
    from pytorch.utils.modelStructures import ComplexModel
    from pytorch.utils.query import query_the_oracle
    from pytorch.utils.trainModel import use_labeled_to_train, test

    device = connectDevice()

    query_size = config['query_size']
    pool_size = config['pool_size']
    batch_size = config['batch_size']

    df = pd.read_csv('./pytorch/data/preprocessed_beans_train.csv')    
    train_df, valid_df = train_test_split(df, test_size=0.2, random_state=42) # valid_ratio = 0.2
    train_df = train_df.reset_index(drop=True)

    dataset_train = IndexedDataset(train_df)
    dataset_valid = IndexedDataset(valid_df, TestOrValid=True, Valid=True)
    valid_loader = DataLoader(dataset_valid, batch_size=batch_size, shuffle=True, drop_last=True)

    test_df = pd.read_csv('./pytorch/data/preprocessed_beans_test.csv')
    dataset_test = IndexedDataset(test_df, TestOrValid=True)
    test_loader = DataLoader(dataset_test, batch_size=batch_size,shuffle=False, drop_last=True)

    # 第0個model, 初始的model用20個統一初始資料來訓練，理論上三種取樣方式的起始test_acc會差不多
    model = ComplexModel().to(device) #先訓練一個seed model 用初始隨機資料
    query_the_oracle(model, device, dataset_train, query_size=query_size, query_strategy='init', pool_size=pool_size) #取得的參數統一為init
    use_labeled_to_train(model, device, dataset_train, valid_loader, teacher_model=model, kd=False) #訓練, teacher隨便放

    # Test the model on test set
    test_acc = test(model, device, test_loader)
    print(f"Iteration: 0, test acc: {test_acc}\n")
    # test_acc_list.append(test_acc)
    # PATH = f'./models/model_0.pt'
    # torch.save(model.state_dict(), PATH) #儲存model

    print(f'\n\n{test_acc}\n\n')


    # data = json.loads(request.body)
    data = {'acc':test_acc}
    return Response(data)


@api_view(['POST'])
def trainALModel(request, iter):

    data = {'msg': f'train AL model {iter}'}
    return Response(data)


@api_view(['GET'])
def getUncertaintyRank(request, iter):
    # 回傳用此次 iteration 訓練出的模型之預測機率算出的 uncertainty ranking

    data = {"msg": f"get uncertainty ranking iter {iter}(an list or a bar chart figure)"}
    return Response(data)


@api_view(['POST'])
def saveModel(request):
    
    data = json.loads(request.body)

    return Response(data)


@api_view(['POST'])
def doKD(request):

    data = {'msg': 'do KD...'}
    return Response(data)
