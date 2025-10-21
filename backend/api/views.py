from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import QuizResult, UserProfile
import jwt
import datetime
from django.conf import settings
import logging

# Настройка логгера
logger = logging.getLogger(__name__)

def get_secret_key():
    return getattr(settings, 'SECRET_KEY', 'fallback-secret-key')

def hello_world(request):
    """Тестовая функция для проверки работы API"""
    return JsonResponse({
        'message': 'Django API is working!', 
        'status': 'success',
        'timestamp': datetime.datetime.now().isoformat()
    })

@csrf_exempt
def register(request):
    """
    Регистрация нового пользователя
    """
    if request.method == 'POST':
        try:
            # Парсим JSON данные
            try:
                data = json.loads(request.body.decode('utf-8'))
            except json.JSONDecodeError as e:
                logger.error(f"Ошибка парсинга JSON: {e}")
                return JsonResponse({
                    'error': 'Неверный формат данных',
                    'details': str(e)
                }, status=400)

            logger.info(f"Регистрация пользователя: {data.get('email', 'No email')}")

            # Валидация обязательных полей
            required_fields = ['email', 'password']
            if not all(field in data for field in required_fields):
                return JsonResponse({
                    'error': 'Отсутствуют обязательные поля',
                    'required': required_fields
                }, status=400)

            email = data['email']
            password = data['password']

            # Проверяем, существует ли пользователь
            if User.objects.filter(email=email).exists():
                logger.warning(f"Попытка регистрации существующего email: {email}")
                return JsonResponse({
                    'error': 'Пользователь с таким email уже существует'
                }, status=400)

            # Создаем пользователя
            try:
                user = User.objects.create_user(
                    username=email,  # Используем email как username
                    email=email,
                    password=password,
                    first_name=data.get('full_name', '').split(' ')[0] if data.get('full_name') else '',
                    last_name=' '.join(data.get('full_name', '').split(' ')[1:]) if data.get('full_name') else ''
                )
                logger.info(f"Создан пользователь: {user.id}")
            except Exception as e:
                logger.error(f"Ошибка создания пользователя: {e}")
                return JsonResponse({
                    'error': 'Ошибка создания пользователя',
                    'details': str(e)
                }, status=400)

            # Создаем профиль пользователя
            try:
                profile = UserProfile.objects.create(
                    user=user,
                    full_name=data.get('full_name', ''),
                    department=data.get('department', ''),
                    organization=data.get('organization', '')
                )
                logger.info(f"Создан профиль для пользователя: {user.id}")
            except Exception as e:
                # Если профиль не создался, удаляем пользователя
                user.delete()
                logger.error(f"Ошибка создания профиля: {e}")
                return JsonResponse({
                    'error': 'Ошибка создания профиля пользователя',
                    'details': str(e)
                }, status=400)

            # Создаем JWT токен
            try:
                payload = {
                    'user_id': user.id,
                    'email': user.email,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
                }
                token = jwt.encode(payload, get_secret_key(), algorithm='HS256')
                
                # Если token в bytes, конвертируем в string
                if isinstance(token, bytes):
                    token = token.decode('utf-8')
                    
            except Exception as e:
                logger.error(f"Ошибка создания токена: {e}")
                return JsonResponse({
                    'error': 'Ошибка создания токена',
                    'details': str(e)
                }, status=400)

            # Формируем успешный ответ
            response_data = {
                'message': 'Регистрация успешно завершена',
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': profile.full_name,
                    'department': profile.department,
                    'organization': profile.organization
                },
                'timestamp': datetime.datetime.now().isoformat()
            }

            logger.info(f"Успешная регистрация: {user.email} (ID: {user.id})")
            return JsonResponse(response_data, status=201)

        except Exception as e:
            logger.error(f"Неожиданная ошибка при регистрации: {e}")
            return JsonResponse({
                'error': 'Внутренняя ошибка сервера',
                'details': str(e)
            }, status=500)

    else:
        return JsonResponse({
            'error': 'Метод не разрешен',
            'allowed_methods': ['POST']
        }, status=405)

