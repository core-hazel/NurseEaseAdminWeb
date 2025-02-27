from database import get_db

def generate_schedule():
    db = get_db()
    nurses = db.get_all_nurses()
    if not nurses:
        return False, "No nurses available"

    schedule = [{"nurse": nurse, "shift": "Morning"} for nurse in nurses]
    db.save_schedule(schedule)
    return True, schedule

