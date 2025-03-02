import random
from firebase import get_firestore

db = get_firestore()

def generate_schedule():
    nurses_ref = db.collection("nurses").stream()
    nurses = [doc.id for doc in nurses_ref]

    schedule = []
    shifts = ["Morning", "Evening", "Night"]

    for nurse in nurses:
        shift = random.choice(shifts)
        schedule.append({"nurse_id": nurse, "shift": shift})

    return {"schedule": schedule}

