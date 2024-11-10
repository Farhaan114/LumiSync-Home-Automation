const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mqtt = require('mqtt');
const cron = require('node-cron');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});

// MQTT Broker details
const mqttServer = "wss://faf8ea67d34245ff9ab5e0e4241c3d58.s1.eu.hivemq.cloud:8884/mqtt";
const mqttUser = "farhaan114";
const mqttPassword = "sudopw";
const mqttTopic1 = "home/device1/control";
const mqttTopic2 = "home/device2/control";

// Connect to MQTT Broker
const client = mqtt.connect(mqttServer, {
  username: mqttUser,
  password: mqttPassword,
  connectTimeout: 30 * 1000,  // Set connection timeout to 30 seconds
  keepalive: 60,              // MQTT keepalive in seconds
  reconnectPeriod: 5000,      // Attempt reconnection every 5 seconds
  protocolId: 'MQTT',
  protocolVersion: 4,         // Set MQTT protocol version, 4 is standard
});

client.on('connect', () => {
  console.log('Connected to MQTT Broker');
  client.subscribe([mqttTopic1, mqttTopic2], (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Successfully subscribed to topics');
    }
  });
});

client.on('error', (error) => {
  console.error('MQTT Connection Error:', error);
});

client.on('reconnect', () => {
  console.log('Attempting to reconnect to MQTT Broker...');
});

client.on('offline', () => {
  console.log('MQTT Client is offline');
});

client.on('close', () => {
  console.log('MQTT Connection closed');
});
// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Helper function to schedule MQTT messages
function scheduleLightAction(time, topic, action) {
  const [hours, minutes] = time.split(':').map(Number);
  cron.schedule(`${minutes} ${hours % 24} * * *`, () => {
    client.publish(topic, action, (error) => {
      if (error) {
        console.error(`Failed to send ${action} to ${topic}:`, error);
      } else {
        console.log(`Sent ${action} to ${topic} at ${time}`);
      }
    });
  });
}

// Authentication Endpoints

// Register Route
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const checkUserSql = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserSql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length > 0) return res.status(400).json({ error: 'Username already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const insertUserSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(insertUserSql, [username, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to register user' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful login
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user.id });
  });
});

// IoT Scheduling Endpoint
app.post('/schedule', (req, res) => {
  const { onTime, offTime, lightNumber } = req.body;

  const topic = parseInt(lightNumber) === 1 ? mqttTopic1 : mqttTopic2;

  // Schedule 'on' and 'off' actions
  scheduleLightAction(onTime, topic, 'ON');
  scheduleLightAction(offTime, topic, 'OFF');

  res.status(200).json({ message: `Scheduled light ${lightNumber} to turn on at ${onTime} and off at ${offTime}` });
});

// Test route
app.get('/test', (req, res) => {
  res.send("Test route works!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
