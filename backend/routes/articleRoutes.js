const express = require('express');
const articleController = require('../controllers/articleController');
const { authenticate } = require('../middleware/authMiddleware'); // Authenticate user
const upload = require('../middleware/multer'); // Import the multer middleware
const router = express.Router();
// Article CRUD
router.post(
  '/',
  authenticate,
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 },
  ]),
  articleController.createArticle
);
router.get('/', articleController.getArticles);
router.get('/filter', articleController.getArticlesByCategory);
router.get('/:id', articleController.getArticleById);
router.put(
  '/:id',
  authenticate,
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 },
  ]),
  articleController.updateArticle
);
router.delete('/:id', authenticate, articleController.deleteArticle);
// Comments
router.post('/:id/comments', authenticate, articleController.addComment);
router.get('/:id/comments', articleController.getComments);

module.exports = router;
