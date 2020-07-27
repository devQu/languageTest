# -*- coding: utf-8 -*- 

from django.conf.urls import url
from django.urls import path
from .views import TestRun, testProcessing

app_name = 'testRun'

urlpatterns = [
    path('<slug>/', TestRun.as_view(template_name='runtest.html'), name='itemTest'),
    path('<slug>/go/', testProcessing, name='itemCurrent')
]