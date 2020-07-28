from django.shortcuts import render
from django.template import RequestContext
from django.views.generic import View, DetailView, ListView
from .models import ListUsers
from tests.models import ListTests, TestMassif
#from .serializers import ProfileUserSerializer
from django.core import serializers
import json, collections, random
from django.http import JsonResponse, Http404, HttpResponse
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import TemplateHTMLRenderer
from django.contrib.auth.mixins import LoginRequiredMixin

User = get_user_model()

class ProfileUser(LoginRequiredMixin, DetailView):

    login_url = '/account/login'
    model = ListUsers
    template_name = 'profile.html'

    def get(self, request, *args, **kwargs):
        serialized_obj = serializers.serialize('json', list(self.get_queryset()))
        #return render(request, 'profile.html', {'data': serialized_obj})
        return HttpResponse(serialized_obj)

#from django.contrib.auth.models import User
#tempUser= User.objects.create_user(username="anon", email="none", first_name="none", last_name="none")
#tempUser.save()
#if request.user.is_anonymous:
#  anonUser = User.objects.get(username='anon')
#  request.user=User.objects.get(id=anonUser.id)

#class ProfileUser(APIView):
    #renderer_classes = [TemplateHTMLRenderer]
    #template_name = "profile.html"
#    def get(self, request, *args, **kwargs):
#        currUser = ListUsers.objects.filter(user = request.user)
#        serializer = ProfileUserSerializer(currUser, many=True)
        #return render(request, 'profile.html', {'data': serializer.data})
#        return Response(serializer.data)

#def get_data(request, *args, **kwargs):
#    data = {
#        "name": "Alex",
#        "surname": "Avonts"
#    }
#    return JsonResponse(data)

#class ChartProgress(APIView):
#
#    authentication_classes = []
#    permission_classes = []
#
#    def get(self, request, format=None):
#        data = {
#            "name": "Alex",
#            "surname": "Avonts",
#            "users": User.objects.all().count(),
#            "userData": [3, 5, 6, 2, 1, 5]
#        }
#        return Response(data)
