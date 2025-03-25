from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
#from firebase import get_firestore # Assuming firebase_db is initialized in firebase.py
from firebase_config import upload_data_to_firestore  # Your function to upload data to Firestore

router = APIRouter()
#db = get_firestore()

@router.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith(('.xlsx', '.csv')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an Excel or CSV file.")

    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file.file)
        else:
            df = pd.read_excel(file.file)

        # Convert the DataFrame to a dictionary
        data = df.to_dict(orient='records')

        # Uploading the data to Firebase
        upload_data_to_firestore(data)

        return {"message": "File uploaded and data saved successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing the file: {str(e)}")
