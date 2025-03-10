import firebase_admin
from firebase_admin import credentials, firestore
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)

def initialize_firebase():
    """
    Initializes the Firebase Admin SDK and returns the Firestore client.
    """
    try:
        # Get absolute path of serviceAccountKey.json
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        KEY_PATH = os.path.join(BASE_DIR, "serviceAccountKey.json")

        # Load the Firebase Admin SDK key
        cred = credentials.Certificate(KEY_PATH)
        firebase_admin.initialize_app(cred)
        logging.info("Firebase initialized successfully.")
    except Exception as e:
        logging.error(f"Failed to initialize Firebase: {e}")
        raise

# Initialize Firebase
initialize_firebase()

# Firestore DB reference
db = firestore.client()

def get_firestore():
    return db
