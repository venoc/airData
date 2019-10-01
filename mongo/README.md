# Obtaining the sensor data
For simplicity we separated the part of the sensor data query from the frontend. 
First we pull the data from the tangle write it to a MongoDB and then write it to the file 'data.js'
You can also perform this step directly in the frontend, which reduces performance and improves transparency.

## Setting it up
1. Install and start a MongoDB
2. Write your IOTA-Marketplace key in the 'safeDataFromStreamToDB.js' file.
3. Run ```node safeDataFromStreamToDB.js```
4. Write the 'data.js' file by running the command ```node findData.js```
