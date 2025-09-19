const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Ensure data directory and users file exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, JSON.stringify([]));

function readUsers() {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    try { return JSON.parse(raw); } catch (_) { return []; }
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Auth routes
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
        const users = readUsers();
        const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) return res.status(409).json({ message: 'Email already registered' });
        const passwordHash = await bcrypt.hash(password, 10);
        const user = { id: Date.now().toString(), name, email, role: role || 'student', passwordHash };
        users.push(user);
        writeUsers(users);
        return res.status(201).json({ message: 'Account created' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = readUsers();
        const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ message: 'Invalid email or password' });
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

function auth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (_) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

app.get('/api/me', auth, (req, res) => {
    const users = readUsers();
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    return res.json({ 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        profile: user.profile || {}
    });
});

// Profile management endpoints
app.get('/api/profile', auth, (req, res) => {
    try {
        const users = readUsers();
        const user = users.find(u => u.id === req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const profile = user.profile || {
            avatar: '',
            bio: '',
            location: '',
            phone: '',
            socialLinks: {
                github: '',
                linkedin: '',
                twitter: ''
            },
            education: [],
            skills: [],
            badges: [],
            certifications: [],
            stats: {
                projectsCompleted: 0,
                hoursCoded: 0,
                connections: 0
            },
            joinDate: user.joinDate || new Date().toISOString()
        };
        
        return res.json(profile);
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/profile', auth, (req, res) => {
    try {
        const { avatar, bio, location, phone, socialLinks, education, skills, stats } = req.body;
        const users = readUsers();
        const userIndex = users.findIndex(u => u.id === req.user.id);
        
        if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
        
        // Initialize profile if it doesn't exist
        if (!users[userIndex].profile) {
            users[userIndex].profile = {};
        }
        
        // Update profile fields
        if (avatar !== undefined) users[userIndex].profile.avatar = avatar;
        if (bio !== undefined) users[userIndex].profile.bio = bio;
        if (location !== undefined) users[userIndex].profile.location = location;
        if (phone !== undefined) users[userIndex].profile.phone = phone;
        if (socialLinks !== undefined) users[userIndex].profile.socialLinks = socialLinks;
        if (education !== undefined) users[userIndex].profile.education = education;
        if (skills !== undefined) users[userIndex].profile.skills = skills;
        if (stats !== undefined) users[userIndex].profile.stats = stats;
        
        writeUsers(users);
        return res.json({ message: 'Profile updated successfully', profile: users[userIndex].profile });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get profile completion percentage
app.get('/api/profile/completion', auth, (req, res) => {
    try {
        const users = readUsers();
        const user = users.find(u => u.id === req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const profile = user.profile || {};
        let completion = 0;
        const totalFields = 8;
        
        // Check completion of key fields
        if (profile.avatar) completion++;
        if (profile.bio) completion++;
        if (profile.location) completion++;
        if (profile.phone) completion++;
        if (profile.socialLinks && (profile.socialLinks.github || profile.socialLinks.linkedin || profile.socialLinks.twitter)) completion++;
        if (profile.education && profile.education.length > 0) completion++;
        if (profile.skills && profile.skills.length > 0) completion++;
        if (profile.stats && (profile.stats.projectsCompleted > 0 || profile.stats.hoursCoded > 0)) completion++;
        
        const percentage = Math.round((completion / totalFields) * 100);
        return res.json({ completion: percentage });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});
// Save user score (highest score kept)
app.post('/api/score', auth, (req, res) => {
    const { score } = req.body;
    if (typeof score !== 'number') {
        return res.status(400).json({ message: 'Score must be a number' });
    }

    const users = readUsers();
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Save only the highest score
    user.score = Math.max(user.score || 0, score);
    writeUsers(users);

    res.json({ message: 'Score saved', score: user.score });
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
    const users = readUsers();
    const leaderboard = users
        .map(u => ({ id: u.id, name: u.name, score: u.score || 0 }))
        .sort((a, b) => b.score - a.score);
    res.json(leaderboard);
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


