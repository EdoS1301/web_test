from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def hello_world(request):
    if request.method == 'GET':
        return JsonResponse({'message': 'Hello from Django!', 'status': 'success'})
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name', 'World')
            return JsonResponse({'message': f'Hello {name} from Django!', 'status': 'success'})
        except:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)