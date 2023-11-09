from django.db import models
from picklefield.fields import PickledObjectField
# from django.contrib.postgres.fields import ArrayField
from django_jsonform.models.fields import ArrayField

# Create your models here.

class FullProcess(models.Model):
    """
    configurations part
    * django model not providing dictionary field(or I cannot find for now)
    """
    processID = models.PositiveIntegerField() 

    imputerMethod = models.CharField(max_length=200, default="EM")

    initTrainingDataNum = models.PositiveIntegerField()
    initTrainingDataSelectMethod = models.CharField(max_length=200)
    trainingModel = models.CharField(max_length=200)
    uncertaintyQueryMethod = models.CharField(max_length=200)
    querySize = models.PositiveIntegerField() # number of data added into training set per iteration
    poolingSize = models.PositiveIntegerField()
    learningRate = models.FloatField()
    numEpochs = models.PositiveIntegerField()
    batchSize = models.PositiveIntegerField()

    finalTeacherAcc = models.FloatField(default=0)
    finalStudentAcc = models.FloatField(default=0)

    def __str__(self) -> str:
        return f'{self.uncertaintyQueryMethod}'


class Dataset(models.Model):
    """
    name:
        "raw": the data that is first read into
        "AL{n}": the n-th AL training set, 0 represents the initial training set
    """
    processID = models.ForeignKey(FullProcess, on_delete=models.CASCADE, related_name='dataset')
    name = models.CharField(max_length=200) 
    df = PickledObjectField(default="default dataframe")
    data = PickledObjectField(default="default data")
    labels = PickledObjectField(default="default labels")

    """
    多加這些去匹配 torch dataset，記得在一開始讀資料的時候也要把這些在資料庫初始化
    也要把函數一個一個確認有沒有改到 dataset，如果有的話 django 那邊也要去改資料庫
    training set: 
        labelOrNot:[1,0,0,0,1], 1 表示 label 過了
        prediction_record:[[], [], [], ...], remain empty
    validation set:
        labelOrNot:[1,1,1,1,1], all 1
        prediction_record:[
            [], [], [], ...
        ], 1 if the prediction is correct, 0 otherwise
    testing set: 
        labelOrNot:[1,1,1,1,1], all 1
        prediction_record:[[], [], [], ...], remain empty
    """
    labelOrNot = ArrayField(models.IntegerField(), default=list) # IndexedDataset 的 unlabeled_mask
    predictionRecord = ArrayField(
        ArrayField(
            models.IntegerField(), 
            default=list
        ), 
        default=list
    )

    def __str__(self) -> str:
        return self.name[0:50]
    

class ActiveLearning(models.Model):
    """
    AL part
    各用一個動態陣列去存
        n-th iteration, [0, 1, 2, 3, ...], 0 represents initial model
        cumulated number of data, [20, 40, 60, 80, ...]
        train acc, 
        test acc,
        (teacher model selected?),
    """
    processID = models.ForeignKey(FullProcess, on_delete=models.CASCADE, related_name='activelearning')

    nthIter = ArrayField(models.CharField(max_length=200), default=list)
    cumulatedNumData = ArrayField(models.IntegerField(), default=list)
    trainAcc = ArrayField(models.FloatField(), default=list)
    testAcc = ArrayField(models.FloatField(), default=list)

    queryIdxByIter = ArrayField(
        ArrayField(models.IntegerField(), default=list), 
        default=list
    )

    def __str__(self) -> str:
        return self.name[0:50]
