from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, firestore, messaging
from pulp import LpProblem, LpVariable, lpSum, LpBinary, PULP_CBC_CMD
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI()

# Firebase Initialization
try:
    cred = credentials.Certificate("serviceAccountKey.json")  # Ensure this file exists
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    logging.error(f"Firebase Initialization Failed: {e}")

# Define shifts
shifts = ["Morning", "Evening", "Night"]

# Request model for absent nurses
class AbsentNursesRequest(BaseModel):
    hospital_id: str
    absent_nurses: list[str]

# Function to notify nurses
def notify_nurses(hospital_id, schedule):
    nurses_ref = db.collection("hospitals").document(hospital_id).collection("nurses")
    nurses_docs = nurses_ref.stream()
    tokens = []
    
    for doc in nurses_docs:
        nurse_data = doc.to_dict()
        nurse_id = doc.id
        
        if "fcmToken" in nurse_data and nurse_data["fcmToken"]:
            tokens.append(nurse_data["fcmToken"])
        
        if nurse_data["Name"] in schedule:
            nurse_schedule = schedule[nurse_data["Name"]]
            schedule_ref = db.collection("hospitals").document(hospital_id)\
                               .collection("nurses").document(nurse_id)\
                               .collection("schedules").document("latest")
            schedule_ref.set(nurse_schedule)
    
    if tokens:
        message = messaging.MulticastMessage(
            notification=messaging.Notification(
                title="Schedule Update",
                body="Your new schedule is available."
            ),
            tokens=tokens
        )
        messaging.send_multicast(message)
        logging.info(f"Notifications sent to {len(tokens)} nurses")
    else:
        logging.warning("No nurses found with FCM tokens.")

# Endpoint to generate the nurse schedule
@app.post("/generate_schedule/")
def generate_schedule(request: AbsentNursesRequest):
    hospital_id = request.hospital_id
    nurses_ref = db.collection("hospitals").document(hospital_id).collection("nurses")
    nurses_docs = nurses_ref.stream()
    
    available_nurses = []
    for doc in nurses_docs:
        nurse = doc.to_dict()
        if nurse["Name"] not in request.absent_nurses:
            available_nurses.append(nurse)
    
    if not available_nurses:
        raise HTTPException(status_code=400, detail="No nurses available")
    
    nurses_names = [n["Name"] for n in available_nurses]
    prob = LpProblem("NurseScheduling")
    x = {(n, s): LpVariable(f"{n}_{s}", 0, 1, LpBinary) for n in nurses_names for s in shifts}
    
    for n in nurses_names:
        prob += lpSum(x[n, s] for s in shifts) <= 1
    for s in shifts:
        prob += lpSum(x[n, s] for n in nurses_names) >= 1
    for n in available_nurses:
        if "Preferred Shift" in n:
            prob += x[n["Name"], n["Preferred Shift"]] >= 0.5
    
    prob.solve(PULP_CBC_CMD(msg=False))
    
    schedule = {n: [] for n in nurses_names}
    for s in shifts:
        for n in nurses_names:
            if x[n, s].value() == 1:
                dept = next(nr["Certification"] for nr in available_nurses if nr["Name"] == n)
                schedule[n].append({"shift": s, "dept": dept})
    
    db.collection("hospitals").document(hospital_id).collection("schedules").document("overall_schedule").set(schedule)
    
    notify_nurses(hospital_id, schedule)
    return {"message": "Schedule generated successfully", "schedule": schedule}
