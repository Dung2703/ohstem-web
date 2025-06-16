import os
import requests
import pandas as pd
from datetime import datetime
from cnn import train_model, test_model
from upload_to_firebase import upload_model_to_firebase

# === Cấu hình ===
FIREBASE_DB_URL = "https://falldetectionbelt-default-rtdb.firebaseio.com/data.json"
DATA_DIR = "../data/dataset"
LABEL_LIST = [0, 2, 3, 4, 5, 6, 7, 9]

def download_and_save_per_label():
    print("Download from Firebase...")

    try:
        res = requests.get(FIREBASE_DB_URL)
        all_data = res.json()
    except Exception as e:
        print("Error in download:", e)
        return False

    if not all_data:
        print("⚠️ Firebase is empty.")
        return False

    os.makedirs(DATA_DIR, exist_ok=True)
    label_data = {label: [] for label in LABEL_LIST}

    for user_id, labels in all_data.items():
        if not isinstance(labels, dict):
            continue

        for label_str, samples in labels.items():
            try:
                label = int(label_str)
                if label not in LABEL_LIST:
                    continue
            except:
                continue

            for ts_key, entry in samples.items():
                raw = entry.get("raw")
                if raw and isinstance(raw, list) and len(raw) == 1200:
                    label_data[label].append(raw)

    has_data = False
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")

    for label, data_rows in label_data.items():
        if data_rows:
            file_path = os.path.join(DATA_DIR, f"{label}_{timestamp}.csv")
            pd.DataFrame(data_rows).to_csv(file_path, index=False)
            print(f"Stored {len(data_rows)} into: {file_path}")
            has_data = True
        else:
            print(f"No data for label {label}")

    return has_data


def retrain_with_new_data():
    print("Train model")
    train_model()
    print("Test model")
    test_model()
    print("Upload model to Firebase Storage...")
    upload_model_to_firebase()


if __name__ == "__main__":
    if download_and_save_per_label():
        retrain_with_new_data()
    else:
        print("No data to train")
