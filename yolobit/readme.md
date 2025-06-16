## 🛠️ Development Setup for ESP32

### 🧩 1. Install Required VSCode Extensions
From the Extensions tab (`Ctrl+Shift+X`), install:
- **Pymakr** (for uploading code to ESP32)
- **Python** extension by Microsoft
- *(Optional)* **ESP-IDF** for native C/C++ ESP32 projects

### 📁 2. Project Structure
```bash
esp32-fall-detection/
│
├── boot.py # Auto-runs on reset (optional setup)
├── main.py # Main logic: model loading, prediction, Firebase upload
├── mpu6050.py # MPU6050 sensor driver
├── pymakr.conf # Pymakr serial port configuration
└── model.tflite # TensorFlow Lite model for edge inference
```

### ⚙️ 3. Configure pymakr.conf

Ensure `pymakr.conf` includes:

```bash
{
  "address": "COM15",
  "username": "micro",
  "password": "python",
  "sync_folder": "",
  "open_on_start": true,
  "sync_file_types": "py,txt,log,json,tflite"
}
```
💡 Replace "COM15" with your actual serial port (check in Device Manager or VSCode status bar)

### 🚀 4. Upload & Run Code
- Connect Yolobit via USB

- Click Upload in the Pymakr toolbar (bottom of VSCode) or Press Ctrl+Shift+P → Select Pymakr: Upload Project

- Files will sync to the device

- The device automatically executes main.py after upload