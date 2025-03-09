from fastapi import APIRouter, HTTPException
from firebase import get_firestore  # Import Firestore setup

router = APIRouter()
db = get_firestore()  # Initialize Firestore

@router.get("/")
async def root():
    return {"message": "NurseEase Admin API is running!"}

# Example route for fetching all nurses
@router.get("/nurses")
async def get_nurses():
    nurses_ref = db.collection("nurses")
    nurses = [doc.to_dict() for doc in nurses_ref.stream()]
    return {"nurses": nurses}

# Example route for adding a nurse
@router.post("/nurses")
async def add_nurse(nurse: dict):
    try:
        # Validate nurse data here if needed
        doc_ref = db.collection("nurses").add(nurse)
        return {"message": "Nurse added successfully", "id": doc_ref.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add nurse: {str(e)}")
