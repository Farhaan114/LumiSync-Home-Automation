# IoT Lighting Control System with Alexa Integration
This project is a web-based IoT lighting control system that lets users control lights through Node.js, MQTT, and Arduino Cloud. It offers remote control, scheduling, and Alexa-based voice control for a convenient smart home setup.

## Features
- Alexa Voice Commands: Use voice commands through Alexa to turn lights on/off via Arduino Cloud integration.
- Remote Light Control: Control lights through a web interface using MQTT for efficient, real-time communication.
- Scheduling: Set lights to turn on/off automatically at specified times.
- Secure Authentication: User login and registration with JWT-based security.
## Technology Stack
- Backend: Node.js, Express, MySQL
- Messaging Protocol: MQTT (using HiveMQ broker)
- Alexa Integration: Arduino Cloud, enabling Alexa to send commands to MQTT topics
- Scheduling: Node-cron for timed light control
## Usage Overview
- Control Lights: Remotely turn lights on/off or schedule them using web or Alexa voice commands.
- Voice Integration: Use Alexa to control lights via Arduino Cloud, with messages sent to the MQTT broker for seamless IoT communication.
This setup showcases how to integrate Alexa with IoT systems for efficient and flexible smart home lighting control.

## Prototype Setup
- ![WhatsApp Image 2024-11-09 at 21 36 33_d99c8f70](https://github.com/user-attachments/assets/8c88d2dc-f9ea-410c-aaec-7f344670df99)

## Web App 
- Login page ![WhatsApp Image 2024-11-09 at 21 35 43_ca651da9](https://github.com/user-attachments/assets/70460596-bce6-4e0d-9541-363998839739)
- Light Control Dashboard ![WhatsApp Image 2024-11-09 at 21 35 43_6ecf5f4d](https://github.com/user-attachments/assets/34b88764-2d72-455b-bf30-02e2568d9dfe)
- Light Scheduling ![WhatsApp Image 2024-11-09 at 21 35 43_5e0572c6](https://github.com/user-attachments/assets/f2d2aa58-7777-4a9c-a478-6d270159387c)

## Future Scope
### **1. Enhanced Customization and Flexibility :**
- Modular Device Compatibility: Expand support for different smart home devices beyond lights, like fans, thermostats, or home security systems, making it a full smart home hub.
= User-defined Scenes and Routines: Allow users to create custom routines (e.g., "Goodnight" routine to turn off all lights) and specific scenes with light settings and device control according to their needs.
### **2. Advanced User Interface and Analytics :**
- Real-Time Monitoring and Control Dashboard: Create an advanced dashboard showing real-time device status, energy usage, and customizable control options. This would differentiate it from Alexa's app, which might not provide as detailed analytics.
- Usage Analytics: Offer insights on energy usage, peak activity times, and efficiency recommendations to help users better understand and control their home environment.

### **3. Broad Compatibility and Integration :**
Multi-Protocol Support (Zigbee, Z-Wave, Wi-Fi): Support additional IoT protocols, like Zigbee or Z-Wave, to enable compatibility with a broader range of smart devices, making it an attractive centralized solution.
Interoperability with Existing Smart Home Systems: Offer seamless integration with other popular platforms (e.g., Apple HomeKit) so users can mix and match devices without being locked into one ecosystem.
