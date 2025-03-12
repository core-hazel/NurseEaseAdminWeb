from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from firebase import db  # Assuming this is your initialized Firestore client


auth = Blueprint('auth', __name__)

def get_admin_data(hospital_id, admin_id):
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


@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    hospital_id = data.get('hospitalId')
    admin_id = data.get('adminId')
    password = data.get('password')

    if not hospital_id or not admin_id or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    admin_data = get_admin_data(hospital_id, admin_id)

    if admin_data is None:
        return jsonify({'error': 'Admin not found'}), 404

    stored_password_hash = admin_data.get('passwordHash')

    if not check_password_hash(stored_password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # If everything is okay, return success message
    return jsonify({'message': 'Login successful', 'role': admin_data.get('role')}), 200

