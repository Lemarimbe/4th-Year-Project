from django.http import JsonResponse
from PIL import Image
import io
from stone import process, show  # Replace with actual import
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from json import dumps
import numpy as np



def convert_ndarray(data):
    if isinstance(data, np.ndarray):
        return data.tolist()
    elif isinstance(data, dict):
        return {k: convert_ndarray(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [convert_ndarray(v) for v in data]
    return data

@method_decorator(csrf_exempt, name='dispatch')
def process_image(request):
    if request.method == 'POST':
        image_file = request.FILES['image']  # Get the uploaded image file
        image = Image.open(image_file)

        # Assuming the skin tone classifier works with file paths
        image_path = "/media/void/2E124C3B124C0A73/Users/Caleb/Desktop/Projects/Lydia_Project/image.jpg"  # Replace with actual path
        image.save(image_path)

        image_type = "jpg"

        

        # Process the image
        result = process(image_path, image_type, return_report_image=True)

        # # Handle the report image
        # report_images = result.pop("report_images")
        # face_id = 1
        # show(report_images[face_id])

        # Convert the result to JSON
       
        
        result_json = convert_ndarray(result)
        print(result_json)
        return JsonResponse(result_json, safe=False)

    return JsonResponse({'error': 'Invalid request'}, status=400)
