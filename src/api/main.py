from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient, ASCENDING
import os

app = Flask(__name__)
CORS(app)

# Получаем URI из переменной окружения
mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://mongodb:27017/periodic-table')

# Подключаемся к MongoDB
try:
    client = MongoClient(mongodb_uri)
    db = client.get_database('periodic-table')
    # Создаем уникальный индекс
    db.elements.create_index([("name", ASCENDING)], unique=True)
    print("Successfully connected to MongoDB")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

# Добавляем GET endpoint для получения элементов
@app.route('/mongoose-app/api/elements', methods=['GET'])
def get_elements():
    try:
        elements = list(db.elements.find({}, {'_id': 0}))
        return jsonify(elements)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/mongoose-app/api/elements', methods=['POST'])
def create_element():
    try:
        data = request.json
        result = db.elements.insert_one(data)
        return jsonify({"id": str(result.inserted_id)}), 201
    except Exception as e:
        if "duplicate key error" in str(e):
            return jsonify({
                "error": "Такой элемент уже существует в таблице!",
                "code": "DUPLICATE_ELEMENT",
                "field": "name"
            }), 400
        return jsonify({
            "error": "Ошибка сервера при добавлении элемента", 
            "code": "UNKNOWN_ERROR"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4567)