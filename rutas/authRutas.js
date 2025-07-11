const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../model/usuario.js');


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    
    if (!usuario) {
      return res.redirect('/login?error=Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    
    if (!isMatch) {
      return res.redirect('/login?error=Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000
    });

    res.redirect(usuario.rol === 'admin' ? '/dashboard' : '/');
  } catch (error) {
    console.error(error);
    res.redirect('/login?error=Error en el servidor');
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/login');
});

module.exports = router;