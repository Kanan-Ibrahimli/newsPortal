const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  // const token = req.header('Authorization')?.replace('Bearer ', '');

  try {
    const token = req.cookies.access_token;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};
module.exports = { authenticate };
