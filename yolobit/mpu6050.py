from machine import I2C
import time

class MPU6050:
    def __init__(self, i2c, addr=0x68):
        self.i2c = i2c
        self.addr = addr
        # Wake up the MPU6050
        self.i2c.writeto_mem(self.addr, 0x6B, b'\x00')

    def read_raw_data(self, reg):
        data = self.i2c.readfrom_mem(self.addr, reg, 2)
        value = int.from_bytes(data, 'big') if data[0] < 0x80 else -((65535 - int.from_bytes(data, 'big')) + 1)
        return value

    def get_accel(self):
        x = self.read_raw_data(0x3B)/ 16384.0
        y = self.read_raw_data(0x3D)/ 16384.0
        z = self.read_raw_data(0x3F)/ 16384.0
        return (x, y, z)

    def get_gyro(self):
        x = self.read_raw_data(0x43)/ 131.0 
        y = self.read_raw_data(0x45)/ 131.0 
        z = self.read_raw_data(0x47)/ 131.0
        return (x, y, z)
