from django.db import models
from picklefield.fields import PickledObjectField
from django.contrib.postgres.fields import ArrayField

# Create your models here.

class Dataset(models.Model):

    """
    name:
        "raw": the data that is first read into
        "AL{n}": the n-th AL training set, 0 represents the initial training set
    """

    name = models.CharField(max_length=200) 
    df = PickledObjectField(default="default dataframe")

    def __str__(self) -> str:
        return self.name[0:50]
    
class FullProcess(models.Model):

    name = models.CharField(max_length=200)

    """
    configurations part
    * django model not providing dictionary field(or I cannot find for now)
    """

    initTrainingDataNum = models.IntegerField()
    initTrainingDataSelectMethod = models.CharField(max_length=200)
    model = models.CharField(max_length=200)
    uncertaintyQueryMethod = models.CharField(max_length=200)
    querySize = models.IntegerField() # number of data added into training set per iteration
    poolingSize = models.IntegerField()
    learningRate = models.FloatField()
    numEpochs = models.IntegerField()
    batchSize = models.IntegerField()

    """
    AL part
    各用一個動態陣列去存
        n-th iteration,
        cumulated number of data,
        train acc, 
        test acc,
        (teacher model selected?),
    """
    nthIter = ArrayField(models.CharField(max_length=200), default=list)
    cumulatedNumData = ArrayField(models.IntegerField(), default=list)
    trainAcc = ArrayField(models.FloatField(), default=list)
    testAcc = ArrayField(models.FloatField(), default=list)


    def __str__(self) -> str:
        return self.name[0:50]
