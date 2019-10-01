# Airdata
See our airdata recorded with a escooter http://airdata.venoc.de.
## Sending the data to the tangle
Since microcomputers have insufficient computing power, a server is hosting the 'dataPusher.js' file which receives the data from the sensor and uploads it to the IOTA Marketplace.
Open the folder 'scooter-01' to get a short guide how to start this server.
In our case, an AWS EC2 t2.micro instance has proven to be a suitable server for this application.
## Receiving data form the tangle
The pushed sensor data can be obtained directly from the marketplace.
Our data can be found at https://data.iota.org/#/sensor/scooter-01.
Open the folder 'mongo' to get a short guide how to do this.
## Displaying the data
In the last step we display the data on our frontend.
Open the folder 'frontend' to get a short guide how to do this.
![](frontend.png)