@csrf_exempt
def login(request):
    """
    Аутентификация пользователя
    """
    if request.method == 'POST':
        try:
            # Парсим JSON данные
            try:
                data = json.loads(request.body.decode('utf-8'))
            except json.JSONDecodeError as e:
                logger.error(f"Ошибка парсинга JSON: {e}")
                return JsonResponse({
                    'error': 'Неверный формат данных',
                    'details': str(e)
                }, status=400)

            logger.info(f"Попытка входа: {data.get('email', 'No email')}")

            # Валидация обязательных полей
            required_fields = ['email', 'password']
            if not all(field in data for field in required_fields):
                return JsonResponse({
                    'error': 'Отсутствуют обязательные поля',
                    'required': required_fields
                }, status=400)

            email = data['email']
            password = data['password']

            # Ищем пользователя по email
            try:
                user = User.objects.get(email=email)
                logger.info(f"Найден пользователь: {user.id}")
            except User.DoesNotExist:
                logger.warning(f"Пользователь не найден: {email}")
                return JsonResponse({
                    'error': 'Неверный email или пароль'
                }, status=400)

            # Аутентифицируем пользователя
            user = authenticate(username=user.username, password=password)
            if user is None:
                logger.warning(f"Неверный пароль для пользователя: {email}")
                return JsonResponse({
                    'error': 'Неверный email или пароль'
                }, status=400)

            # Получаем или создаем профиль пользователя
            try:
                profile, created = UserProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'full_name': f"{user.first_name} {user.last_name}".strip() or user.email,
                        'department': 'Не указан',
                        'organization': 'Не указана'
                    }
                )
                if created:
                    logger.info(f"Создан профиль по умолчанию для: {user.id}")
            except Exception as e:
                logger.error(f"Ошибка получения профиля: {e}")
                return JsonResponse({
                    'error': 'Ошибка получения данных пользователя'
                }, status=400)

            # Создаем JWT токен
            try:
                payload = {
                    'user_id': user.id,
                    'email': user.email,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
                }
                token = jwt.encode(payload, get_secret_key(), algorithm='HS256')
                
                # Если token в bytes, конвертируем в string
                if isinstance(token, bytes):
                    token = token.decode('utf-8')
                    
            except Exception as e:
                logger.error(f"Ошибка создания токена: {e}")
                return JsonResponse({
                    'error': 'Ошибка создания токена'
                }, status=400)

            # Формируем успешный ответ
            response_data = {
                'message': 'Вход выполнен успешно',
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': profile.full_name,
                    'department': profile.department,
                    'organization': profile.organization
                },
                'timestamp': datetime.datetime.now().isoformat()
            }

            logger.info(f"Успешный вход: {user.email} (ID: {user.id})")
            return JsonResponse(response_data)

        except Exception as e:
            logger.error(f"Неожиданная ошибка при входе: {e}")
            return JsonResponse({
                'error': 'Внутренняя ошибка сервера',
                'details': str(e)
            }, status=500)

    else:
        return JsonResponse({
            'error': 'Метод не разрешен',
            'allowed_methods': ['POST']
        }, status=405)

