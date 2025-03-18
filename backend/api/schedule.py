from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
from pulp import LpProblem, LpVariable, lpSum, LpBinary, PULP_CBC_CMD
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Firebase Initialization
try:
    cred = credentials.Certificate("serviceAccountKey.json")  # Ensure this file exists
    firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    logging.error(f"Firebase Initialization Failed: {e}")

# Load nurse data from an Excel file
try:
    nurse_df = pd.read_excel("nurse_data.xlsx")  # Ensure this file exists
    nurses = nurse_df.to_dict(orient="records")
except Exception as e:
    logging.error(f"Failed to load nurse data: {e}")
    nurses = []

# Define shifts
shifts = ["Morning", "Evening", "Night"]

# Request model for absent nurses
class AbsentNursesRequest(BaseModel):
    absent_nurses: list[str]

# Endpoint to get the list of nurses
@app.get("/nurses/")
def get_nurses():
    if not nurses:
        raise HTTPException(status_code=404, detail="No nurses found")
    return nurses

# Endpoint to generate the nurse schedule
@app.post("/generate_schedule/")
def generate_schedule(request: AbsentNursesRequest):
    available_nurses = [n for n in nurses if n["Name"] not in request.absent_nurses]
    
    if not available_nurses:
        return {"error": "No nurses available"}

    nurses_names = [n["Name"] for n in available_nurses]
    
    # Define the Linear Programming Problem
    prob = LpProblem("NurseScheduling")
    x = {(n, s): LpVariable(f"{n}_{s}", 0, 1, LpBinary) for n in nurses_names for s in shifts}

    # Constraints
    for n in nurses_names:
        prob += lpSum(x[n, s] for s in shifts) <= 1  # Each nurse gets at most one shift

    for s in shifts:
        prob += lpSum(x[n, s] for n in nurses_names) >= 1  # Each shift has at least one nurse

    for n in available_nurses:
        if "Preferred Shift" in n:
            prob += x[n["Name"], n["Preferred Shift"]] >= 0.5  # Favor preferred shift

    # Solve the problem
    prob.solve(PULP_CBC_CMD(msg=False))

    # Prepare the schedule
    schedule = {s: [] for s in shifts}
    for s in shifts:
        for n in nurses_names:
            if x[n, s].value() == 1:
                dept = next(nr["Certification"] for nr in nurses if nr["Name"] == n)
                schedule[s].append({"name": n, "dept": dept})

    logging.info(f"Generated Schedule: {schedule}")

    # Store schedule in Firestore
    try:
        db.collection("nurse_schedules").document("latest_schedule").set(schedule)
    except Exception as e:
        logging.error(f"Firebase Error: {e}")
        return {"error": f"Failed to upload schedule: {str(e)}"}

    return {"schedule": schedule}
