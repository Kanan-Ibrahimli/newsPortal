const Article = require('../models/Article');
// Create an article

exports.createArticle = async (req, res) => {
  try {
    const { title, content, category, tags, published } = req.body;
    const author = req.user._id;
    // Collect file paths for images and videos
    const images = req.files.images
      ? req.files.images.map((file) => file.path)
      : [];
    const videos = req.files.videos
      ? req.files.videos.map((file) => file.path)
      : [];

    const article = new Article({
      title,
      content,
      category,
      tags,
      images,
      videos,
      author,
      published,
      publishedAt: published ? new Date() : null,
    });

    await article.save();
    res.status(201).json({ message: 'Article created successfully', article });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to create article', details: error.message });
  }
};

// Update an article
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags, published } = req.body;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    // Collect file paths for new images/videos
    const images = req.files.images
      ? req.files.images.map((file) => file.path)
      : [];
    const videos = req.files.videos
      ? req.files.videos.map((file) => file.path)
      : [];

    // Update fields
    article.title = title || article.title;
    article.content = content || article.content;
    article.category = category || article.category;
    article.tags = tags || article.tags;
    article.images = [...article.images, ...images];
    article.videos = [...article.videos, ...videos];
    article.published = published !== undefined ? published : article.published;
    article.publishedAt =
      published && !article.published ? new Date() : article.publishedAt;

    await article.save();
    res.status(200).json({ message: 'Article updated successfully', article });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to update article', details: error.message });
  }
};

// Get all articles with pagination
exports.getArticles = async (req, res) => {
  try {
    // Extract query parameters for pagination
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 articles per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    // Fetch articles with pagination
    const articles = await Article.find()
      .populate('author', 'name email')
      .populate('comments.user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total articles for pagination metadata
    const totalArticles = await Article.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalArticles / limit);

    res.status(200).json({
      articles,
      pagination: {
        currentPage: page,
        totalPages,
        totalArticles,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch articles', details: error.message });
  }
};

// Get a single article by ID
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id)
      .populate('author', 'name email')
      .populate('comments.user', 'name email');

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.status(200).json(article);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch article', details: error.message });
  }
};

// Delete an article
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (article.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: 'You are not authorized to delete this article' });
    }

    await article.deleteOne();
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to delete article', details: error.message });
  }
};

// Add a comment to an article
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params; // Article ID
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const newComment = {
      user: req.user._id, // Assuming req.user is set by authMiddleware
      comment,
    };

    article.comments.push(newComment);
    await article.save();

    res
      .status(201)
      .json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to add comment', details: error.message });
  }
};

// Retrieve comments for an article
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params; // Article ID

    const article = await Article.findById(id).populate(
      'comments.user',
      'name email'
    );
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.status(200).json(article.comments);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Failed to fetch comments', details: error.message });
  }
};
// Get articles by category
exports.getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Perform a case-insensitive search using regex
    const articles = await Article.find({
      category: { $regex: new RegExp(`^${category}$`, 'i') }, // Case-insensitive match
    });

    if (articles.length === 0) {
      return res
        .status(404)
        .json({ message: `No articles found for category: ${category}` });
    }

    return res.status(200).json({ success: true, articles });
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
};
