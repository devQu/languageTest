# -*- coding: utf-8 -*- 

from __future__ import unicode_literals

from django.db import models
from django.conf import settings
from jsonfield import JSONField
from datetime import date
from django.shortcuts import reverse
from django.core.files.storage import FileSystemStorage
from django.contrib.postgres.fields import ArrayField
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db.models import Count
import os, re

# --- Inserted, choised, ordered tests
class TypeQuestion(models.Model):
    
    title = models.CharField(verbose_name="Тип вопроса", max_length=100)

    def __str__(self):
        return self.title

# --- ABSOLUTLY ALL questions items
class TestMassif(models.Model):

    STYLE_LIST = (
        ('T', 'text'),
        ('D', 'dialog'),
        ('C', 'text_center'),
    )

    test_name = models.CharField(verbose_name="Соотв-е тесту", max_length=30)
    question = models.CharField(verbose_name="Вопрос", max_length=1000)
    type_question = models.ForeignKey(TypeQuestion, on_delete=models.CASCADE)
    text_answers_json = JSONField(verbose_name="Текст:ответы #JSON", blank=True)
    insert_json = JSONField(verbose_name="Placeholders для insert #JSON", blank=True)
    choise_json = JSONField(verbose_name="Варианты для choise #JSON", blank=True)
    order_list = ArrayField(models.CharField(max_length=34, blank=True), verbose_name="Порядок слов order #JSON", default=list)
    theory_json = JSONField(verbose_name="Теория #JSON", blank=True)
    style_type = models.CharField(verbose_name="Стиль отображения", max_length=1, choices=STYLE_LIST, blank=True)
    examples_json = JSONField(verbose_name="Пример #JSON", blank=True)
    logotype = models.ImageField(verbose_name="URL логотипа", upload_to="question_images/", blank=True, null=True)

    def __str__(self):
        return "%s : %s" % (self.test_name, self.question)

    class Meta:
        verbose_name_plural="Общий список вопросов"

    def image_logotype(self):
        if self.logotype:
            return u'<img src="%s" width="100"/>' % self.logotype.url
        else:
            return '(none)'
    image_logotype.short_description = 'Изображение логотипа для вопроса'
    image_logotype.allow_tags = True

# --- Define if Grammaire or Thematic
class TypeCategory(models.Model):
    
    title = models.CharField(verbose_name="Имя категории", max_length=100)

    def __str__(self):
        return self.title

# --- Define complexity levels (1-3)
class Complexity(models.Model):

    title = models.CharField(verbose_name="Сложность", max_length=100)

    def __str__(self):
        return self.title

# --- Define every test item
class ListTests(models.Model):
    
    def change_filename(instance, filename):
        ext = filename.split('.')[-1]
        filename = "%s.%s" % (''.join(list(map(lambda x: str(ord(x)), instance.title))), ext)
        return os.path.join('test_images', filename)

    title = models.CharField(verbose_name="Название теста", max_length=100)
    logo_test = models.ImageField(verbose_name="Лого теста", upload_to=change_filename, help_text="...", blank=True)
    test_items = models.ManyToManyField(TestMassif, blank=True)
    complexity = models.ForeignKey(Complexity, on_delete=models.CASCADE)
    quantity = models.PositiveSmallIntegerField(verbose_name="Количество", default=None, null=True, blank=True) # --- Write in place after calculate !!!
    type_category = models.ForeignKey(TypeCategory, on_delete=models.CASCADE)
    description = models.TextField(verbose_name="Описание", max_length=1000)
    if_pay = models.BooleanField(verbose_name="Платный", default=False)
    price = models.SmallIntegerField(verbose_name="Цена", null=True, default=0)
    date = models.DateField(verbose_name="Дата создания", default=date.today)
    slug = models.SlugField(blank=True)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("testRun:itemTest", kwargs={
            'slug': self.slug
        })

    class Meta:
        verbose_name_plural="Список тестов"

    def image_logo_test(self):
        if self.logo_test:
            from django.utils.safestring import mark_safe
            return mark_safe(u'<img src="%s" width="50"/>' % self.logo_test.url)
        else:
            return '(none)'
    image_logo_test.short_description = 'Изображение лого текста'
    image_logo_test.allow_tags = True
"""
@receiver(post_save, sender=TestMassif)
def rewrite_text_answers_json(sender, instance, created, **kwargs):
    if created:
        item_massif_current = TestMassif.objects.last()
        dict_final = []
        for i in range(0, len(instance.text_answers_json)):
            #text = re.split(r'\W+', list(instance.text_answers_json.keys())[i])
            text = list(instance.text_answers_json.keys())[i].split("/")
            answers = list(list(instance.text_answers_json.values())[i].values())
            dict_final.append({"text": text, "answers": answers})
        item_massif_current.text_answers_json = dict_final
        item_massif_current.save()
"""
# --- Rewrite Field <quantity> and add relations in Field <test_items> of ListTests
@receiver(post_save, sender=ListTests)
def count_quantity(sender, instance, created, **kwargs):
    if created:
        test_current = ListTests.objects.last()
        correspond_questions = TestMassif.objects.filter(test_name = test_current.title)
        test_current.quantity = correspond_questions.count()
        test_current.slug = replaceChar(instance.title)
        for i in correspond_questions:
            test_current.test_items.add(i.id)
        test_current.save()

# --- Rewrite <slug> --> normal lower String without whitespaces
def replaceChar(char_obj):
    iscii_symbol_str = "ÂâÀàÇçÉéÊêÈèËëÎîÏïÔôÛûÙùÜüŸÿ"
    normal_symbol_str = "AaAaCcEeEeEeEeIiIiOoUuUuUuYy"
    output = []
    for i in char_obj:
        if i in iscii_symbol_str: 
            output.append(normal_symbol_str[iscii_symbol_str.index(i)])
        elif i == " ": pass
        else: 
            output.append(i)
    return(''.join(output).lower())
