from fastapi import FastAPI, HTTPException
from firebase import get_firestore  # Import Firestore setup

app = FastAPI()
db = get_firestore()  # Initialize Firestore

@app.get("/")
async def root():
    return {"message": "NurseEase Admin API is running!"}

# Example route for fetching all nurses
@app.get("/nurses")
async def get_nurses():
    nurses_ref = db.collection("nurses")
    nurses = [doc.to_dict() for doc in nurses_ref.stream()]
    return {"nurses": nurses}

# Example route for adding a nurse
@app.post("/nurses")
async def add_nurse(nurse: dict):
    try:
        doc_ref = db.collection("nurses").add(nurse)
        return {"message": "Nurse added successfully", "id": doc_ref[1].id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

