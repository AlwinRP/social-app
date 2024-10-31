const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Check if the authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    // Check if the Bearer token is present
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token missing from authorization header' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Set the decoded user info to req.user
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
