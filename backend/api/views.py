import json
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import IntegrityError
from django.utils import timezone
from .models import UserProfile, QuizResult

# Генерация JWT токена
def generate_token(user):
    payload = {
        'user_id': user.id,
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

# Валидация JWT токена
def validate_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Получение пользователя из токена
def get_user_from_token(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    payload = validate_token(token)
    
    if not payload:
        return None
    
    try:
        user = User.objects.get(id=payload['user_id'])
        return user
    except User.DoesNotExist:
        return None

@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Проверяем обязательные поля
            if not data.get('email') or not data.get('password'):
                return JsonResponse({
                    'error': 'Email и пароль обязательны для заполнения'
                }, status=400)
            
            # Проверяем домен email
            email = data['email'].lower()
            if not email.endswith('.gov.ru'):
                return JsonResponse({
                    'error': 'Регистрация доступна только для email с доменом .gov.ru'
                }, status=400)
            
            # Проверяем длину пароля
            if len(data['password']) < 8:
                return JsonResponse({
                    'error': 'Пароль должен содержать не менее 8 символов'
                }, status=400)
            
            # Проверяем, существует ли пользователь
            if User.objects.filter(username=email).exists():
                return JsonResponse({
                    'error': 'Пользователь с таким email уже существует'
                }, status=400)
            
            # Создаем пользователя
            user = User.objects.create_user(
                username=email,
                email=email,
                password=data['password']
            )
            
            # Создаем профиль пользователя (только с email)
            profile = UserProfile.objects.create(
                user=user,
                email=email
            )
            
            # Генерируем токен
            token = generate_token(user)
            
            return JsonResponse({
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': user.email.split('@')[0],  # Используем часть email как имя
                    'department': 'Государственное учреждение',
                    'organization': 'Государственное учреждение'
                },
                'message': 'Регистрация успешно завершена'
            })
            
        except IntegrityError:
            return JsonResponse({
                'error': 'Пользователь с таким email уже существует'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'error': f'Ошибка при регистрации: {str(e)}'
            }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Проверяем обязательные поля
            if not data.get('email') or not data.get('password'):
                return JsonResponse({
                    'error': 'Email и пароль обязательны для заполнения'
                }, status=400)
            
            # Аутентифицируем пользователя
            user = authenticate(username=data['email'], password=data['password'])
            
            if user is not None:
                # Получаем профиль пользователя
                try:
                    profile = UserProfile.objects.get(user=user)
                except UserProfile.DoesNotExist:
                    # Если профиль не существует, создаем его
                    profile = UserProfile.objects.create(
                        user=user,
                        email=user.email
                    )
                
                # Генерируем токен
                token = generate_token(user)
                
                return JsonResponse({
                    'token': token,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'full_name': user.email.split('@')[0],
                        'department': 'Государственное учреждение',
                        'organization': 'Государственное учреждение'
                    },
                    'message': 'Вход выполнен успешно'
                })
            else:
                return JsonResponse({
                    'error': 'Неверный email или пароль'
                }, status=401)
                
        except Exception as e:
            return JsonResponse({
                'error': f'Ошибка при входе: {str(e)}'
            }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def save_quiz_result(request):
    if request.method == 'POST':
        try:
            # Проверяем аутентификацию
            user = get_user_from_token(request)
            if not user:
                return JsonResponse({
                    'error': 'Необходима авторизация'
                }, status=401)
            
            data = json.loads(request.body)
            
            # Проверяем обязательные поля
            required_fields = ['score', 'total_questions', 'percentage']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({
                        'error': f'Отсутствует обязательное поле: {field}'
                    }, status=400)
            
            # Проверяем корректность данных
            if data['score'] < 0 or data['total_questions'] <= 0:
                return JsonResponse({
                    'error': 'Некорректные данные результата теста'
                }, status=400)
            
            if data['percentage'] < 0 or data['percentage'] > 100:
                return JsonResponse({
                    'error': 'Процент выполнения должен быть от 0 до 100'
                }, status=400)
            
            # Сохраняем результат теста
            quiz_result = QuizResult.objects.create(
                user=user,
                score=data['score'],
                total_questions=data['total_questions'],
                percentage=data['percentage']
            )
            
            return JsonResponse({
                'id': str(quiz_result.id),
                'score': quiz_result.score,
                'total_questions': quiz_result.total_questions,
                'percentage': quiz_result.percentage,
                'completed_at': quiz_result.completed_at.isoformat(),
                'message': 'Результат теста успешно сохранен'
            })
            
        except Exception as e:
            return JsonResponse({
                'error': f'Ошибка при сохранении результата теста: {str(e)}'
            }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_user_stats(request):
    if request.method == 'GET':
        try:
            # Проверяем аутентификацию
            user = get_user_from_token(request)
            if not user:
                return JsonResponse({
                    'error': 'Необходима авторизация'
                }, status=401)
            
            # Получаем профиль пользователя
            try:
                profile = UserProfile.objects.get(user=user)
            except UserProfile.DoesNotExist:
                return JsonResponse({
                    'error': 'Профиль пользователя не найден'
                }, status=404)
            
            # Получаем все результаты тестов пользователя
            quiz_results = QuizResult.objects.filter(user=user).order_by('-completed_at')
            
            # Рассчитываем статистику
            total_attempts = quiz_results.count()
            best_score = 0
            last_attempt = None
            
            attempts_history = []
            
            for result in quiz_results:
                # Лучший результат
                if result.percentage > best_score:
                    best_score = result.percentage
                
                # Последняя попытка
                if not last_attempt or result.completed_at > last_attempt:
                    last_attempt = result.completed_at
                
                # История попыток
                attempts_history.append({
                    'score': result.score,
                    'total_questions': result.total_questions,
                    'percentage': result.percentage,
                    'completed_at': result.completed_at.isoformat()
                })
            
            # Формируем ответ
            stats_data = {
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': user.email.split('@')[0],
                    'department': 'Государственное учреждение',
                    'organization': 'Государственное учреждение',
                    'registered_at': user.date_joined.isoformat()
                },
                'stats': {
                    'best_score': round(best_score, 1),
                    'total_attempts': total_attempts,
                    'last_attempt': last_attempt.isoformat() if last_attempt else None,
                    'attempts_history': attempts_history
                }
            }
            
            return JsonResponse(stats_data)
            
        except Exception as e:
            return JsonResponse({
                'error': f'Ошибка при получении статистики: {str(e)}'
            }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_consent_history(request):
    """Получение истории согласий пользователя (для админа или самого пользователя)"""
    if request.method == 'GET':
        try:
            # Проверяем аутентификацию
            user = get_user_from_token(request)
            if not user:
                return JsonResponse({
                    'error': 'Необходима авторизация'
                }, status=401)
            
            # Получаем историю согласий пользователя
            consent_history = PDConsentLog.objects.filter(user=user).order_by('-accepted_at')
            
            history_data = []
            for consent in consent_history:
                history_data.append({
                    'consent_type': consent.consent_type,
                    'accepted': consent.accepted,
                    'accepted_at': consent.accepted_at.isoformat(),
                    'ip_address': consent.ip_address
                })
            
            return JsonResponse({
                'user_id': user.id,
                'email': user.email,
                'consent_history': history_data
            })
            
        except Exception as e:
            return JsonResponse({
                'error': f'Ошибка при получении истории согласий: {str(e)}'
            }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def revoke_consent(request):
    """Отзыв согласия на обработку ПДн"""
    if request.method == 'POST':
        try:
            # Проверяем аутентификацию
            user = get_user_from_token(request)
            if not user:
                return JsonResponse({
                    'error': 'Необходима авторизация'
                }, status=401)
            
            data = json.loads(request.body)
            consent_type = data.get('consent_type', 'pd_consent')
            
            # Логируем отзыв согласия
            PDConsentLog.objects.create(
                user=user,
                consent_type=consent_type,
                accepted=False,
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', '')
            )
            
            # Обновляем профиль пользователя
            profile = UserProfile.objects.get(user=user)
            if consent_type == 'pd_consent':
                profile.pd_consent_accepted = False
            elif consent_type == 'privacy_policy':
                profile.privacy_policy_accepted = False
            
            profile.save()
            
            return JsonResponse({
                'message': f'Согласие на {consent_type} успешно отозвано',
                'consent_type': consent_type,
                'accepted': False,
                'revoked_at': timezone.now().isoformat()
            })
            
        except UserProfile.DoesNotExist:
            return JsonResponse({
                'error': 'Профиль пользователя не найден'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'error': f'Ошибка при отзыве согласия: {str(e)}'
            }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def check_consent_status(request):
    """Проверка статуса согласий пользователя"""
    if request.method == 'GET':
        try:
            # Проверяем аутентификацию
            user = get_user_from_token(request)
            if not user:
                return JsonResponse({
                    'error': 'Необходима авторизация'
                }, status=401)
            
            # Получаем профиль пользователя
            try:
                profile = UserProfile.objects.get(user=user)
            except UserProfile.DoesNotExist:
                return JsonResponse({
                    'error': 'Профиль пользователя не найден'
                }, status=404)
            
            return JsonResponse({
                'user_id': user.id,
                'email': user.email,
                'consents': {
                    'privacy_policy': {
                        'accepted': profile.privacy_policy_accepted,
                        'accepted_at': profile.consent_accepted_at.isoformat() if profile.consent_accepted_at else None
                    },
                    'pd_consent': {
                        'accepted': profile.pd_consent_accepted,
                        'accepted_at': profile.consent_accepted_at.isoformat() if profile.consent_accepted_at else None
                    }
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'error': f'Ошибка при проверке статуса согласий: {str(e)}'
            }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def update_user_profile(request):
    """Обновление профиля пользователя"""
    if request.method == 'POST':
        try:
            # Проверяем аутентификацию
            user = get_user_from_token(request)
            if not user:
                return JsonResponse({
                    'error': 'Необходима авторизация'
                }, status=401)
            
            data = json.loads(request.body)
            
            # Получаем профиль пользователя
            try:
                profile = UserProfile.objects.get(user=user)
            except UserProfile.DoesNotExist:
                return JsonResponse({
                    'error': 'Профиль пользователя не найден'
                }, status=404)
            
            # Обновляем поля профиля
            if 'full_name' in data:
                profile.full_name = data['full_name']
                # Также обновляем first_name и last_name пользователя
                names = data['full_name'].split(' ', 1)
                user.first_name = names[0]
                user.last_name = names[1] if len(names) > 1 else ''
                user.save()
            
            if 'department' in data:
                profile.department = data['department']
            
            if 'organization' in data:
                profile.organization = data['organization']
            
            profile.save()
            
            return JsonResponse({
                'message': 'Профиль успешно обновлен',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': profile.full_name,
                    'department': profile.department,
                    'organization': profile.organization,
                    'privacy_policy_accepted': profile.privacy_policy_accepted,
                    'pd_consent_accepted': profile.pd_consent_accepted
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'error': f'Ошибка при обновлении профиля: {str(e)}'
            }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def change_password(request):
    """Смена пароля пользователя"""
    if request.method == 'POST':
        try:
            # Проверяем аутентификацию
            user = get_user_from_token(request)
            if not user:
                return JsonResponse({
                    'error': 'Необходима авторизация'
                }, status=401)
            
            data = json.loads(request.body)
            
            # Проверяем текущий пароль
            current_password = data.get('current_password')
            new_password = data.get('new_password')
            
            if not current_password or not new_password:
                return JsonResponse({
                    'error': 'Текущий и новый пароль обязательны'
                }, status=400)
            
            # Проверяем текущий пароль
            if not user.check_password(current_password):
                return JsonResponse({
                    'error': 'Неверный текущий пароль'
                }, status=400)
            
            # Устанавливаем новый пароль
            user.set_password(new_password)
            user.save()
            
            # Генерируем новый токен
            token = generate_token(user)
            
            return JsonResponse({
                'message': 'Пароль успешно изменен',
                'token': token  # Возвращаем новый токен
            })
            
        except Exception as e:
            return JsonResponse({
                'error': f'Ошибка при смене пароля: {str(e)}'
            }, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_account(request):
    """Удаление аккаунта пользователя"""
    if request.method == 'DELETE':
        try:
            # Проверяем аутентификацию
            user = get_user_from_token(request)
            if not user:
                return JsonResponse({
                    'error': 'Необходима авторизация'
                }, status=401)
            
            data = json.loads(request.body)
            confirmation = data.get('confirmation')
            
            if confirmation != 'YES_DELETE_MY_ACCOUNT':
                return JsonResponse({
                    'error': 'Неверное подтверждение удаления аккаунта'
                }, status=400)
            
            # Логируем удаление аккаунта (перед фактическим удалением)
            PDConsentLog.objects.create(
                user=user,
                consent_type='account_deletion',
                accepted=False,
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                notes='Пользователь удалил аккаунт'
            )
            
            # Сохраняем email для логирования
            user_email = user.email
            
            # Удаляем пользователя (это каскадно удалит все связанные записи)
            user.delete()
            
            return JsonResponse({
                'message': f'Аккаунт {user_email} успешно удален',
                'deleted_at': timezone.now().isoformat()
            })
            
        except Exception as e:
            return JsonResponse({
                'error': f'Ошибка при удалении аккаунта: {str(e)}'
            }, status=500)