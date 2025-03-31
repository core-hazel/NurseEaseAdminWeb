from fastapi import APIRouter, UploadFile, File,Form, HTTPException
import pandas as pd
from firebase_config import db


router = APIRouter()
#db = get_firestore()

@router.post("/upload-file")
async def upload_file(
    file: UploadFile = File(...),
    hospital_id: str = Form(...)
):
    if not file.filename.endswith(('.xlsx', '.csv')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an Excel or CSV file.")

    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)

        # Check if the DataFrame is empty
        if df.empty:
            raise HTTPException(status_code=400, detail="The uploaded file contains no data.")

        # Convert the DataFrame to a list of dictionaries
        data = df.to_dict(orient='records')

        print(f"Parsed Data: {data}")

        # Add hospital_id to each record
        for record in data:
            record["hospital_id"] = hospital_id

        # Uploading the data to Firebase
        upload_result = upload_data_to_firestore(data, hospital_id)

        # Return a detailed response
        return {
            "message": "File uploaded and data saved successfully.",
            "records_uploaded": upload_result["records_uploaded"],
            "errors": upload_result["errors"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing the file: {str(e)}")


def upload_data_to_firestore(data, collection_name):
    """
    Uploads a list of dictionaries to a specified Firestore collection.
    
    :param data: List of dictionaries containing the data to upload
    :param collection_name: Firestore collection where data will be stored
    """
    try:
        collection_ref = db.collection("hospitals").document(collection_name).collection("nurses")
        records_uploaded = 0
        errors = []

        for record in data:
            try:
                # Ensure 'Nurse ID' exists in the record
                if 'Nurse ID' not in record:
                    raise ValueError("Missing 'Nurse ID' in record.")

                # Add data to Firestore with an auto-generated document ID
                collection_ref.document(record['Nurse ID']).set(record, merge=True)
                records_uploaded += 1
            except Exception as e:
                errors.append({"record": record, "error": str(e)})

        print(f"Successfully uploaded {records_uploaded} records to Firestore collection: {collection_name}")
        return {"records_uploaded": records_uploaded, "errors": errors}

    except Exception as e:
        print(f"Error uploading data to Firestore: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error uploading data to Firestore: {str(e)}")

