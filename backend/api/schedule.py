from fastapi import FastAPI
from pydantic import BaseModel
import random
import numpy as np
from pulp import LpProblem, LpVariable, lpSum, LpBinary, PULP_CBC_CMD
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import IsolationForest
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI App
app = FastAPI()

# Enable CORS (For Frontend Communication)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model for Absence Request
class AbsentNursesRequest(BaseModel):
    absent_nurses: list[str]

# Nurse Data
nurses = [
    {'name': 'Alice', 'dept': 'ICU', 'experience': 5, 'certifications': ['ICU', 'CPR'], 'preference': 'Morning'},
    {'name': 'Bob', 'dept': 'General', 'experience': 10, 'certifications': ['CPR'], 'preference': 'Evening'},
    {'name': 'Charlie', 'dept': 'Emergency', 'experience': 3, 'certifications': ['Emergency', 'CPR'], 'preference': 'Night'},
    {'name': 'Diana', 'dept': 'ICU', 'experience': 7, 'certifications': ['ICU', 'CPR', 'Trauma'], 'preference': 'Morning'},
    {'name': 'Eve', 'dept': 'ICU', 'experience': 2, 'certifications': ['ICU'], 'preference': 'Evening'}
]

# Shift Timings
shifts = ['Morning', 'Evening', 'Night']

# Patient Data (Newly Added)
patients = [
    {'name': 'John Doe', 'dept': 'ICU'},
    {'name': 'Jane Smith', 'dept': 'General'},
    {'name': 'Sam Wilson', 'dept': 'Emergency'}
]

# 🏥 **1️⃣ Generate Nurse Schedule (Ensures No Duplicate Departments in a Shift)**
@app.post("/generate_schedule/")
def generate_schedule(request: AbsentNursesRequest):
    available_nurses = [n for n in nurses if n['name'] not in request.absent_nurses]
    if not available_nurses:
        return {"error": "No nurses available"}

    nurses_names = [n['name'] for n in available_nurses]
    
    # Optimization Model
    prob = LpProblem("NurseScheduling")
    x = {(n, s): LpVariable(f"{n}_{s}", 0, 1, LpBinary) for n in nurses_names for s in shifts}
    
    # Constraints
    for n in nurses_names:
        prob += lpSum(x[n, s] for s in shifts) <= 1  # Each nurse can have only one shift

    for s in shifts:
        prob += lpSum(x[n, s] for n in nurses_names) >= 1  # At least one nurse per shift

    for n in available_nurses:
        prob += x[n['name'], n['preference']] >= 0.5  # Try to match nurse preferences

    prob.solve(PULP_CBC_CMD(msg=False))

    # Organize the schedule without repeating departments in the same shift
    schedule = {s: [] for s in shifts}
    assigned_departments = {s: set() for s in shifts}  # Keep track of assigned departments per shift

    for s in shifts:
        for n in nurses_names:
            if x[n, s].value() == 1:
                dept = next(nr['dept'] for nr in nurses if nr['name'] == n)
                if dept not in assigned_departments[s]:  # Ensure no duplicate departments
                    schedule[s].append({"name": n, "dept": dept})
                    assigned_departments[s].add(dept)

    return {"schedule": schedule}

# 🏥 **2️⃣ Assign Patients to Nurses**
@app.get("/assign_patients/")
def assign_patients():
    assignments = {}

    for patient in patients:
        assigned_nurse = next(
            (n['name'] for n in nurses if n['dept'] == patient['dept']), 
            "No nurse available"
        )
        assignments[patient['name']] = assigned_nurse

    return {"patient_assignments": assignments}

# 🏥 **3️⃣ Predict Shift Based on Experience**
@app.get("/predict_shift/")
def predict_shift(experience: int):
    X = np.array([[n['experience']] for n in nurses])
    y = [n['preference'] for n in nurses]
    
    tree = DecisionTreeClassifier()
    tree.fit(X, y)
    
    predicted_shift = tree.predict([[experience]])[0]
    return {"predicted_shift": predicted_shift}

# 🏥 **4️⃣ Detect Overworked Nurses Using AI**
@app.get("/overworked_nurses/")
def detect_overworked():
    hours_worked = np.array([[random.randint(35, 70)] for _ in nurses])
    iso_forest = IsolationForest(contamination=0.2).fit(hours_worked)
    overworked = [nurses[i]['name'] for i, pred in enumerate(iso_forest.predict(hours_worked)) if pred == -1]
    return {"overworked_nurses": overworked}

# 🏥 **5️⃣ Find Best Replacement for Absent Nurse**
@app.get("/replace_nurse/")
def find_best_replacement(canceled_nurse: str):
    canceled_data = next((n for n in nurses if n['name'] == canceled_nurse), None)
    if not canceled_data:
        return {"error": "Nurse not found"}

    dept, certs = canceled_data['dept'], set(canceled_data['certifications'])
    eligible = [n for n in nurses if n['name'] != canceled_nurse and n['dept'] == dept]
    eligible = [n for n in eligible if certs.issubset(n['certifications'])]

    if not eligible:
        return {"replacement": "No fully certified replacement found"}

    best_replacement = max(eligible, key=lambda n: n['experience'])['name']
    return {"replacement": best_replacement}
