#include <ArduinoIoTCloud.h>
#include <Arduino_ConnectionHandler.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>

// Cloud configuration details
const char THING_ID[] = "b5c1aece-8e11-4351-b160-432c9722b2af";
const char DEVICE_LOGIN_NAME[] = "bdd892bd-f43e-4e82-8562-350117fc70ea";
const char DEVICE_KEY[] = "dTLl!1nzzxLz@0LPOpHpm4v#b";


// Network credentials
#define SECRET_SSID "Narzo"
#define SECRET_PASS "0101010101"

// MQTT broker credentials
const char* mqttServer = "faf8ea67d34245ff9ab5e0e4241c3d58.s1.eu.hivemq.cloud";
const int mqttPort = 8883; // Secure port for MQTT
const char* mqttUser = "farhaan114";
const char* mqttPassword = "sudopw";
const char* mqttTopic1 = "home/device1/control";
const char* mqttTopic2 = "home/device2/control";

// Define GPIO pins for relays and switches
#define RelayPin1 5  // GPIO for Relay 1
#define RelayPin2 4  // GPIO for Relay 2
#define SwitchPin1 26 // GPIO for Switch 1
#define SwitchPin2 33  // GPIO for Switch 2
#define wifiLed 16    // Built-in LED

int toggleState_1 = 0;
int toggleState_2 = 0;

WiFiClientSecure wifiClient;
PubSubClient client(wifiClient);
CloudSwitch switch1;
CloudSwitch switch2;

void relayOnOff(int relay) {
  if (relay == 1) {
    toggleState_1 = !toggleState_1;
    digitalWrite(RelayPin1, toggleState_1 ? LOW : HIGH);
    Serial.println(toggleState_1 ? "Device1 ON" : "Device1 OFF");
  } else if (relay == 2) {
    toggleState_2 = !toggleState_2;
    digitalWrite(RelayPin2, toggleState_2 ? LOW : HIGH);
    Serial.println(toggleState_2 ? "Device2 ON" : "Device2 OFF");
  }
  delay(100);
}

void manual_control() {
  if (digitalRead(SwitchPin1) == LOW) {
    delay(200);
    relayOnOff(1);
  }
  if (digitalRead(SwitchPin2) == LOW) {
    delay(200);
    relayOnOff(2);
  }
}

void onSwitch1Change() {
  digitalWrite(RelayPin1, switch1 ? LOW : HIGH);
  Serial.println(switch1 ? "Device1 ON (from Cloud)" : "Device1 OFF (from Cloud)");
}

void onSwitch2Change() {
  digitalWrite(RelayPin2, switch2 ? LOW : HIGH);
  Serial.println(switch2 ? "Device2 ON (from Cloud)" : "Device2 OFF (from Cloud)");
}

void initProperties() {
  ArduinoCloud.setBoardId(DEVICE_LOGIN_NAME);
  ArduinoCloud.setSecretDeviceKey(DEVICE_KEY);
  ArduinoCloud.setThingId(THING_ID);
  ArduinoCloud.addProperty(switch1, READWRITE, ON_CHANGE, onSwitch1Change);
  ArduinoCloud.addProperty(switch2, READWRITE, ON_CHANGE, onSwitch2Change);
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  if (String(topic) == mqttTopic1) {
    if (message == "ON") relayOnOff(1);
    else if (message == "OFF") relayOnOff(1);
  } else if (String(topic) == mqttTopic2) {
    if (message == "ON") relayOnOff(2);
    else if (message == "OFF") relayOnOff(2);
  }
}

void connectToMqtt() {
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("ArduinoClient", mqttUser, mqttPassword)) {
      Serial.println("Connected to MQTT Broker");
      client.subscribe(mqttTopic1);
      client.subscribe(mqttTopic2);
    } else {
      Serial.print("MQTT connection failed, rc=");
      Serial.print(client.state());
      delay(2000);
    }
  }
}

WiFiConnectionHandler ArduinoIoTPreferredConnection(SECRET_SSID, SECRET_PASS);

void setup() {
  Serial.begin(115200);
  delay(1500);

  initProperties();
  ArduinoCloud.begin(ArduinoIoTPreferredConnection);
  setDebugMessageLevel(2);
  ArduinoCloud.printDebugInfo();

  WiFi.begin(SECRET_SSID, SECRET_PASS);
  WiFi.setAutoReconnect(true);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  wifiClient.setCACert(
"-----BEGIN CERTIFICATE-----\n"
"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\n" 
"-----END CERTIFICATE-----\n");
  client.setServer(mqttServer, mqttPort);
  client.setCallback(mqttCallback);

  pinMode(RelayPin1, OUTPUT);
  pinMode(RelayPin2, OUTPUT);
  pinMode(SwitchPin1, INPUT_PULLUP);
  pinMode(SwitchPin2, INPUT_PULLUP);
  pinMode(wifiLed, OUTPUT);
}

void loop() {
  ArduinoCloud.update();
  if (!client.connected()) {
    connectToMqtt();
  }
  client.loop();
  manual_control();
}
