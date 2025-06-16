from yolobit import *
from machine import I2C, Pin
import time
from mpu6050 import MPU6050
import urequests
import ujson
import network
import tensorflow.compat.v1 as tf
import numpy as np

tf.disable_v2_behavior()

# === CẤU HÌNH ===
USER_ID = "USER_001"
DEVICE_ID = "DEVICE_ABC"
FIREBASE_DB_BASE = "https://falldetectionbelt-default-rtdb.firebaseio.com/data"

MODEL_FILES = {
    'model.ckpt.index': 'https://storage.googleapis.com/fall-detection-belt.appspot.com/models/model.ckpt.index',
    'model.ckpt.meta': 'https://storage.googleapis.com/fall-detection-belt.appspot.com/models/model.ckpt.meta',
    'model.ckpt.data-00000-of-00001': 'https://storage.googleapis.com/fall-detection-belt.appspot.com/models/model.ckpt.data-00000-of-00001'
}
MODEL_PREFIX = './model.ckpt'

CLASS_LIST = [0, 2, 3, 4, 5, 6, 7, 9]
LABEL_MAP = {
    0: 'Fall', 2: 'Walk', 3: 'Jog', 4: 'Jump',
    5: 'Up', 6: 'Down', 7: 'St2Si', 9: 'Si2St'
}
SAMPLE_CHUNK_SIZE = 200  # = 1200 giá trị

# === KẾT NỐI WIFI ===
def connect_wifi():
    wifi_url = f"{FIREBASE_DB_BASE}/{USER_ID}/wifi.json"
    try:
        res = urequests.get(wifi_url)
        info = res.json()
        ssid = info.get("ssid")
        password = info.get("password")
        res.close()

        if not ssid or not password:
            print("Wrong SSID or password")
            return False

        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)
        wlan.connect(ssid, password)

        print(f" Connext to {ssid}...")
        timeout = 15
        while not wlan.isconnected() and timeout > 0:
            time.sleep(1)
            timeout -= 1

        if wlan.isconnected():
            print("Connect successful")
            return True
        else:
            print("Connect fail")
            return False

    except Exception as e:
        print("Error to get wifi info", e)
        return False

# === TẢI MODEL TỪ FIREBASE STORAGE ===
def download_file(url, path):
    try:
        res = urequests.get(url)
        with open(path, 'wb') as f:
            f.write(res.content)
        res.close()
        print(f"Download: {path}")
    except Exception as e:
        print(f"Error in download {path}: {e}")

def download_model():
    for name, url in MODEL_FILES.items():
        download_file(url, MODEL_PREFIX + '.' + name.split('.')[-1])

# === KHỞI TẠO MPU6050 ===
i2c = I2C(0, scl=Pin(pin19.pin), sda=Pin(pin20.pin))
sensor = MPU6050(i2c)

# === MẠNG CNN ===
def fall_net(x):
    def w(s): return tf.Variable(tf.truncated_normal(s, stddev=0.1))
    def b(s): return tf.Variable(tf.constant(0.1, shape=s))
    def conv2d(x, W): return tf.nn.conv2d(x, W, [1, 1, 1, 1], padding='SAME')
    def max_pool(x): return tf.nn.max_pool(x, [1,2,2,1], [1,2,2,1], padding='SAME')

    x = tf.reshape(x, [-1, 20, 20, 3])
    x = x / 255.0 * 2 - 1

    conv1 = tf.nn.relu(conv2d(x, w([5, 5, 3, 32])) + b([32]))
    pool1 = max_pool(conv1)
    conv2 = tf.nn.relu(conv2d(pool1, w([5, 5, 32, 64])) + b([64]))
    pool2 = max_pool(conv2)

    flat = tf.reshape(pool2, [-1, 5 * 5 * 64])
    fc1 = tf.nn.relu(tf.matmul(flat, w([5 * 5 * 64, 512])) + b([512]))
    keep_prob = tf.placeholder(tf.float32)
    drop = tf.nn.dropout(fc1, keep_prob)

    output = tf.matmul(drop, w([512, len(CLASS_LIST)])) + b([len(CLASS_LIST)])
    return output, keep_prob

# === DỰ ĐOÁN LABEL ===
def predict_label(data_chunk):
    x_input = tf.placeholder(tf.float32, [None, 1200])
    y_output, keep_prob = fall_net(x_input)
    saver = tf.train.Saver()

    with tf.Session() as sess:
        try:
            saver.restore(sess, MODEL_PREFIX)
        except:
            display.scroll("Err")
            return None

        input_data = np.array(data_chunk).reshape(1, -1)
        pred = sess.run(tf.argmax(y_output, 1), feed_dict={x_input: input_data, keep_prob: 1.0})
        return CLASS_LIST[pred[0]]

# === PUSH LÊN FIREBASE ===
def push_to_firebase(label, data):
    label_str = str(label)
    timestamp = str(int(time.time()))
    full_url = f"{FIREBASE_DB_BASE}/{USER_ID}/data/{DEVICE_ID}/{label_str}/{timestamp}.json"

    payload = {
        "label": LABEL_MAP.get(label, label),
        "raw": data,
        "ts": time.time()
    }

    try:
        res = urequests.put(full_url, headers={"Content-Type": "application/json"},
                            data=ujson.dumps(payload))
        print(f"🔥 Đã gửi tới {full_url}")
        res.close()
    except Exception as e:
        print("Error:", e)

# === VÒNG LẶP CHÍNH ===
def run_prediction_loop():
    buffer = []
    count = 0

    while True:
        ax, ay, az = sensor.get_accel()
        gx, gy, gz = sensor.get_gyro()
        buffer.extend([ax, ay, az, gx, gy, gz])
        count += 1

        if count >= SAMPLE_CHUNK_SIZE:
            if len(buffer) < 1200:
                print("Not enough 1200")
            else:
                label = predict_label(buffer)
                if label is not None:
                    push_to_firebase(label, [round(v, 6) for v in buffer])
                    display.scroll("✓")
                else:
                    display.scroll("NoPred")

            buffer = []
            count = 0

        time.sleep(0.01)

# === MAIN ===
display.scroll("WiFi")
if connect_wifi():
    display.scroll("Model")
    download_model()
    display.scroll("Ready")
    run_prediction_loop()
else:
    display.scroll("NoWiFi")