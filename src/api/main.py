from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

MONGODB_URI = "mongodb://admin:password123@mongodb:27017/periodic-table?authSource=admin"

def get_db():
    client = MongoClient(MONGODB_URI)
    return client.periodic_table

@app.route('/api/elements', methods=['POST'])
def create_element():
    try:
        data = request.get_json()
        logger.info(f"Received data: {data}")
        
        if not data.get('name'):
            return jsonify({"error": "Name is required"}), 400

        db = get_db()
        
        # Get next number
        last = db.elements.find_one(sort=[("number", -1)])
        next_number = (last["number"] + 1) if last else 119
        
        element = {
            "name": data["name"],
            "symbol": data["name"][:2].upper(),
            "mass": "???",
            "number": next_number,
            "createdAt": datetime.now(),
            "expiresAt": data.get("expiresAt"),
            "isPermanent": data.get("isPermanent", False)
        }
        
        logger.info(f"Saving element: {element}")
        result = db.elements.insert_one(element)
        saved = db.elements.find_one({"_id": result.inserted_id}, {"_id": 0})
        logger.info(f"Saved element: {saved}")
        
        return jsonify(saved)
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/elements', methods=['GET'])
def get_elements():
    try:
        db = get_db()
        elements = list(db.elements.find({}, {"_id": 0}))
        return jsonify(elements)
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/health')
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4567)