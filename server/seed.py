import json
from pathlib import Path

from config import app, db
from models import Gym

SEED_PATH = Path(__file__).parent / "seed_data" / "gyms.json"

def seed_gyms():
    gyms = json.loads(SEED_PATH.read_text())

    created = 0
    skipped = 0

    for g in gyms:
        name = (g.get("name") or "").strip()
        location = (g.get("location") or "").strip()

        # Avoid duplicates (simple rule: same name + location)
        exists = Gym.query.filter_by(name=name, location=location).first()
        if exists:
            skipped += 1
            continue

        gym = Gym(
            name=name,
            description=g.get("description"),
            rating=g.get("rating"),
            image=g.get("image"),
            location=location,
        )
        db.session.add(gym)
        created += 1

    db.session.commit()
    print(f"Seed complete. Created: {created}, Skipped: {skipped}")

if __name__ == "__main__":
    with app.app_context():
        seed_gyms()
