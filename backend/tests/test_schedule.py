import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from api.schedule import router
from google.cloud import firestore

# Create a TestClient
client = TestClient(router)

# Mock Firestore Client
@pytest.fixture
def mock_firestore():
    with patch.object(firestore, "Client", return_value=MagicMock()) as mock_db:
        yield mock_db

# Test schedule generation
def test_generate_schedule(mock_firestore):
    mock_db = mock_firestore.return_value
    mock_collection = mock_db.collection.return_value
    mock_stream = mock_collection.stream.return_value
    mock_nurse_doc = MagicMock()
    mock_nurse_doc.id = "nurse_1"
    mock_nurse_doc.to_dict.return_value = {"name": "Test Nurse"}
    mock_stream.__iter__.return_value = [mock_nurse_doc]

    response = client.post("/generate-schedule")
    
    assert response.status_code == 200
    assert response.json()["message"] == "Schedule generated successfully"

# Test schedule generation with no nurses
def test_generate_schedule_no_nurses(mock_firestore):
    mock_db = mock_firestore.return_value
    mock_collection = mock_db.collection.return_value
    mock_collection.stream.return_value = []  # No nurses

    response = client.post("/generate-schedule")
    
    assert response.status_code == 200
    assert response.json()["message"] == "Schedule generated successfully"
    assert response.json()["schedules"] == []  # Expecting an empty schedule

# Test retrieving schedules
def test_get_schedules(mock_firestore):
    mock_db = mock_firestore.return_value
    mock_collection = mock_db.collection.return_value
    mock_stream = mock_collection.stream.return_value
    mock_schedule_doc = MagicMock()
    mock_schedule_doc.to_dict.return_value = {
        "nurse_id": "nurse_1",
        "name": "Test Nurse",
        "shift_start": "2025-03-09 08:00:00",
        "shift_end": "2025-03-09 16:00:00"
    }
    mock_stream.__iter__.return_value = [mock_schedule_doc]

    response = client.get("/schedules")
    
    assert response.status_code == 200
    assert "schedules" in response.json()
    assert len(response.json()["schedules"]) == 1

# Test resetting schedules
def test_reset_schedule(mock_firestore):
    mock_db = mock_firestore.return_value
    mock_collection = mock_db.collection.return_value
    mock_stream = mock_collection.stream.return_value
    mock_schedule_doc = MagicMock()
    mock_schedule_doc.id = "schedule_1"
    mock_stream.__iter__.return_value = [mock_schedule_doc]

    response = client.delete("/reset
