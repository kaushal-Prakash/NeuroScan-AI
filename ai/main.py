from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
from PIL import Image
import os
import time
import pymongo
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# MongoDB connection
MONGODB_URI = "mongodb://localhost:27017"  # Update with your MongoDB URI
DB_NAME = "neuroscan_db"  # Your database name

# Initialize MongoDB variables
results_collection = None
users_collection = None

try:
    client = pymongo.MongoClient(MONGODB_URI)
    db = client[DB_NAME]
    results_collection = db["results"]
    users_collection = db["users"]
    print("✅ Connected to MongoDB")
except Exception as e:
    print(f"⚠️ MongoDB connection failed: {e}")
    results_collection = None
    users_collection = None

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
except Exception as e:
    print(f"⚠️ Could not load model.h5: {e}")
    print("⚠️ Using mock model for testing")
    model = MockModel()

class_labels = ['pituitary', 'glioma', 'notumor', 'meningioma']

def save_result_to_mongodb(user_id, result_data):
    """Save scan result to MongoDB"""
    try:
        if results_collection is None:
            print("⚠️ MongoDB not connected, skipping save")
            return None
            
        result_doc = {
            "userId": user_id,
            "case": result_data["tumor_type"],
            "confidence": result_data["confidence"],
            "date": datetime.utcnow(),
            "imageUrl": result_data["image_url"],
            "tumorType": result_data["diagnosis"],
            "probabilities": result_data["probabilities"],
            "hasTumor": result_data["has_tumor"],
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        
        # Insert into MongoDB
        inserted = results_collection.insert_one(result_doc)
        print(f"✅ Result saved to MongoDB with ID: {inserted.inserted_id}")
        return inserted.inserted_id
        
    except Exception as e:
        print(f"❌ Error saving to MongoDB: {e}")
        return None

# Add this function to fetch results from MongoDB
def get_user_results(user_id):
    """Get all results for a specific user from MongoDB"""
    try:
        if results_collection is None:
            print("⚠️ MongoDB not connected")
            return []
        
        # Query results for the user
        user_results = list(results_collection.find(
            {"userId": user_id},
            {"_id": 1, "case": 1, "confidence": 1, "date": 1, "imageUrl": 1, 
             "tumorType": 1, "probabilities": 1, "hasTumor": 1, "createdAt": 1}
        ).sort("date", -1))
        
        # Convert ObjectId to string for JSON serialization
        for result in user_results:
            result["_id"] = str(result["_id"])
            result["id"] = str(result["_id"])  # Add id field for compatibility
        
        print(f"✅ Found {len(user_results)} results for user {user_id}")
        return user_results
    except Exception as e:
        print(f"❌ Error fetching user results: {e}")
        return []

# Add this endpoint to Flask
@app.route('/api/user/results', methods=['GET'])
def get_user_results_api():
    try:
        # Get user ID from headers
        user_id = request.headers.get('X-User-Id') or "demo_user"
        
        # Get results from MongoDB
        results = get_user_results(user_id)
        
        return jsonify({
            "status": "success",
            "results": results,
            "count": len(results)
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": f"Failed to fetch results: {str(e)}"}), 500
    
    
@app.route('/api/health', methods=['GET'])
def health_check():
    mongo_status = "connected" if results_collection is not None else "disconnected"
    return jsonify({
        "status": "ok",
        "message": "NeuroScan AI Flask server is running",
        "model_loaded": not isinstance(model, MockModel),
        "mongodb": mongo_status,
        "timestamp": int(time.time())
    })

@app.route('/api/predict', methods=['POST'])
def predict_api():
    try:
        print("=" * 50)
        print("Received prediction request...")
        
        if 'file' not in request.files:
            return jsonify({"status": "error", "message": "No file uploaded"}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({"status": "error", "message": "No file selected"}), 400
        
        # Get user ID from request
        user_id = request.headers.get('X-User-Id') or "demo_user"
        print(f"User ID: {user_id}")
        
        # Save file
        filename = f"scan_{int(time.time())}_{file.filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        print(f"File saved: {filename}")
        
        # Process image
        img = Image.open(file_path)
        img = img.convert('RGB')
        img = img.resize((128, 128))
        
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Get prediction
        print("Running AI model prediction...")
        predictions = model.predict(img_array)
        predicted_class_index = int(np.argmax(predictions, axis=1)[0])
        confidence_score = float(np.max(predictions, axis=1)[0])
        
        tumor_type = class_labels[predicted_class_index]
        has_tumor = tumor_type != 'notumor'
        
        print(f"Prediction: {tumor_type} with {confidence_score:.2f} confidence")
        
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
            },
            "userId": user_id
        }
        
        # Save result to MongoDB
        mongo_id = save_result_to_mongodb(user_id, response_data)
        if mongo_id:
            response_data["mongo_id"] = str(mongo_id)
            print(f"✅ MongoDB document ID: {mongo_id}")
        else:
            print("⚠️ Result not saved to MongoDB")
        
        print("=" * 50)
        return jsonify(response_data)
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": f"Prediction failed: {str(e)}"}), 500

@app.route('/uploads/<filename>')
def get_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    print("🚀 Starting NeuroScan AI Flask Server on http://127.0.0.1:5000")
    print("📊 MongoDB integration:", "Enabled" if results_collection is not None else "Disabled")
    app.run(debug=True, host='127.0.0.1', port=5000)