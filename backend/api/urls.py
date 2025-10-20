from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.generic import TemplateView
from django.urls import re_path

def home_view(request):
    return JsonResponse({'message': 'Django API is working!', 'status': 'success'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', home_view),
    
    # Catch-all для React Router - должен быть последним
    re_path(r'^(?!api/|admin/|static/|media/).*', TemplateView.as_view(template_name='index.html')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)