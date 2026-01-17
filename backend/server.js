const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
// 1) Always use ABSOLUTE PATH for users.json
const DATA_FILE = path.join(__dirname, 'users.json');

// Ensure data file exists with valid JSON
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
} else {
    try {
        const content = fs.readFileSync(DATA_FILE, 'utf8');
        if (!content.trim()) {
            fs.writeFileSync(DATA_FILE, JSON.stringify([]));
        } else {
            JSON.parse(content); // Test parse
        }
    } catch (e) {
        console.error("Corrupt users.json found, resetting to empty array.");
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
}

// 2) Ensure Express middleware exists
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Helper to read users
const readUsers = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Helper to write users
const writeUsers = (users) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ ok: true });
});

app.get('/', (req, res) => {
    res.send('HomeAR Backend is Running');
});

// 3) Implement POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = readUsers();

    if (users.find(u => u.email === normalizedEmail)) {
        return res.status(409).json({ message: 'Email already registered' });
    }

    const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password: password, // In a real app, hash this!
        plan: 'free',
        createdAt: Date.now()
    };

    users.push(newUser);
    writeUsers(users);

    // Log success as requested
    console.log("User saved:", normalizedEmail);

    // Return user without password
    const { password: _, ...userSafe } = newUser;
    res.status(201).json({ message: 'User registered successfully', user: userSafe, token: 'dummy-token-' + newUser.id });
});

// 4) Implement POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = readUsers();
    const user = users.find(u => u.email === normalizedEmail && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'User not found. Please sign up first.' });
    }

    // Return user without password
    const { password: _, ...userSafe } = user;
    res.json({
        message: 'Login successful',
        user: userSafe,
        token: 'dummy-token-' + user.id
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
