from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import QuizResult, UserProfile
import jwt
import datetime
from django.conf import settings

def get_secret_key():
    return getattr(settings, 'SECRET_KEY', 'fallback-secret-key')

# ДОБАВЬТЕ ЭТУ ФУНКЦИЮ
def hello_world(request):
    return JsonResponse({'message': 'Django API is working!', 'status': 'success'})

# ... остальной код views.py оставьте без изменений

@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Проверяем, существует ли пользователь
            if User.objects.filter(email=data['email']).exists():
                return JsonResponse({'error': 'Пользователь с таким email уже существует'}, status=400)
            
            # Создаем пользователя
            user = User.objects.create_user(
                username=data['email'],
                email=data['email'],
                password=data['password'],
                first_name=data.get('full_name', '').split(' ')[0] if data.get('full_name') else '',
                last_name=' '.join(data.get('full_name', '').split(' ')[1:]) if data.get('full_name') else ''
            )
            
            # Сохраняем дополнительную информацию в профиль
            profile = UserProfile.objects.create(
                user=user,
                full_name=data.get('full_name', ''),
                department=data.get('department', ''),
                organization=data.get('organization', '')
            )
            
            # Создаем JWT токен
            payload = {
                'user_id': user.id,
                'email': user.email,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
            }
            token = jwt.encode(payload, get_secret_key(), algorithm='HS256')
            
            return JsonResponse({
                'message': 'Регистрация успешна',
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': profile.full_name,
                    'department': profile.department,
                    'organization': profile.organization
                }
            })
            
        except Exception as e:
            return JsonResponse({'error': f'Ошибка регистрации: {str(e)}'}, status=400)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data['email']
            password = data['password']
            
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Неверный email или пароль'}, status=400)
            
            # Аутентифицируем пользователя
            user = authenticate(username=user.username, password=password)
            if user is None:
                return JsonResponse({'error': 'Неверный email или пароль'}, status=400)
            
            # Получаем или создаем профиль пользователя
            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'full_name': f"{user.first_name} {user.last_name}".strip() or user.email,
                    'department': 'Не указан',
                    'organization': 'Не указана'
                }
            )
            
            # Создаем JWT токен
            payload = {
                'user_id': user.id,
                'email': user.email,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
            }
            token = jwt.encode(payload, get_secret_key(), algorithm='HS256')
            
            return JsonResponse({
                'message': 'Вход выполнен успешно',
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': profile.full_name,
                    'department': profile.department,
                    'organization': profile.organization
                }
            })
            
        except Exception as e:
            return JsonResponse({'error': f'Ошибка входа: {str(e)}'}, status=400)

@csrf_exempt
def save_quiz_result(request):
    if request.method == 'POST':
        try:
            # Проверяем авторизацию
            token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if not token:
                return JsonResponse({'error': 'Требуется авторизация'}, status=401)
            
            try:
                payload = jwt.decode(token, get_secret_key(), algorithms=['HS256'])
                user = User.objects.get(id=payload['user_id'])
            except Exception as e:
                return JsonResponse({'error': f'Неверный токен: {str(e)}'}, status=401)
            
            data = json.loads(request.body)
            
            # Сохраняем результат
            quiz_result = QuizResult.objects.create(
                user=user,
                score=data['score'],
                total_questions=data['total_questions'],
                percentage=data['percentage']
            )
            
            # Получаем лучший результат пользователя
            best_result = QuizResult.objects.filter(user=user).order_by('-percentage').first()
            
            return JsonResponse({
                'message': 'Результат сохранен',
                'current_score': data['percentage'],
                'best_score': best_result.percentage if best_result else data['percentage'],
                'quiz_id': str(quiz_result.id)
            })
            
        except Exception as e:
            return JsonResponse({'error': f'Ошибка сохранения результата: {str(e)}'}, status=400)

@csrf_exempt
def get_user_stats(request):
    if request.method == 'GET':
        try:
            # Проверяем авторизацию
            token = request.headers.get('Authorization', '').replace('Bearer ', '')
            if not token:
                return JsonResponse({'error': 'Требуется авторизация'}, status=401)
            
            try:
                payload = jwt.decode(token, get_secret_key(), algorithms=['HS256'])
                user = User.objects.get(id=payload['user_id'])
            except:
                return JsonResponse({'error': 'Неверный токен'}, status=401)
            
            # Получаем профиль пользователя
            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    'full_name': f"{user.first_name} {user.last_name}".strip() or user.email,
                    'department': 'Не указан',
                    'organization': 'Не указана'
                }
            )
            
            # Получаем статистику пользователя
            results = QuizResult.objects.filter(user=user).order_by('-percentage')
            best_result = results.first() if results.exists() else None
            total_attempts = results.count()
            
            # Получаем историю всех попыток
            attempts_history = [
                {
                    'score': result.score,
                    'total_questions': result.total_questions,
                    'percentage': result.percentage,
                    'completed_at': result.completed_at.isoformat()
                }
                for result in results[:10]  # Последние 10 попыток
            ]
            
            return JsonResponse({
                'user': {
                    'full_name': profile.full_name,
                    'department': profile.department,
                    'organization': profile.organization,
                    'email': user.email
                },
                'stats': {
                    'best_score': best_result.percentage if best_result else 0,
                    'total_attempts': total_attempts,
                    'last_attempt': best_result.completed_at.isoformat() if best_result else None,
                    'attempts_history': attempts_history
                }
            })
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)