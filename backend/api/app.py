from flask import Flask, request, jsonify
from firebase import get_firestore
from scheduler import generate_schedule

app = Flask(__name__)
db = get_firestore()

@app.route("/nurses", methods=["GET"])
def get_nurses():
    nurses_ref = db.collection("nurses")
    docs = nurses_ref.stream()
    nurses = [{doc.id: doc.to_dict()} for doc in docs]
    return jsonify(nurses)

@app.route("/nurses", methods=["POST"])
def add_nurse():
    data = request.json
    db.collection("nurses").add(data)
    return jsonify({"message": "Nurse added successfully"}), 201

@app.route("/schedule", methods=["POST"])
def create_schedule():
    schedule = generate_schedule()
    db.collection("schedules").add(schedule)
    return jsonify({"message": "Schedule generated"}), 201

if __name__ == "__main__":
    app.run(debug=True)

