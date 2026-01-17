const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// users.json path must be absolute
const USERS_FILE = path.join(__dirname, "users.json");

// Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://home-ar-app.vercel.app" // Add your vercel domain here
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || true) { // allowing all for dev simplicity/demo, but prioritizing robustness
            return callback(null, true);
        } else {
            return callback(null, true);
        }
    },
    credentials: true
}));

// Helper to read users
const readUsers = () => {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            return [];
        }
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error("Error reading users file:", err);
        return [];
    }
};

// Helper to write users
const writeUsers = (users) => {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (err) {
        console.error("Error writing users file:", err);
    }
};

// GET /health
app.get('/health', (req, res) => {
    res.json({ ok: true });
});

// GET /api/users (For suggestions)
app.get('/api/users', (req, res) => {
    const users = readUsers();
    // Return only safe info (id, name, email)
    const safeUsers = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email
    }));
    res.json(safeUsers);
});

// POST /api/auth/signup
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ ok: false, message: "Missing required fields" });
    }

    const users = readUsers();
    const normalizedEmail = email.toLowerCase().trim();

    if (users.find(u => u.email.toLowerCase() === normalizedEmail)) {
        return res.status(409).json({ ok: false, message: "Email already exists" });
    }

    const newUser = {
        id: Date.now(),
        name,
        email: normalizedEmail,
        password, // In real app, hash this
        plan: 'free',
        createdAt: Date.now()
    };

    users.push(newUser);
    writeUsers(users);

    console.log(`New user created: ${normalizedEmail}`);
    res.json({ ok: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ ok: false, message: "Missing email or password" });
    }

    const users = readUsers();
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password);

    if (!user) {
        return res.status(401).json({ ok: false, message: "Invalid email or password" });
    }

    // Return user info (exclude password)
    const { password: _, ...userSafe } = user;

    res.json({
        ok: true,
        user: userSafe
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
