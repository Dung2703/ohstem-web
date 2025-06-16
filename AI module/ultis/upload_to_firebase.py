import firebase_admin
from firebase_admin import credentials, storage
import os

cred = credentials.Certificate("./falldetectionbelt-firebase-adminsdk-fbsvc-99f6386e83.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'fall-detection-belt.appspot.com'
})

MODEL_DIR = '../model'
MODEL_PREFIX = 'model.ckpt'

model_files = [
    MODEL_PREFIX + '.meta',
    MODEL_PREFIX + '.index',
    MODEL_PREFIX + '.data-00000-of-00001'
]

bucket = storage.bucket()
def upload_model_to_firebase():
    for filename in model_files:
        local_path = os.path.join(MODEL_DIR, filename)
        blob = bucket.blob('models/' + filename)
        blob.upload_from_filename(local_path)
        blob.make_public()  
        print(f"✅ Uploaded {filename}")
        print(f"🌐 Public URL: {blob.public_url}")
