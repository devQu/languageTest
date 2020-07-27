# -*- coding: utf-8 -*- 

from django.http import JsonResponse, Http404, HttpResponse
from django.shortcuts import render
from django.template import RequestContext
from django.views.generic import View
from django.views.generic import ListView
from django.core import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from braces import views
import json

from .models import ListTests, TestMassif
from .serializers import ListAllTestsSerializer, TestItemsSerializer, CreateTestViewSerializer

class TestItemsView(APIView):
    def get(self, request):
        testItems = TestMassif.objects.all()
        serializer = TestItemsSerializer(testItems, many=True)
        return Response(serializer.data)

class ListAllTestsView(APIView):
    def get(self, request):
        listTests = ListTests.objects.all()
        serializer = ListAllTestsSerializer(listTests, many=True)
        return Response(serializer.data)

class CreateTestView(APIView):
    def post(self, request):
        testnew = CreateTestViewSerializer(data = request.data)
        if testnew.is_valid():
            testnew.save()
        return Response(status=201)

class ListAllTests(ListView):

    template_name = 'index.html'

    def get(self, request, *args, **kwargs):

        allTest = ListTests.objects.all()

        context = {
            'tests_items': allTest,
        }

        return render(request, 'index.html', context)

def get_ajax(request):
    
    if request.is_ajax():
        items = ['a', 'b']
        data = json.dumps(items)
        return HttpResponse(data, content_type='application/json')
    else:
        raise Http404

def filt_list(request):
    
    title_contains_query = request.GET.get('title_contains')
    categories_contains_query = request.GET.get('categories_contains')
    difficulty_contains_query = request.GET.get('difficulty_contains')

    allTest = ListTests.objects.all()

    if title_contains_query != '' and title_contains_query is not None:
        allTest = allTest.filter(title__icontains=title_contains_query)

    if categories_contains_query != '' and categories_contains_query is not None:
        if categories_contains_query == 'Грамматические тесты':
            allTest = allTest.filter(type_category__title__icontains="Grammaire")
        if categories_contains_query == 'Тематические курсы':
            allTest = allTest.filter(type_category__title__icontains="Thematic")

    if difficulty_contains_query != '' and difficulty_contains_query is not None:
        if difficulty_contains_query != 'all' and int(difficulty_contains_query) in range(1, 4):
            allTest = allTest.filter(complexity__title__icontains=difficulty_contains_query)

    if request.is_ajax():

        data = serializers.serialize('json', allTest)

        return HttpResponse(data)
    else:
        raise Http404