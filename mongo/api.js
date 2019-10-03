const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const datafile  = require('./tmp/data');
var data = datafile.data;


const listener = async () => {
    let app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.set('json spaces', 40);
    app.listen(8080, function () {
        console.log("Citopia Api is listening on port 8080");
    });
    app.get("/services", function(req, res) {
    res.json([
            {
              id: "airdata",
              icon: 'http://localhost:8080/assets/airdata.png',
              name: "r analysis",
              description: "Check the air condition!",
              paid: true,
              type: "type-a",
              vehicleType: "none",
            },
          ]);
	});
     app.get("/bits", function(req, res) {
              res.json([
                {
                  id: "pm10",
                  icon: 'http://localhost:8080/assets/airdata.png',
                  name: "Air analysis",
                  description: "Check the air condition!",
                  paid: true,
                  type: "type-a",
                  vehicleType: "none",
                },
                {
                  id: "pm25",
                  icon: 'http://localhost:8080/assets/airdata.png',
                  name: "Air analysis",
                  description: "Check the air condition!",
                  paid: true,
                  type: "type-a",
                  vehicleType: "none",
              }
              ]);
    	});
    	app.get("/register", function(req, res) {
      const userId = req.query.userId;
      const serviceId = req.query.serviceId;
      const currentLat = req.query // here, we need to register service usage in our database
  let p = {
	lat: currentLat,
        lng: currentLng,
  }
  let radius = 2;
  let goodData = [];
  for(let d of data){
                if ( Math.abs(parseFloat(d.data['longitude']) - 
parseFloat(p.lng))+Math.abs(parseFloat(d.data['latitude'] )- parseFloat( p.lat)) 
<radius){       $
goodData.push(d); 
                }
        } 
  res.json({
    status: "success",
    message: goodData
  });
});
}

listener();


