const express = require('express');
const fs      = require('fs');
const path    = require('path');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const multer  = require('multer');

const PORT       = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const DATA_DIR   = path.join(__dirname, 'data');
const UPLOADS    = path.join(__dirname, 'uploads');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(path.join(UPLOADS, 'avatars'), { recursive: true });

const usersFile = path.join(DATA_DIR, 'users.json');
if (!fs.existsSync(usersFile) || fs.readFileSync(usersFile, 'utf-8').trim() === '') {
  fs.writeFileSync(usersFile, '[]');
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOADS));

const upload = multer({ dest: path.join(UPLOADS, 'avatars') });

function readJson(f) {
  try {
    const txt = fs.readFileSync(f, 'utf-8').trim() || '[]';
    return JSON.parse(txt);
  } catch {
    fs.writeFileSync(f, '[]');
    return [];
  }
}

function writeJson(f, data) {
  fs.writeFileSync(f, JSON.stringify(data, null, 2));
}

function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    req.user = jwt.verify(h.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const users = readJson(usersFile);
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'Username taken' });
  }
  const hash = await bcrypt.hash(password, 10);
  users.push({
    username,
    email,
    passwordHash: hash,
    avatar:    null,
    createdAt: new Date().toISOString(),
    name:      '',
    bio:       '',
    dob:       ''
  });
  writeJson(usersFile, users);
  res.json({ message: 'Registered' });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readJson(usersFile);
  const user  = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (!await bcrypt.compare(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

app.get('/api/profile/me', auth, (req, res) => {
  const users = readJson(usersFile);
  const u     = users.find(x => x.username === req.user.username);
  if (!u) return res.status(404).json({ error: 'Not found' });
  res.json({
    username:  u.username,
    name:      u.name,
    email:     u.email,
    bio:       u.bio,
    dob:       u.dob,
    avatar:    u.avatar,
    createdAt: u.createdAt
  });
});

app.put('/api/profile/me', auth, upload.single('avatar'), (req, res) => {
  const users = readJson(usersFile);
  const u     = users.find(x => x.username === req.user.username);
  if (!u) return res.status(404).json({ error: 'Not found' });

  if (req.file) {
    u.avatar = `/uploads/avatars/${req.file.filename}`;
  }
  if (req.body.name  !== undefined) u.name  = req.body.name;
  if (req.body.bio   !== undefined) u.bio   = req.body.bio;
  if (req.body.dob   !== undefined) u.dob   = req.body.dob;
  if (req.body.email !== undefined) u.email = req.body.email;

  writeJson(usersFile, users);
  res.json({ message: 'Profile updated' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/api/profile/me/posts', auth, (req, res) => {
  const posts = readJson(path.join(DATA_DIR, 'posts.json'));
  const userPosts = posts.filter(p => p.username === req.user.username);
  res.json(userPosts);
});