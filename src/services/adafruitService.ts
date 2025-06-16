import mqtt from 'mqtt';

export interface SensorData {
  temperature: number;
  humidity: number;
  light: number;
  devices: string;
}

export interface DeviceStatus {
  id: string;
  name: string;
  type: string;
  state: boolean;
}

export interface AdafruitConfig {
  username: string;
  key: string;
}

class AdafruitService {
  private client: mqtt.MqttClient | null = null;
  private username = 'Dung_2252133';
  private key: string | null = null;
  private feeds = {
    temperature: 'Dung_2252133/feeds/cambien1',
    humidity: 'Dung_2252133/feeds/cambien2',
    light: 'Dung_2252133/feeds/cambien3',
    door: 'Dung_2252133/feeds/nutbam1',
    light_control: 'Dung_2252133/feeds/nutbam2'
  };

  private sensorData: SensorData = {
    temperature: 0,
    humidity: 0,
    light: 0,
    devices: '0/2'
  };

  private deviceStates = {
    door: false,
    light: false
  };

  private callbacks: ((data: SensorData) => void)[] = [];
  private connectionError: string | null = null;

  constructor() {
    // Try to get the key from localStorage
    const savedKey = localStorage.getItem('adafruitKey');
    if (savedKey) {
      this.key = savedKey;
      this.connect();
    }
  }

  setKey(key: string) {
    this.key = key;
    localStorage.setItem('adafruitKey', key);
    
    // Disconnect existing connection if any
    if (this.client) {
      this.disconnect();
    }
    
    // Establish new connection with new key
    this.connect();
  }

  private connect() {
    if (!this.key) {
      this.connectionError = 'Adafruit IO key not set';
      return;
    }

    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    
    this.client = mqtt.connect('wss://io.adafruit.com:443/mqtt', {
      clientId,
      username: this.username,
      password: this.key,
      clean: true
    });

    this.client.on('connect', () => {
      console.log('Connected to Adafruit IO');
      this.connectionError = null;
      this.subscribeToFeeds();
    });

    this.client.on('error', (error) => {
      console.error('Adafruit IO connection error:', error);
      this.connectionError = error.message;
      this.notifySubscribers();
    });

    this.client.on('message', (topic, message) => {
      const value = parseFloat(message.toString());
      
      switch(topic) {
        case this.feeds.temperature:
          this.sensorData.temperature = value;
          break;
        case this.feeds.humidity:
          this.sensorData.humidity = value;
          break;
        case this.feeds.light:
          this.sensorData.light = value;
          break;
        case this.feeds.door:
          this.deviceStates.door = value === 1;
          break;
        case this.feeds.light_control:
          this.deviceStates.light = value === 1;
          break;
      }

      this.notifySubscribers();
    });
  }

  private subscribeToFeeds() {
    if (!this.client) return;
    
    Object.values(this.feeds).forEach(feed => {
      this.client!.subscribe(feed, (err) => {
        if (err) {
          console.error('Error subscribing to feed:', feed, err);
        }
      });
    });
  }

  private notifySubscribers() {
    const activeDevices = Object.values(this.deviceStates).filter(state => state).length;
    this.sensorData.devices = `${activeDevices}/2`;
    
    this.callbacks.forEach(callback => callback({
      ...this.sensorData,
      error: this.connectionError
    }));
  }

  subscribe(callback: (data: SensorData & { error?: string | null }) => void) {
    this.callbacks.push(callback);
    callback({
      ...this.sensorData,
      error: this.connectionError
    }); // Initial data
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  async controlDevice(deviceId: 'door' | 'light', state: boolean) {
    if (!this.client) return false;
    
    const feed = deviceId === 'door' ? this.feeds.door : this.feeds.light_control;
    const value = state ? '1' : '0';
    
    return new Promise<boolean>((resolve) => {
      this.client!.publish(feed, value, { qos: 1 }, (err) => {
        if (err) {
          console.error('Error publishing to feed:', feed, err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  getDeviceState(deviceId: 'door' | 'light'): boolean {
    return this.deviceStates[deviceId];
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }
}

export default new AdafruitService();