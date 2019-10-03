# Airdata
See our airdata recorded with a escooter http://airdata.venoc.de.
## Sending the data to the tangle
Since microcomputers have insufficient computing power, a server is hosting the 'dataPusher.js' file which receives the data from the sensor and uploads it to the IOTA Marketplace.
Open the folder 'scooter-01' to get a short guide how to start this server.
In our case, we consider an AWS EC2 t2.micro instance to be a suitable server for this application.
## Receiving data form the tangle
The pushed sensor data can be obtained directly from the marketplace.
Our data can be found at https://data.iota.org/#/sensor/scooter-01.
Open the folder 'mongo' to get a short guide how to do this. We also found that an AWS EC2 t2.micro instance would be a good choice for this service.
## Displaying the data
In the last step we display the data on our frontend.
Open the folder 'frontend' to get a short guide how to do this.
![](frontend.png)
## Connecting to the Citopia App
We also implemented the Citopia API to get access to our airquality sevice through this blockchain powered mobility marketplace app. It supplements the platform designed for mobility with an awareness of a sustainable and healthy existence in the city. 

It runs live on an AWS EC2 t2.micro instance.
Test it!
```
http://3.16.15.24:8080/register?currentLat=32&currentLng=34.7 
```
```
http://3.16.15.24:8080/services
```
```
http://3.16.15.24:8080/bits
```

If you want to see the code or run it by yourself run the following commands
1. Change in die directory mongo
2. call ```npm install```
3. call ```node api.js```
4. Use it