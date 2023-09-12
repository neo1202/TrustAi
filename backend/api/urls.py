from django.urls import path
from . import views

urlpatterns = [
    # path('', views.getRoutes, name='routes'),
    path('upload/', views.uploadFile, name='upload'),
    path('numData/', views.getNumOfData, name='numData'),
    path('settings/', views.setMethodsAndConfigs, name='settings'),
    path('trainInitModel/', views.trainInitModel, name='trainInitModel'),
    path('trainALModel/<str:iter>/', views.trainALModel, name='trainALModel'),
    path('uncertaintyRank/<str:iter>/', views.getUncertaintyRank, name='uncertaintyRank'),
    path('saveModel/', views.saveModel, name='saveModel'),
    path('KD/', views.doKD, name='KD'),
]