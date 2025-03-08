from fastapi import APIRouter, HTTPException, Depends, Header
import firebase_admin
from firebase_admin import auth, credentials

# Initialize Firebase Admin SDK (Prevent re-initialization)
if not firebase_admin._apps:
    cred = credentials.Certificate("path/to/your/firebase-adminsdk.json")
    firebase_admin.initialize_app(cred)

router = APIRouter()

# Signup Route
@router.post("/signup")
async def signup(email: str, password: str):
    try:
        user = auth.create_user(email=email, password=password)
        return {"message": "User created successfully", "uid": user.uid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Login Route (Firebase Authentication uses ID Tokens)
@router.post("/login")
async def login(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return {"message": "Login successful", "uid": decoded_token["uid"]}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# Middleware to verify token
async def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    try:
        token = authorization.split("Bearer ")[1]
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

# Example Protected Route
@router.get("/protected")
async def protected_route(user_data: dict = Depends(get_current_user)):
    return {"message": "You have access!", "user": user_data}
