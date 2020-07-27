from rest_framework import serializers

from .models import ListUsers

class ProfileUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ListUsers
        #fields = ["user", "tests_accomplishment_json"]
        fields = "__all__"
