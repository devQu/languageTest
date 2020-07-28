# -*- coding: utf-8 -*- 

from django.conf.urls import url
from django.urls import path
from .views import ProfileUser

app_name = 'userApp'

urlpatterns = [
    path('<slug>/', ProfileUser.as_view(), name='user_curr')
    #path('api/data/', get_data, name='api-data'),
    #path('api/chart/data/', ChartProgress.as_view())
]