@csrf_exempt
def save_quiz_result(request):
    """
    Сохранение результатов теста
    """
    if request.method == 'POST':
        try:
            # Проверяем авторизацию
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return JsonResponse({
                    'error': 'Требуется авторизация',
                    'details': 'Отсутствует или неверный токен'
                }, status=401)

            token = auth_header.replace('Bearer ', '')
            
            try:
                payload = jwt.decode(token, get_secret_key(), algorithms=['HS256'])
                user = User.objects.get(id=payload['user_id'])
                logger.info(f"Сохранение результата для пользователя: {user.id}")
            except jwt.ExpiredSignatureError:
                return JsonResponse({
                    'error': 'Токен истек'
                }, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({
                    'error': 'Неверный токен'
                }, status=401)
            except User.DoesNotExist:
                return JsonResponse({
                    'error': 'Пользователь не найден'
                }, status=401)

            # Парсим данные теста
            try:
                data = json.loads(request.body.decode('utf-8'))
            except json.JSONDecodeError as e:
                return JsonResponse({
                    'error': 'Неверный формат данных',
                    'details': str(e)
                }, status=400)

            # Валидация данных теста
            required_fields = ['score', 'total_questions', 'percentage']
            if not all(field in data for field in required_fields):
                return JsonResponse({
                    'error': 'Отсутствуют данные теста',
                    'required': required_fields
                }, status=400)

            # Сохраняем результат
            try:
                quiz_result = QuizResult.objects.create(
                    user=user,
                    score=data['score'],
                    total_questions=data['total_questions'],
                    percentage=data['percentage']
                )
                logger.info(f"Сохранен результат теста: {quiz_result.id}")
            except Exception as e:
                logger.error(f"Ошибка сохранения результата: {e}")
                return JsonResponse({
                    'error': 'Ошибка сохранения результата',
                    'details': str(e)
                }, status=400)

            # Получаем лучший результат пользователя
            best_result = QuizResult.objects.filter(user=user).order_by('-percentage').first()

            response_data = {
                'message': 'Результат успешно сохранен',
                'current_score': data['percentage'],
                'best_score': best_result.percentage if best_result else data['percentage'],
                'quiz_id': str(quiz_result.id),
                'timestamp': datetime.datetime.now().isoformat()
            }

            return JsonResponse(response_data)

        except Exception as e:
            logger.error(f"Неожиданная ошибка при сохранении результата: {e}")
            return JsonResponse({
                'error': 'Внутренняя ошибка сервера',
                'details': str(e)
            }, status=500)

    else:
        return JsonResponse({
            'error': 'Метод не разрешен',
            'allowed_methods': ['POST']
        }, status=405)

@csrf_exempt
def get_user_stats(request):
    """
    Получение статистики пользователя
    """
    if request.method == 'GET':
        try:
            # Проверяем авторизацию
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return JsonResponse({
                    'error': 'Требуется авторизация',
                    'details': 'Отсутствует или неверный токен'
                }, status=401)

            token = auth_header.replace('Bearer ', '')
            
            try:
                payload = jwt.decode(token, get_secret_key(), algorithms=['HS256'])
                user = User.objects.get(id=payload['user_id'])
                logger.info(f"Получение статистики для пользователя: {user.id}")
            except jwt.ExpiredSignatureError:
                return JsonResponse({
                    'error': 'Токен истек'
                }, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({
                    'error': 'Неверный токен'
                }, status=401)
            except User.DoesNotExist:
                return JsonResponse({
                    'error': 'Пользователь не найден'
                }, status=401)

            # Получаем профиль пользователя
            try:
                profile, created = UserProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'full_name': f"{user.first_name} {user.last_name}".strip() or user.email,
                        'department': 'Не указан',
                        'organization': 'Не указана'
                    }
                )
            except Exception as e:
                logger.error(f"Ошибка получения профиля: {e}")
                return JsonResponse({
                    'error': 'Ошибка получения данных пользователя'
                }, status=400)

            # Получаем статистику пользователя
            results = QuizResult.objects.filter(user=user).order_by('-percentage')
            best_result = results.first() if results.exists() else None
            total_attempts = results.count()

            # Получаем историю попыток
            attempts_history = [
                {
                    'score': result.score,
                    'total_questions': result.total_questions,
                    'percentage': result.percentage,
                    'completed_at': result.completed_at.isoformat()
                }
                for result in results[:10]  # Последние 10 попыток
            ]

            response_data = {
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
                },
                'timestamp': datetime.datetime.now().isoformat()
            }

            return JsonResponse(response_data)

        except Exception as e:
            logger.error(f"Неожиданная ошибка при получении статистики: {e}")
            return JsonResponse({
                'error': 'Внутренняя ошибка сервера',
                'details': str(e)
            }, status=500)

    else:
        return JsonResponse({
            'error': 'Метод не разрешен',
            'allowed_methods': ['GET']
        }, status=405)