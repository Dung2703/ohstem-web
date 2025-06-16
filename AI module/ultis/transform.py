
import numpy as np
import matplotlib.pyplot as plt
import PIL.Image as Image

SAVEFIG_PATH = '../image'
SAVEIMG_PATH = '../image'

def transform_sensor_data(sensor_data, num=0, data_move=20, data_scale=6, MAKE_FIGURE=False):
    """
    Chuyển đổi dữ liệu cảm biến (gia tốc + con quay) từ dải -20~20 về 0~255
    Đầu ra: ảnh RGB kích thước (3 x 20 x 20)
    """
    transform_data = np.zeros((3, 400), dtype=np.uint8)
    raw_data = np.zeros((3, 400), dtype=np.float32)

    for i in range(400):
        if i >= 200:
            # Gyroscope data, scale to 0~255
            gyro = sensor_data[3 * i: 3 * i + 3]
            scale = 250 / 40  # assuming raw values are in range [-20, 20]
            transform_data[:, i] = ((gyro + 20) * scale).astype(np.uint8)
        else:
            # Accelerometer data, scale using offset + multiplier
            accel = sensor_data[3 * i: 3 * i + 3]
            transform_data[:, i] = ((accel + data_move) * data_scale).astype(np.uint8)

        if MAKE_FIGURE:
            raw_data[0][i] = sensor_data[3 * i]
            raw_data[1][i] = sensor_data[3 * i + 1]
            raw_data[2][i] = sensor_data[3 * i + 2]

    if MAKE_FIGURE:
        x = np.arange(400)
        plt.figure(figsize=(10, 4))

        plt.subplot(1, 2, 1)
        plt.title('Processed Data')
        plt.plot(x, transform_data[0], label='X', color='red')
        plt.plot(x, transform_data[1], label='Y', color='green')
        plt.plot(x, transform_data[2], label='Z', color='blue')
        plt.legend()

        plt.subplot(1, 2, 2)
        plt.title('Raw Data')
        plt.plot(x, raw_data[0], label='X', color='red')
        plt.plot(x, raw_data[1], label='Y', color='green')
        plt.plot(x, raw_data[2], label='Z', color='blue')
        plt.legend()

        plt.tight_layout()
        plt.savefig(f"{SAVEFIG_PATH}/{num}.png")
        plt.close()

    return transform_data.reshape((3, 20, 20))

def data2image(transform_data, num):
    if transform_data.shape != (3, 20, 20):
        print("Sai kích thước đầu vào cho ảnh:", transform_data.shape)
        return None

    r = Image.fromarray(transform_data[0], 'L')
    g = Image.fromarray(transform_data[1], 'L')
    b = Image.fromarray(transform_data[2], 'L')

    image = Image.merge('RGB', (r, g, b))
    image.save(f"{SAVEIMG_PATH}/{num}.png")
    return image
