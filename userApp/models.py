# -*- coding: utf-8 -*- 

from django.db import models
from django.conf import settings
from django.shortcuts import reverse
from django.dispatch import receiver
from django.db.models.signals import post_save
from jsonfield import JSONField
from datetime import date
from django.core.files.storage import FileSystemStorage
from django.contrib.postgres.fields import ArrayField
import os

# --- Class of all users service data
class ListUsers(models.Model):

    def change_filename_avatar(instance, filename):
        ext = filename.split('.')[-1]
        filename = "%s.%s" % (''.join(list(map(lambda x: str(ord(x)), instance.user.username))), ext)
        return os.path.join('users_images/avatars', filename)

    user = models.OneToOneField(settings.AUTH_USER_MODEL, unique=True, on_delete=models.CASCADE)
    avatar_img = models.ImageField(verbose_name="Аватар", upload_to=change_filename_avatar, null=True, blank=True)
    premium_account = models.BooleanField(verbose_name="Премиум акк", default=False)
    tests_accomplishment_json = JSONField(verbose_name="ID_тест:ID_вопрос:выполнено #JSON", blank=True)
    tests_success_json = JSONField(verbose_name="ID_тест:кол-во True", blank=True)
    preferences_list = ArrayField(models.CharField(max_length=25, blank=True), verbose_name="[Тэг]", default=list)
    dictionary_json = JSONField(verbose_name="Слово:статус #JSON", blank=True)
    date_registration = models.DateField(verbose_name="Дата рег-ции", default=date.today)
    dates_visit_json = JSONField(verbose_name="дата:test #JSON", blank=True, help_text="Даты посещений")
    faq_json = JSONField(verbose_name="дата:FAQtext #JSON", blank=True, help_text="FAQ")
    slug = models.SlugField(blank=True)
    
    def __str__(self):
        return str(self.user)

    def get_absolute_url(self):
        return reverse("userApp:user_curr", kwargs={
            'slug': self.slug
        })

    class Meta:
        verbose_name_plural="Список служебных данных пользователей"

    def image_user_avatar(self):
        if self.avatar_img:
            from django.utils.safestring import mark_safe
            return mark_safe(u'<img src="%s" width="50"/>' % self.avatar_img.url)
        else:
            return '(none)'
    avatar_img.short_description = 'Аватар текущего юзера'
    avatar_img.allow_tags = True

@receiver(post_save, sender=ListUsers)
def set_slug(sender, instance, created, **kwargs):
    if created:
        print(instance)
        print(created)
        user_current = ListUsers.objects.last()

        user_current.slug = user_current.user.username
        user_current.save()