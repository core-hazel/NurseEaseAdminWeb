import firebase_admin
import logging

from firebase_admin import credentials, firestore, messaging

# Load Firebase credentials from a service account JSON file
cred = credentials.Certificate(r"C:\Cloud\git\NurseEaseAdminWeb\backend\serviceAccountKey.json")  # Replace with your actual file path
firebase_admin.initialize_app(cred)

def get_firestore():
    """Returns Firestore database client."""
    return firestore.client()

# Set up logging configuration
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def send_fcm_notification(fcm_tokens, title, body):
    """Sends an FCM notification in manageable batches with logging."""
    if not fcm_tokens:
        logging.warning("No FCM tokens provided for notification.")
        return
    else:
        logging.info(f"Sending notification to {len(fcm_tokens)} tokens...")

    # Split tokens into batches of 500 (max allowed by FCM)
    batch_size = 500
    batches = [fcm_tokens[i:i + batch_size] for i in range(0, len(fcm_tokens), batch_size)]

    total_success = 0
    total_failure = 0

    for idx, batch in enumerate(batches):
        logging.info(f"Sending batch {idx + 1} of {len(batches)}...")
        try:
            message = messaging.MulticastMessage(
                notification=messaging.Notification(
                    title=title,
                    body=body,
                ),
                tokens=batch,
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
            response = messaging.send_multicast(message)
            logging.info(f"Batch {idx + 1}: {response.success_count} messages sent successfully, "
                         f"{response.failure_count} failed.")

            total_success += response.success_count
            total_failure += response.failure_count

            # Log failed tokens and errors
            if response.failure_count > 0:
                for i, resp in enumerate(response.responses):
                    if not resp.success:
                        logging.error(f"Failed to send notification to token {batch[i]}: {resp.exception}")

        except Exception as e:
            logging.error(f"Error while sending batch {idx + 1}: {e}")

    logging.info(f"Total Notifications Sent: {total_success}, Total Failures: {total_failure}")


def send_fcm_notification_to_topic(topic, title, body):
    try:
        single_message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            token=topic,
        )
        response = messaging.send(single_message)
        print(f"Single message response: {response}")
    except Exception as e:
        print(f"Error sending single message: {e}")