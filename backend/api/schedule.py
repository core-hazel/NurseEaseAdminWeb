from fastapi import APIRouter, HTTPException
from google.cloud import firestore
from datetime import datetime, timedelta

router = APIRouter()

# Initialize Firestore Client
db = firestore.Client()

# Auto-generate schedule for nurses
@router.post("/generate-schedule")
async def generate_schedule():
    try:
        nurses_ref = db.collection("nurses").stream()
        schedules = []
        start_time = datetime.now().replace(hour=8, minute=0, second=0, microsecond=0)  # Start at 8 AM

        for nurse in nurses_ref:
            nurse_data = nurse.to_dict()
            schedule_entry = {
                "nurse_id": nurse.id,
                "name": nurse_data.get("name"),
                "shift_start": start_time.strftime("%Y-%m-%d %H:%M:%S"),
                "shift_end": (start_time + timedelta(hours=8)).strftime("%Y-%m-%d %H:%M:%S")
            }
            db.collection("schedules").add(schedule_entry)
            schedules.append(schedule_entry)
            start_time += timedelta(hours=1)  # Assign next nurse after 1 hour

        return {"message": "Schedule generated successfully", "schedules": schedules}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get schedule for all nurses
@router.get("/schedules")
async def get_schedules():
    try:
        schedules_ref = db.collection("schedules").stream()
        schedules = [doc.to_dict() for doc in schedules_ref]
        return {"schedules": schedules}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Delete all schedules (Reset)
@router.delete("/reset-schedule")
async def reset_schedule():
    try:
        schedules_ref = db.collection("schedules").stream()
        for doc in schedules_ref:
            db.collection("schedules").document(doc.id).delete()

        return {"message": "All schedules deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
