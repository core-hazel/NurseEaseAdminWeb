from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
import logging
from firebase_config import db  
import traceback

router = APIRouter()

class nurse(BaseModel):
    nurseId : str
    name: str
    email: str
    phone: str
    role: str
    speciality: list[str]
    password: str
    hospitalId: str

@router.get("/")
async def root():
    return {"message": "NurseEase Admin API is running!"}

# Example route for fetching all nurses
@router.get("/nurses")
async def get_nurses(hospitalId: str = Query(..., description="The ID of the hospital")):
    """
    Fetch all nurses for a given hospital.
    """
    try:
        # Reference to the nurses collection for the given hospital
        nurses_ref = db.collection("hospitals").document(hospitalId).collection("nurses")
        nurses = [doc.to_dict() for doc in nurses_ref.stream()]
        return {"nurses": nurses}
    except Exception as e:
        logging.error(f"Error fetching nurses: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch nurses: {str(e)}")

# Example route for adding a nurse
@router.post("/enroll_nurse")
async def add_nurse(request : nurse):
    try:
        nurse_data = request.dict()
        doc_ref = db.collection("hospitals").document(request.hospitalId).collection("nurses")
        doc = doc_ref.document(request.nurseId).get()
        if doc.exists:
            raise HTTPException(status_code=400, detail="Nurse ID already exists")
        
        doc_ref.document(request.nurseId).set(nurse_data)
        return {"message": "Nurse added successfully", "id": request.nurseId}
    except Exception as e:
        logging.error(f"Error adding nurse: {traceback.format_exc()}")
        logging.error(f"Error adding nurse: {str(e)}")
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

