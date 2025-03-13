from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from werkzeug.security import check_password_hash
from firebase_config import db  # Assuming this is your initialized Firestore client

router = APIRouter()

class LoginRequest(BaseModel):
    hospitalId: str
    adminId: str
    password: str

def get_admin_data(hospital_id: str, admin_id: str):
    try:
        doc_ref = db.collection('hospitals').document(hospital_id).collection('admins').document(admin_id)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            return None
    except Exception as e:
        print(f"Error fetching admin data: {e}")
        return None

@router.post("/login")
async def login(request: LoginRequest):
    admin_data = get_admin_data(request.hospitalId, request.adminId)

    if admin_data is None:
        raise HTTPException(status_code=404, detail="Admin not found")

    stored_password_hash = admin_data.get('passwordHash')

    if not check_password_hash(stored_password_hash, request.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # If everything is okay, return success message
    return {"message": "Login successful", "role": admin_data.get('role')}

