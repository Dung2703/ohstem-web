# 🛡️ Fall Detection AI Module (ESP32 + Firebase + CNN)

This system leverages an ESP32 (Yolobit + MPU6050) sensor module to collect real-time motion data, predict activities using a trained Convolutional Neural Network (CNN), and upload both the data and prediction results to Firebase for continuous AI model retraining.

## 📁 Project Structure
├── src/cnn.py # Define CNN architecture and train model
├── src/dataset.py # Download and process Firebase data into CSV format
├── src/main.py # Download data from firebase 
├── ultis/transform.py # Convert sensor data to RGB images (optional)
├── ultis/upload_to_firebase.py # Upload trained model to Firebase Storage
├── model/ # Contains model checkpoint files
└── data/dataset/ # CSV files for each activity label
## 🧰 Requirements

- Python >= 3.8
- Required libraries:

```bash
pip install tensorflow==1.15
pip install firebase-admin
pip install pandas
pip install requests
pip install matplotlib pillow
```
## 🔧 Firebase Configuration
- Create a Firebase project at: https://console.firebase.google.com
- Enable Realtime Database and Storage
-  Download your service account key (JSON file)
- Rename and configure it in upload_to_firebase.py:
## 🌐 Firebase Realtime Database Format
```bash 
/data/
  └── {user_uid}/
        ├── wifi:
        │     ├── ssid: "YourWiFiName"
        │     └── password: "YourPassword"
        └── {device_id}/
              └── {label}/
                    └── {timestamp}/
                          ├── raw: [1200 values]
                          ├── label: "Fall"
                          └── ts: 1718573387
```
## Run AI module
```bash
python main.py
```