# -*- coding: utf-8 -*- 

from django.conf.urls import url
from django.urls import path
from .views import ProfileUser, get_data, ChartProgress

app_name = 'userApp'

urlpatterns = [
    path('', ProfileUser.as_view(), name='profile'),
    path('api/data/', get_data, name='api-data'),
    path('api/chart/data/', ChartProgress.as_view())
]