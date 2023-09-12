from django.shortcuts import render
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.

# @api_view(['GET'])
# def getRoutes(request):

#     routes = [
#         {
#             'Endpoint': '/upload/',
#             'method': 'POST',
#             'body': None,
#             'description': 'Upload file'
#         },
#     ]

#     return Response(routes)

@api_view(['POST'])
def uploadFile(request):
    # print("\nUploading file...\n")
    # print(request)
    data = json.loads(request.body)
    return Response(data)

@api_view(['GET'])
def getNumOfData(request):
    # 實際上，應該是丟進一個資料集，回傳長度。可能是初始資料、某一次迭代的訓練集等

    data = {"num": 12345}
    return Response(data)

@api_view(['POST']) # not yet in urls
def setDataset(request):
    # 實際上，應該是組合出一個資料集。包括初始資料集（隨機跟指定 index 的方法都要做出來）、某一次迭代的訓練集等
    # 初始資料集可以是 dataset0，往後 AL 就從 dataset1 開始

    return 

@api_view(['POST', 'PUT']) # 'DELETE'? 
def setMethodsAndConfigs(request):
    # 設定各種設定，包括初始資料選擇方法、模型選擇、AL query、各種參數。目前想到的方法是用 django model 存
    
    data = json.loads(request.body)
    return Response(data)

@api_view(['POST'])
def trainInitModel(request):
    # 看最一開始的訓練跟之後的訓練要不要分開（回去看 pytorch 程式碼）
    # 可以（應該是必須）存下這個（還有之後每個 iter 的） model，因為要拿這個去 predict_prob 並計算 uncertainty

    # data = {"msg": "train initial model..."}
    data = json.loads(request.body)
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