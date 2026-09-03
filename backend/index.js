// Entry point for SWENG 861 CRUD project

const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const { initializeDatabase, upsertUser, findUserById } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const googleConfigured = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set in production');
}

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

if (googleConfigured) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || `http://localhost:${PORT}/auth/callback`
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      done(null, await upsertUser(profile));
    } catch (error) {
      done(error);
    }
  }));
}

passport.serializeUser((user, done) => done(null, user.providerId));
passport.deserializeUser(async (id, done) => {
  try {
    done(null, await findUserById(id));
  } catch (error) {
    done(error);
  }
});

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'development-only-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/dashboard', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dashboard.html'));
});

app.get('/dashboard.js', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dashboard.js'));
});

function requireAuth(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Valid login is required'
    });
  }
  next();
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/auth/login', (req, res, next) => {
  if (!googleConfigured) {
    return res.status(503).json({ error: 'Google OAuth is not configured' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/auth/callback', (req, res, next) => {
  if (!googleConfigured) {
    return res.status(503).json({ error: 'Google OAuth is not configured' });
  }
  passport.authenticate('google', { failureRedirect: '/auth/login' })(req, res, () => {
    res.redirect('/dashboard');
  });
});

app.post('/auth/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);
    res.json({ message: 'Logged out' });
  });
});

app.get('/api/hello', requireAuth, (req, res) => {
  res.json({ message: `Hello, ${req.user.email || req.user.name || 'user'}!` });
});

initializeDatabase()
  .then(() => app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }))
  .catch((error) => {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  });
