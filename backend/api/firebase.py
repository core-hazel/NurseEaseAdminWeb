import firebase_admin
from firebase_admin import credentials, firestore, messaging

# Load Firebase credentials from a service account JSON file
cred = credentials.Certificate(r"/run/media/adithya/Studies and Related/NurseEaseAdminWeb/backend/serviceAccountKey.json")  # Replace with your actual file path
firebase_admin.initialize_app(cred)

def get_firestore():
    """Returns Firestore database client."""
    return firestore.client()

def send_fcm_notification(fcm_token, title, body):
    """Sends an FCM notification to the specified token."""
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        token=fcm_token,
        android=messaging.AndroidConfig(
            notification=messaging.AndroidNotification(
                sound="default",
            ),
        ),
        apns=messaging.APNSConfig(
            payload=messaging.APNSPayload(
                aps=messaging.Aps(
                    sound="default",
                ),
            ),
        ),
    )
    response = messaging.send(message)
    print(f"Successfully sent message: {response}")

