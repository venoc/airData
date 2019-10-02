# Marketplace Server
## Setup
1. Set your sensorId and the corresponding secretKey in the File 'config.json'.
2. Run npm install
2. Set your Public IP of your server
3. Now you can post the sensor data via the server using a POST command in the following form: 
```
{
    "data": [
        {
            "pm25": 26,
            "pm10": 46,
            "temperature": 25.67,
            "pressure": 975.22,
            "humidity": 47.45,
            "latitude": 49.942131,
            "longitude": 11.57,
            "altitude": 356.1,
            "speed": 3.43,
            "accX": 0.01,
            "accY": 1,
            "accZ": 0.02,
            "timestamp": "0"
        },
        {
            "pm25": "2",
            "pm10": "0",
            "temperature": "0",
            "pressure": "0",
            "humidity": "0",
            "latitude": "0",
            "longitude": "0",
            "altitude": "0",
            "speed": "0",
            "accX": "0",
            "accY": "0",
            "accZ": "0",
            "timestamp": "0"
        }
}
```

The data can now be retrieved again via the IOTA Marketplace.
