import requests
from django.http import JsonResponse
from PIL import Image
import io
import os
import json
from stone import process  
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from json import dumps
import numpy as np
import tempfile

def convert_ndarray(data):
    if isinstance(data, np.ndarray):
        return data.tolist()
    elif isinstance(data, dict):
        return {k: convert_ndarray(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_ndarray(v) for v in data]
    return data

@csrf_exempt
def process_image_view(request):
    if request.method == 'POST':
        # Get the URL of the online image from the request
        data = json.loads(request.body.decode('utf-8'))

        image_url = data.get('image_url')
        print(image_url)

        if image_url:
            # Download the image
            response = requests.get(image_url)
            
            if response.status_code == 200:
                # Save the downloaded image to a temporary file
                with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                    temp_file.write(response.content)
                    temp_file_path = temp_file.name

                # Open the image from the temporary file
                image = Image.open(temp_file_path)

                # Process the image
                result = process(temp_file_path, return_report_image=True)

                # Convert the result to JSON
                result_json = convert_ndarray(result)
                

                # Remove the temporary file
                 # Close the image
                image.close()

                # Remove the temporary file
                os.remove(temp_file_path)


                return JsonResponse(result_json, safe=False)
            else:
                return JsonResponse({'error': 'Failed to download the image'}, status=response.status_code)
        else:
            return JsonResponse({'error': 'Missing image URL in the request'}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)