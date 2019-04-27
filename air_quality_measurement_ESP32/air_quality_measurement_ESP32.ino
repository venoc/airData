#include <DHT.h>

#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>
#include <WebServer.h>
#include "index.h"
#define RXD2 16
#define TXD2 17
#define DHTPIN 23
#define DHTTYPE DHT11
#define period  5000


WebServer server(80);
String node = "http://192.168.1.26:3000/api";
HTTPClient http;
const char* ssid = "SSID";
const char* password = "password";
unsigned long time_now = 0;

DHT dht(DHTPIN, DHTTYPE);
unsigned int Pm25 = 0;
unsigned int Pm10 = 0;

String mamState = "";
String key = "KEY";
String root  = "";
TaskHandle_t tempTaskHandle = NULL;
void ProcessSerialData()
{
  uint8_t mData = 0;
  uint8_t i = 0;
  uint8_t mPkt[10] = {0};
  uint8_t mCheck = 0;
  while (Serial2.available() > 0)
  {
    // from www.inovafitness.com
    // packet format: AA C0 PM25_Low PM25_High PM10_Low PM10_High 0 0 CRC AB
    mData = Serial2.read();     delay(2);//wait until packet is received
    //Serial.println(mData);
    //Serial.println("*");
    if (mData == 0xAA) //head1 ok
    {
      mPkt[0] =  mData;
      mData = Serial2.read();
      if (mData == 0xc0) //head2 ok
      {
        mPkt[1] =  mData;
        mCheck = 0;
        for (i = 0; i < 6; i++) //data recv and crc calc
        {
          mPkt[i + 2] = Serial2.read();
          delay(2);
          mCheck += mPkt[i + 2];
        }
        mPkt[8] = Serial2.read();
        delay(1);
        mPkt[9] = Serial2.read();
        if (mCheck == mPkt[8]) //crc ok
        {
          Serial2.flush();
          //Serial.write(mPkt,10);

          Pm25 = (uint16_t)mPkt[2] | (uint16_t)(mPkt[3] << 8);
          Pm10 = (uint16_t)mPkt[4] | (uint16_t)(mPkt[5] << 8);
          if (Pm25 > 9999)
            Pm25 = 9999;
          if (Pm10 > 9999)
            Pm10 = 9999;
          return;
        }
      }
    }
  }
}
void handleRoot() {
 server.send(200, "text/plane", root); 
}
void handleBegin() {
  String s = MAIN_page; //Read HTML contents
  Serial.println("Client opens Website");
  server.send(200, "text/html", s); //Send web page
}
void  setup() {
  Serial.begin(112500);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }
  Serial.println("Connected to the WiFi network");
  dht.begin();
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  http.begin(node + "/mamInit?key=" + key);
  String req = "";
  int httpCode = http.POST(req);

  if (httpCode > 0) { //Check for the returning code

    mamState = http.getString();
    Serial.println(httpCode);
    Serial.println(mamState);
  }

  else {
    Serial.println("Error on HTTP request");
  }

  http.end(); //Free the resources
  server.on("/readRoot", handleRoot);
  server.on("/", handleBegin);
  server.begin();
}
void service() {
  if (millis() > time_now + period) {
    time_now = millis(); 
    float humidity = dht.readHumidity();
    float  temperature = dht.readTemperature();
    ProcessSerialData();
    Serial.print("Pm 2,5: ");
    Serial.print(Pm25);
    Serial.println(" ug/m3");
    Serial.print("Pm 10: ");
    Serial.print(Pm10);
    Serial.println(" ug/m3");
    Serial.print("Luftfeuchtigkeit: ");
    Serial.println(humidity);
    Serial.print("Temperatur: ");
    Serial.print(temperature);
    Serial.println(" °C");
    Serial.println();
    if ((WiFi.status() == WL_CONNECTED)) { //Check the current connection status
      String airdata = "";
      airdata += "{'pm25': '";
      airdata += Pm25;
      airdata += "','pm10': '";
      airdata += Pm10;
      airdata += "','temperature': '";
      airdata += temperature;
      airdata += "','humidity':'";
      airdata += humidity;
      airdata += "','geo': '";
      airdata += "49.928823,11.583642'}";
      String req = "{\"mamState\":";
      req += mamState;
      req += ", \"msg\": \"";
      Serial.println(airdata);
      req += airdata;
      req += "\"}";


      http.begin(node + "/mamSend");
      http.addHeader("Content-Type", "application/json");
      
      int httpCode = http.POST(req);

      if (httpCode == 200) { //Check for the returning code
        String output;
        output = http.getString();
        JSONVar myObject = JSON.parse(output);
        if (JSON.typeof(myObject) != "undefined") {
          if (myObject.hasOwnProperty("root")) {
            root = (String) JSON.stringify(myObject["root"]);
             
          }
          else {
            Serial.println("no root");
          }
          if (myObject.hasOwnProperty("mamState")) {
            mamState = JSON.stringify(myObject["mamState"]);
          }
          else {
            Serial.println("no mamState");
          }
        }
        Serial.print("MAM:  ");
        Serial.println(mamState);
        Serial.println(httpCode);
      }

      else {
        Serial.println("Error on HTTP request");
      }

      http.end(); //Free the resources
    }
  }
}
void loop() {
  server.handleClient();
  service();
 
}
