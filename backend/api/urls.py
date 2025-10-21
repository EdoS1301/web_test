from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_world, name='hello_world'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('quiz/save/', views.save_quiz_result, name='save_quiz_result'),
    path('user/stats/', views.get_user_stats, name='get_user_stats'),
]