import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from firebase_admin import auth
from main import app  # Ensure this is the entry file that includes FastAPI setup

client = TestClient(app)

# Mock Firebase authentication
@pytest.fixture
def mock_create_user():
    with patch("firebase_admin.auth.create_user") as mock:
        mock.return_value.uid = "test_uid"
        yield mock

@pytest.fixture
def mock_verify_id_token():
    with patch("firebase_admin.auth.verify_id_token") as mock:
        mock.return_value = {"uid": "test_uid"}
        yield mock

# Test Signup
@pytest.mark.parametrize("email, password, expected_status", [
    ("test@example.com", "password123", 200),
    ("invalid_email", "password123", 400),  # Example of failure case
])
def test_signup(email, password, expected_status, mock_create_user):
    response = client.post("/signup", json={"email": email, "password": password})
    assert response.status_code == expected_status
    if expected_status == 200:
        assert response.json() == {"message": "User  created successfully", "uid": "test_uid"}

# Test Login
def test_login_success(mock_verify_id_token):
    response = client.post("/login", json={"id_token": "valid_token"})
    assert response.status_code == 200
    assert response.json() == {"message": "Login successful", "uid": "test_uid"}

# Test Login Failure
def test_login_failure():
    response = client.post("/login", json={"id_token": "invalid_token"})
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid token"}

# Test Protected Route
def test_protected_route(mock_verify_id_token):
    response = client.get("/protected", headers={"Authorization": "Bearer valid_token"})
    assert response.status_code == 200
    assert response.json()["message"] == "You have access!"
