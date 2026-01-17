const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// CORS for Firebase Functions
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// In-memory "database" for demonstration since file system is ephemeral in Functions
// Note: In a real production app, use Firestore via firebase-admin!
let users = [];

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.get('/', (req, res) => {
    res.send('HomeAR Backend is Running on Firebase Functions');
});

// Register endpoint
app.post('/auth/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

// Login endpoint
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email }, token: 'fake-jwt-token-' + Date.now() });
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
