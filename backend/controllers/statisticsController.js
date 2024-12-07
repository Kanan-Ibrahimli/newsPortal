const User = require('../models/User'); // Adjust path as needed
const Article = require('../models/Article');

// Controller for fetching statistics
exports.getStatistics = async (req, res) => {
  try {
    // Count of users
    const userCount = await User.countDocuments();

    // Count of total articles
    const totalArticlesCount = await Article.countDocuments();

    // Count of articles by category
    const articlesByCategory = await Article.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        userCount,
        totalArticlesCount,
        articlesByCategory,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};
