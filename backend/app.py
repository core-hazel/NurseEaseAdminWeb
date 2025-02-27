from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_db
from scheduler import generate_schedule

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

@app.route('/')
def home():
    return jsonify({"message": "NurseEase Admin API Running"}), 200

@app.route('/nurses', methods=['GET', 'POST'])
def nurses():
    db = get_db()
    if request.method == 'GET':
        nurses = db.get_all_nurses()
        return jsonify(nurses), 200
    elif request.method == 'POST':
        data = request.json
        db.add_nurse(data)
        return jsonify({"message": "Nurse added successfully"}), 201

@app.route('/schedule/generate', methods=['POST'])
def schedule_generate():
    success, schedule = generate_schedule()
    if success:
        return jsonify({"message": "Schedule generated successfully", "schedule": schedule}), 200
    return jsonify({"message": "Schedule generation failed"}), 500

if __name__ == '__main__':
    app.run(debug=True)

