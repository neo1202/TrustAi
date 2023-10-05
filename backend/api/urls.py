from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name='routes'),
    path('upload/', views.uploadFile, name='upload'),
    path('clearProcess/', views.clearProcess, name='clearProcess'),
    path('initProcess/', views.initProcess, name='initProcess'),
    path('readData/', views.readData, name='readData'),
    path('numData/<str:pk>', views.getNumOfData, name='numData'),
    path('deleteTest/', views.deleteTest, name='deleteTest'),
    path('settings/', views.setMethodsAndConfigs, name='settings'),
    path('trainInitModel/', views.trainInitModel, name='trainInitModel'),
    path('trainALModel/<str:iter>/', views.trainALModel, name='trainALModel'),
    path('uncertaintyRank/<str:iter>/', views.getUncertaintyRank, name='uncertaintyRank'),
    path('saveModel/', views.saveModel, name='saveModel'),
    path('trainFinalTeacher/', views.trainFinalTeacher, name='trainFinalTeacher'),
    path('KD/', views.doKD, name='KD'),
]