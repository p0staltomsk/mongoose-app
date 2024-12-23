from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

# Ждем пока MongoDB поднимется
for _ in range(30):  # 30 секунд максимум
    try:
        client = MongoClient(
            'mongodb://mongodb:27017/periodic-table',
            maxPoolSize=1,
            directConnection=True,
            serverSelectionTimeoutMS=5000
        )
        # Проверяем соединение
        client.admin.command('ping')
        break
    except Exception:
        time.sleep(1)
else:
    raise Exception("MongoDB не поднялась за 30 секунд")

db = client.get_database('periodic-table')
db.elements.create_index("name", unique=True)

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
        db.elements.insert_one(data)
        return jsonify({"status": "ok"}), 201
    except Exception as e:
        if "duplicate key error" in str(e):
            return jsonify({"error": "Такой элемент уже существует!"}), 400
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4567)