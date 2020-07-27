from django.contrib import admin
from django.contrib.postgres.fields import JSONField
from .utils import ReadableJSONFormField

from tests.models import TypeCategory, Complexity, ListTests, TypeQuestion, TestMassif

class ListTestsAdmin(admin.ModelAdmin):
    list_display = ['title', 'image_logo_test', 'complexity', 'quantity', 'type_category', 'description', 'if_pay', 'price', 'date']
    search_fields = ['title', 'complexity', 'type_category', 'if_pay']
    list_filter = ['title', 'complexity', 'if_pay', 'date']
    formfield_overrides = {
        JSONField: {'theory_json': ReadableJSONFormField},
    }

class TestMassifAdmin(admin.ModelAdmin):
    list_display = ['test_name', 'theory_json', 'question', 'type_question', 'text_answers_json', 'examples_json', 'insert_json', 'choise_json', 'order_list', 'style_type', 'logotype']
    search_fields = ['question']
    list_filter = ['test_name', 'question', 'type_question', 'style_type']

# Register your models here.
admin.site.register(ListTests, ListTestsAdmin)
admin.site.register(TestMassif, TestMassifAdmin)
admin.site.register(TypeCategory)
admin.site.register(Complexity)
admin.site.register(TypeQuestion)

