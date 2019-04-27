# Air Quality Module
## Set up
### IOTA-Network
For testing:
Set up private IOTA-Network
https://github.com/iotaledger/compass 
https://github.com/iotaledger/compass/blob/master/docs/HOWTO_private_tangle.md


* config.json
```
{
  "seed": "WUHHNVTUVGXNWKONKFHDITCWXISCOWOOTCSXUJEHRGJ9FDXNJDWUUQXGQEQHSSVSRISKKLBMQIS9IKNOW",
  "powMode": "CURLP81",
  "sigMode": "CURLP27",
  "security": 1,
  "depth": 16,
  "milestoneStart": 0,
  "mwm": 1,
  "tick": 20000,
  "host": "http://localhost:14267"
}
```
* iota.ini
```
[IRI]
PORT = 14267
UDP_RECEIVER_PORT = 14600
NEIGHBORS = udp://localhost:14601
IXI_DIR = ixi
DEBUG = false
DB_PATH = db
ZMQ_ENABLED = true
ZMQ_PORT = 5556
API_HOST = 0.0.0.0
REMOTE-LIMIT-API = "addNeighbors"
```

* 02_run_iri.sh 
```
#!/bin/bash

scriptdir=$(dirname "$(readlink -f "$0")")
. $scriptdir/lib.sh

load_config

COO_ADDRESS=$(cat $scriptdir/data/layers/layer.0.csv)

docker pull iotaledger/iri:latest
docker run -d -t --net host --rm -e DOCKER_IRI_REMOTE_LIMIT_API="" -v $scriptdir/iota.ini:/iri/conf/iota.ini -v $scriptdir/db:/iri/data -v $scriptdir/snapshot.txt:/snapshot.txt -p 14265 -p 5555 iotaledger/iri:latest \
       --testnet \
       --remote \
       --testnet-coordinator $COO_ADDRESS \
       --mwm $mwm \
       --milestone-start $milestoneStart \
       --milestone-keys $depth \
       --snapshot /snapshot.txt \
       --max-depth 1000 $@ \
       -c /iri/conf/iota.ini
```
### MongoDB
Install MongoDB for organizing the addresses. 
https://docs.mongodb.com/manual/installation/#tutorial-installation

### Required Software
Node.js und NPM

### Initialise 

The following steps must be executed on the console in the prototyp folder

1. Run ```npm install``` in ./frontend and ./iota
2. Run the IOTA-Node
2. If your Node is running on other ports than set before, change it also in ./iota/config.json
3. Start the IOTA-Hub ```cd iota && node server.js ```
3. Set your the IP of your IOTA-Node in the ./index.html, if you use a IOTA-Node, wich is not set up like shown, the seed has also to be updated
4. Start the Frontend ```cd frontend && http-server ```



## Usage
Use the web based interface on http://localhost:8080


## Hardware Requirements
* ESP32S NodeMCU
* 2 18650 li-ion
* SDS011 air particulate matter sensor
* DHT11 temperature & humidity sensor
* LM2596 DC-DC Step down module



## ESP32 Code
To play the Esp32s board the Arduino IDE is necessary. After the board nd the libraries has been added to the IDE (see tutorials on the internet), the code can be uploaded to the ESP by pressing the boot button and uploading the scetch. 



