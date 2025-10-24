from django.db import models
from django.contrib.auth.models import User
import uuid
from django.utils import timezone

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255, blank=True)
    department = models.CharField(max_length=255, blank=True)
    organization = models.CharField(max_length=255, blank=True)
    privacy_policy_accepted = models.BooleanField(default=False)
    pd_consent_accepted = models.BooleanField(default=False)  # НОВОЕ ПОЛЕ
    consent_accepted_at = models.DateTimeField(null=True, blank=True)  # НОВОЕ ПОЛЕ
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.department}"

class PDConsentLog(models.Model):  # НОВАЯ МОДЕЛЬ ДЛЯ ЛОГИРОВАНИЯ СОГЛАСИЙ
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    consent_type = models.CharField(max_length=50)  # 'privacy_policy' или 'pd_consent'
    accepted = models.BooleanField(default=True)
    accepted_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-accepted_at']

class QuizResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_results')
    score = models.IntegerField()
    total_questions = models.IntegerField()
    percentage = models.FloatField()
    completed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-percentage', 'completed_at']