from django.contrib import admin
from userApp.models import ListUsers

# Register your models here.
class ListUsersAdmin(admin.ModelAdmin):
    list_display = ['user', 'image_user_avatar', 'premium_account', 'tests_accomplishment_json', 'tests_success_json', 'preferences_list', 'dictionary_json', 'date_registration', 'dates_visit_json', 'faq_json', 'slug']
    search_fields = ['user', ]
    list_filter = ['premium_account', 'date_registration']

admin.site.register(ListUsers, ListUsersAdmin)