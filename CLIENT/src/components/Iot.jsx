import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import mqtt from 'mqtt';
import { useNavigate } from 'react-router-dom';
import "./Iot.css";

const mqttServer = "wss://faf8ea67d34245ff9ab5e0e4241c3d58.s1.eu.hivemq.cloud:8884/mqtt";
const mqttUser = "farhaan114";
const mqttPassword = "sudopw";
const mqttTopic1 = "home/device1/control";
const mqttTopic2 = "home/device2/control";

export default function Iot() {
  const [light1, setLight1] = useState(false);
  const [light2, setLight2] = useState(false);
  const [selectedOnTime, setSelectedOnTime] = useState('');
  const [selectedOffTime, setSelectedOffTime] = useState('');
  const [selectedLight, setSelectedLight] = useState('');

// Connect to MQTT broker
const client = mqtt.connect(mqttServer, {
    username: mqttUser,
    password: mqttPassword,
    keepalive: 60, // Keep-alive interval in seconds
    reconnectPeriod: 1000,
  });


  const nav = useNavigate();


  const handleLogout = () =>{
    toast.success("Logout Successful !");
    setTimeout(()=>{nav("/")}, 2000 );
  }
  

  const sendMqttMessage = (topic, message) => {
    client.publish(topic, message, { qos: 1, retain: false }, (error) => {
        console.log("mqtt message sent!");
      if (error) console.error("Error publishing message:", error);
    });
  };

  const toggleLight1 = () => {
    const newState = !light1;
    setLight1(newState);
    sendMqttMessage(mqttTopic1, newState ? "ON" : "OFF");
  };

  const toggleLight2 = () => {
    const newState = !light2;
    setLight2(newState);
    sendMqttMessage(mqttTopic2, newState ? "ON" : "OFF");
  };

  const scheduleLights = async (event) => {
    event.preventDefault();
    
    if (!selectedOnTime || !selectedOffTime || !selectedLight) {
      toast.warning('Please select on time, off time, and choose a light');
      return;
    }

    try {
      const [onHours, onMinutes] = selectedOnTime.split(':').map(Number);
      const [offHours, offMinutes] = selectedOffTime.split(':').map(Number);
      
      const lightNumber = parseInt(selectedLight);

      const topic = lightNumber === 1 ? mqttTopic1 : mqttTopic2;

      await axios.post('http://localhost:5000/schedule', {
        onTime: `${onHours}:${onMinutes}`,
        offTime: `${offHours}:${offMinutes}`,
        lightNumber,
      });

      toast.success(`Scheduled light ${lightNumber} to turn on at ${selectedOnTime} and off at ${selectedOffTime}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to schedule lights. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>LumiSync</h1>
      <p>
        Web based control for the light (and other appliances) connected to the MQTT Broker.
      </p>
      <div style={{display:"flex", justifyContent:"flex-end"}}>
            <button onClick={handleLogout}>Logout </button>
        </div>
      <form onSubmit={scheduleLights}>
        <div className="form-container">
          <div className="form-group">
            <strong style={{display:"flex", justifyContent:"center"}}><h4>SCHEDULE YOUR LIGHTS HERE</h4></strong>
            <label>Select Light:</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="light" value="1" checked={selectedLight === '1'} onChange={() => setSelectedLight('1')} />
                <span>Light 1</span>
              </label>
              <label>
                <input type="radio" name="light" value="2" checked={selectedLight === '2'} onChange={() => setSelectedLight('2')} />
                <span>Light 2</span>
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>On Time:</label>
            <input type="time" id="on-time" required value={selectedOnTime} onChange={(e) => setSelectedOnTime(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Off Time:</label>
            <input type="time" id="off-time" required value={selectedOffTime} onChange={(e) => setSelectedOffTime(e.target.value)} />
          </div>
          <button type="submit" className="button">Schedule Lights</button>
        </div>
      </form>
      <div className="control-panel" style={{display:"flex"}}>
        <div className="light-control">
          <button onClick={toggleLight1} className={`button ${light1 ? 'on' : 'off'}`}>
            {light1 ? 'Turn Light 1 OFF' : 'Turn Light 1 ON'}
          </button>
        </div>
        <div className="light-control">
          <button onClick={toggleLight2} className={`button ${light2 ? 'on' : 'off'}`}>
            {light2 ? 'Turn Light 2 OFF' : 'Turn Light 2 ON'}
          </button>
        </div>
        
      </div>
     
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

