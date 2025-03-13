import firebase_admin
from firebase_admin import credentials, firestore

# Load Firebase credentials from a service account JSON file
cred = credentials.Certificate(r"/run/media/adithya/Studies and Related/NurseEaseAdminWeb/backend/serviceAccountKey.json")  # Replace with your actual file path
firebase_admin.initialize_app(cred)

def get_firestore():
    """Returns Firestore database client."""
    return firestore.client()

