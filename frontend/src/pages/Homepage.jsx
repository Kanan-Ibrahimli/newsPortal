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

function Homepage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAscending, setSortAscending] = useState(true); // Toggle sorting order
  const [heroIndex, setHeroIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Loading state for skeleton

  useEffect(() => {
    // Fetch articles from the API
    const fetchArticles = async () => {
      try {
        const res = await axiosInstance.get('/articles');
        setArticles(res.data.articles);
        setFilteredArticles(res.data.articles); // Set filtered articles initially
        setIsLoading(false); // Disable loading once articles are fetched
      } catch (error) {
        console.error('Error fetching articles:', error);
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Handle hero section image slider
  const handlePrevImage = () => {
    setHeroIndex((prevIndex) =>
      prevIndex === 0 ? articles[0]?.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setHeroIndex((prevIndex) => (prevIndex + 1) % articles[0]?.images.length);
  };

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

  const skeletonCards = Array.from({ length: 6 });

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section flex flex-col items-center justify-center relative mx-auto max-w-6xl h-[50vh]">
        {isLoading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : (
          articles[0] && (
            <>
              <motion.div
                className="relative w-full h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={`${API_URL}/${articles[0].images[heroIndex]}`}
                  alt="Hero News"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute bottom-8 left-8 text-white z-10">
                  <h1 className="text-3xl font-bold">{articles[0].title}</h1>
                  <p className="text-lg">
                    {new Date(articles[0].createdAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                </div>
                {/* Prev and Next Icons */}
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
                  onClick={handlePrevImage}
                >
                  <AiOutlineLeft />
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-80"
                  onClick={handleNextImage}
                >
                  <AiOutlineRight />
                </button>
              </motion.div>
            </>
          )
        )}
      </div>

      {/* Search and Sort Section */}
      <motion.div
        className="search-sort flex justify-between items-center p-4 bg-gray-100"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search */}
        <div className="search mt-8 flex items-center bg-white border border-gray-300 rounded-lg p-2">
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
              <div
                key={index}
                className="w-[20rem] h-40 bg-gray-200 animate-pulse rounded-lg"
              />
            ))
          : filteredArticles.map((article) => (
              <Link to={`/article/${article._id}`} key={article._id}>
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

export default Homepage;
