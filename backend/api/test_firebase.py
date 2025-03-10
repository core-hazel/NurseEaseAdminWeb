from firebase import get_firestore

db = get_firestore()

# Test Firestore connection
doc_ref = db.collection("test").document("sample_doc")
doc_ref.set({"message": "Firebase setup successful!"})

print("✅ Firebase is working!")
