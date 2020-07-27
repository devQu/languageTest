# -*- coding: utf-8 -*- 

from django.conf.urls import url
from django.urls import path
from .views import ListAllTests, get_ajax, filt_list, ListAllTestsView, TestItemsView, CreateTestView

app_name = 'tests'

urlpatterns = [
    path('', ListAllTests.as_view(template_name='index.html'), name='list_test_massif'),
    path('ajax/', get_ajax),
    path('filt/', filt_list),
    path('tests-all/', ListAllTestsView.as_view()),
    path('testitems/', TestItemsView.as_view()),
    path('tests-all-create/', CreateTestView.as_view())
]