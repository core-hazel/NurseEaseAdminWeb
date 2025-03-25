from firebase import get_firestore
from werkzeug.security import check_password_hash

db = get_firestore()

def get_admin_details(hospital_id, username):
    try:
        # Reference to the "admins" collection within the specific hospital
        admin_ref = db.collection('hospitals').document(hospital_id).collection('admins').document(username)
        admin_doc = admin_ref.get()
        
        if admin_doc.exists:
            return admin_doc.to_dict()
        else:
            return None
    except Exception as e:
        print(f"Error fetching admin details: {e}")
        return None


def authenticate_admin(hospital_id, username, raw_password):
    admin_data = get_admin_details(hospital_id, username)
    
    if admin_data:
        stored_password_hash = admin_data.get('passwordHash')
        if check_password_hash(stored_password_hash, raw_password):  # Compare hash with raw password
            return True
    return False
# 

def upload_data_to_firestore(data, collection_name="nurse_data"):
    """
    Uploads a list of dictionaries to a specified Firestore collection.
    
    :param data: List of dictionaries containing the data to upload
    :param collection_name: Firestore collection where data will be stored
    """
    try:
        collection_ref = firebase_db.collection(collection_name)

        for record in data:
            # Add data to Firestore with an auto-generated document ID
            collection_ref.add(record)

        print(f"Successfully uploaded {len(data)} records to Firestore collection: {collection_name}")
        return {"message": "Data uploaded successfully."}

    except Exception as e:
        print(f"Error uploading data to Firestore: {str(e)}")
        return {"error": str(e)}

