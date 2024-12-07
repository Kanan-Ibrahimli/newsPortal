const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).send({ error: 'Access denied.' });
  next();
};

const editorMiddleware = (req, res, next) => {
  if (!['admin', 'editor'].includes(req.user.role))
    return res.status(403).send({ error: 'Access denied.' });
  next();
};

module.exports = { adminMiddleware, editorMiddleware };
