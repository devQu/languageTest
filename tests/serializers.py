from rest_framework import serializers

from .models import ListTests, TestMassif

class TestItemsSerializer(serializers.ModelSerializer):

    type_question = serializers.SlugRelatedField(slug_field="title", read_only=True)

    class Meta:
        model = TestMassif
        fields = "__all__"

class ListAllTestsSerializer(serializers.ModelSerializer):
    
    complexity = serializers.SlugRelatedField(slug_field="title", read_only=True)
    test_items = serializers.SlugRelatedField(slug_field="test_name", read_only=True, many=True)
    type_category =serializers.SlugRelatedField(slug_field="title", read_only=True)

    class Meta:
        model = ListTests
        #fields = ["title", "complexity"]
        fields = "__all__"

class CreateTestViewSerializer(serializers.ModelSerializer):

    class Meta:
        model = ListTests
        fields = "__all__"