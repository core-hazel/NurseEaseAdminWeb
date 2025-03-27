from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from google.cloud import firestore  # Import Firestore
from werkzeug.security import check_password_hash, generate_password_hash
from firebase_config import db  # Assuming this is your initialized Firestore client
import random


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


class HospitalRegisterRequest(BaseModel):
    hospitalName: str
    address: str
    specialities: list[str]
    state: str
    contactNumber: str
    email: EmailStr
    noofbeds: int
    city: str

def generate_hospital_id(hospital_name: str):
    """Generate a unique hospital ID"""
    return f"H{random.randint(1000,9999)}{hospital_name[:3].upper()}"

def generate_admin_id(hospital_id: str):
    """Generate a unique admin ID"""
    return f"ad{hospital_id[:3]}{random.randint(100, 999)}"

@router.post("/register")
async def register_hospital(request: HospitalRegisterRequest):
    # Generate a unique Hospital ID
    hospital_id = generate_hospital_id(request.hospitalName)

    # Check if hospital already exists
    hospital_ref = db.collection("hospitals").document(hospital_id)
    if hospital_ref.get().exists:
        raise HTTPException(status_code=400, detail="Hospital already exists")

    # Store hospital details
    hospital_data = {
        "hospitalId": hospital_id,
        "name": request.hospitalName,
        "address": request.address,
        "specialities": request.specialities,
        "state": request.state,
        "contactNumber": request.contactNumber,
        "email": request.email,
        "noofbeds": request.noofbeds,
        "city": request.city,
        "createdAt": firestore.SERVER_TIMESTAMP
    }

    hospital_ref.set(hospital_data)

    # Auto-create an Admin for the Hospital
    admin_id = generate_admin_id(hospital_id)
    raw_password = f"{hospital_id[:3]}{random.randint(1000, 9999)}"
    hashed_password = generate_password_hash(raw_password)

    admin_data = {
        "adminId": admin_id,
        "role": "superadmin",
        "email": request.email,
        "passwordHash": hashed_password,
        "createdAt": firestore.SERVER_TIMESTAMP
    }

    db.collection("hospitals").document(hospital_id).collection("admins").document(admin_id).set(admin_data)

    return {
        "message": "Hospital registered successfully",
        "hospitalId": hospital_id,
        "adminId": admin_id,
        "adminPassword": raw_password  # Send this only for first login
    }
