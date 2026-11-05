require('dotenv').config();
const jwt = require('jsonwebtoken');
const rol = process.argv[2] || 'admin';
const sub = process.argv[3] || '1';
console.log(jwt.sign({ sub, email: `${rol}@test.com`, rol }, process.env.JWT_SECRET, { expiresIn: '8h' }));
