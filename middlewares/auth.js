const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Verificar si hay token en las cookies
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).redirect('/login');
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('jwt');
    return res.status(401).redirect('/login');
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).send('Acceso denegado');
  }
};

module.exports = { authMiddleware, adminMiddleware };