const jwt = require('jsonwebtoken');

exports.identifier = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);

  if (!authHeader || !authHeader.includes('Bearer')) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer', '').trim();
  console.log('Extracted Token:', token);

  try {
    const jwtVerified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = jwtVerified;
    next();
  } catch (error) {
    console.error('JWT Error:', error.message);
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};