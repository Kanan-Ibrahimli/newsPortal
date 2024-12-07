import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/api';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from 'react-icons/ai';
import { motion } from 'framer-motion';
import Card from '../components/Card/newsCard';
import { API_URL } from '../constants/url';
import { Link } from 'react-router-dom';

function EditorDashboard({ role }) {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAscending, setSortAscending] = useState(true); // Toggle sorting order
  const [isLoading, setIsLoading] = useState(true); // Loading state for skeleton
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch articles from the API
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axiosInstance.get('/articles');
        setArticles(res.data.articles);
        setFilteredArticles(res.data.articles); // Set filtered articles initially
      } catch (error) {
        setError('Failed to fetch articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredArticles(filtered);
  };

  // Handle sort toggle
  const handleSortToggle = () => {
    const sorted = [...filteredArticles].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortAscending ? dateB - dateA : dateA - dateB;
    });
    setFilteredArticles(sorted);
    setSortAscending(!sortAscending);
  };

  const skeletonCards = Array.from({ length: 6 }); // Generate 6 placeholders for skeleton loading

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className={`${role === 'admin' ? 'mr-4' : 'ml-[10rem]'}`}>
      {/* Search and Sort Section */}
      <motion.div
        className="search-sort flex justify-between items-center p-4 bg-gray-100"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search */}
        <div className="search flex items-center bg-white border border-gray-300 rounded-lg p-2">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search articles..."
            className="outline-none bg-transparent text-gray-700 w-full px-2"
          />
          <BiSearch className="text-gray-500 text-xl" />
        </div>

        {/* Sort */}
        <div className="sort flex items-center">
          <button
            onClick={handleSortToggle}
            className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-2 text-gray-700 hover:bg-gray-200"
          >
            {sortAscending ? (
              <AiOutlineSortAscending className="text-xl" />
            ) : (
              <AiOutlineSortDescending className="text-xl" />
            )}
            <span>Sort by Date</span>
          </button>
        </div>
      </motion.div>

      {/* Card Section */}
      <div className="card-section cursor-pointer grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {isLoading
          ? skeletonCards.map((_, index) => (
              <motion.div
                key={index}
                className="w-[20rem] h-40 bg-gray-200 animate-pulse rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            ))
          : filteredArticles.map((article) => (
              <Link to={`/article/edit/${article._id}`} key={article._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    key={article._id}
                    title={article.title}
                    image={`${API_URL}/${article.images[0]}`}
                    date={new Date(article.createdAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  />
                </motion.div>
              </Link>
            ))}
      </div>
    </div>
  );
}

export default EditorDashboard;
