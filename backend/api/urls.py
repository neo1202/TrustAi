from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name='routes'),
    path('upload/', views.uploadFile, name='upload'),
    path('clearProcess/', views.clearProcess, name='clearProcess'),
    path('initProcess/', views.initProcess, name='initProcess'),
    path('readData/', views.readData, name='readData'),
    path('getData/<str:pk>', views.getData, name='getData'),
    path('deleteTest/', views.deleteTest, name='deleteTest'),
    path('settings/', views.setMethodsAndConfigs, name='settings'),
    path('uncertaintyRank/<str:iter>/', views.getUncertaintyRank, name='uncertaintyRank'),
    path('plotCumulation/', views.plotCumulation, name='plotCumulation'), #<str:iter>/
    path('trainInitModel/', views.trainInitModel, name='trainInitModel'),
    path('trainALModel/<str:iter>/', views.trainALModel, name='trainALModel'),
    path('saveModel/', views.saveModel, name='saveModel'),
    path('trainFinalTeacher/', views.trainFinalTeacher, name='trainFinalTeacher'),
    path('KD/', views.doKD, name='KD'),
    path('processShapClassPlot/', views.processShapClassPlot, name='processShapClassPlot'),
    path('processDepClassPlot/', views.processDepClassPlot, name='processDepClassPlot'),
    path('getShapPlotImage/<str:img>/', views.getShapPlotImage, name='getShapPlotImage'),
    path('processCF/', views.processCF, name='processCF'),
]