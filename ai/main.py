from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
from PIL import Image
import os
import time

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

class MockModel:
    def predict(self, image_array):
        predictions = np.random.rand(1, 4)
        predictions = predictions / predictions.sum()
        return predictions

try:
    from tensorflow.keras.models import load_model
    model = load_model('model.h5')
    print("✅ Model loaded successfully")
except:
    model = MockModel()
    print("⚠️ Using mock model")

class_labels = ['pituitary', 'glioma', 'notumor', 'meningioma']

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "ok",
        "message": "NeuroScan AI Flask server is running",
        "model_loaded": not isinstance(model, MockModel),
        "timestamp": int(time.time())
    })

@app.route('/api/predict', methods=['POST'])
def predict_api():
    try:
        if 'file' not in request.files:
            return jsonify({"status": "error", "message": "No file uploaded"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"status": "error", "message": "No file selected"}), 400
        
        # Save file
        filename = f"scan_{int(time.time())}_{file.filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Process image
        img = Image.open(file_path)
        img = img.convert('RGB')
        img = img.resize((128, 128))
        
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Get prediction
        predictions = model.predict(img_array)
        predicted_class_index = int(np.argmax(predictions, axis=1)[0])
        confidence_score = float(np.max(predictions, axis=1)[0])
        
        tumor_type = class_labels[predicted_class_index]
        has_tumor = tumor_type != 'notumor'
        
        response_data = {
            "status": "success",
            "diagnosis": "No Tumor" if not has_tumor else tumor_type.capitalize() + " Tumor",
            "tumor_type": tumor_type,
            "has_tumor": has_tumor,
            "confidence": confidence_score,
            "confidence_percentage": f"{confidence_score * 100:.2f}%",
            "image_url": f"http://127.0.0.1:5000/uploads/{filename}",
            "file_path": f"/uploads/{filename}",
            "timestamp": int(time.time()),
            "class_index": predicted_class_index,
            "probabilities": {
                "pituitary": float(predictions[0][0]),
                "glioma": float(predictions[0][1]),
                "notumor": float(predictions[0][2]),
                "meningioma": float(predictions[0][3])
            }
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        return jsonify({"status": "error", "message": f"Prediction failed: {str(e)}"}), 500

@app.route('/uploads/<filename>')
def get_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    print("🚀 Starting NeuroScan AI Flask Server on http://127.0.0.1:5000")
    app.run(debug=True, host='127.0.0.1', port=5000)