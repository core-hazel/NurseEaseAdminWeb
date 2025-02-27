class Database:
    def __init__(self):
        self.nurses = []
        self.schedules = []

    def get_all_nurses(self):
        return self.nurses

    def add_nurse(self, nurse):
        self.nurses.append(nurse)

    def save_schedule(self, schedule):
        self.schedules.append(schedule)

def get_db():
    return Database()

