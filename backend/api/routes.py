from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from firebase import get_firestore  # Import Firestore setup

router = APIRouter()
db = get_firestore()  # Initialize Firestore

class nurse(BaseModel):
    nurseId : str
    name: str
    email: str
    phone: str
    role: str
    specialty: str
    password: str
    hospitalId: str

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
@router.post("/enrollnurse")
async def add_nurse(request : nurse):
    try:
        # Validate nurse data here if needed
        doc_ref = db.collection("hospitals").document(request.hospitalId) .collection("nurses").add(nurse)
        return {"message": "Nurse added successfully", "id": doc_ref.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add nurse: {str(e)}")


# Route for fetching all hospitals
@router.get("/hospitals")
async def get_hospitals():
    try:
        hospitals_ref = db.collection("hospitals").order_by("name")
        hospitals = [{"name": doc.get("name"), "id": doc.id} for doc in hospitals_ref.stream()]
        return {"hospitals": hospitals}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch hospitals: {str(e)}")

