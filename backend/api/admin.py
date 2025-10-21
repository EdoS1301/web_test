from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, QuizResult

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Профиль'

class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_department', 'get_organization')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    
    def get_department(self, obj):
        try:
            return obj.userprofile.department
        except UserProfile.DoesNotExist:
            return "Не указан"
    get_department.short_description = 'Отдел'
    
    def get_organization(self, obj):
        try:
            return obj.userprofile.organization
        except UserProfile.DoesNotExist:
            return "Не указана"
    get_organization.short_description = 'Организация'

class QuizResultAdmin(admin.ModelAdmin):
    list_display = ('user', 'score', 'total_questions', 'percentage', 'completed_at')
    list_filter = ('completed_at', 'user')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('completed_at',)

# Перерегистрируем User с кастомной админкой
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
admin.site.register(QuizResult, QuizResultAdmin)