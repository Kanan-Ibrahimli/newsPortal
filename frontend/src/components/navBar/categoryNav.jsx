import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import axios from 'axios';
import { API_URL } from '../../constants/url';

const Nav = () => {
  const scrollRef = useRef(null);
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const visibleCount = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/articles`);
        const articles = response.data.articles;

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(articles.map((article) => article.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handlePrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -=
        scrollRef.current.offsetWidth / visibleCount;
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft +=
        scrollRef.current.offsetWidth / visibleCount;
    }
  };

  // Get the current category from the URL
  const activeCategory = location.pathname.split('/').pop();

  return (
    <nav className="bg-gray-100 shadow-sm py-3">
      <div className="flex items-center justify-between px-6 max-w-screen-xl mx-auto">
        {/* Prev Button */}
        {categories.length > visibleCount && (
          <button
            className="p-2 bg-white shadow rounded-full hover:bg-gray-200 focus:outline-none"
            onClick={handlePrev}
            aria-label="Scroll left"
          >
            <AiOutlineLeft className="text-lg text-gray-600" />
          </button>
        )}

        {/* Categories List */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 py-2 w-full"
          style={{ scrollBehavior: 'smooth' }}
        >
          {categories.map((category, index) => {
            // Normalize category and activeCategory to lowercase
            const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
            const isActive = activeCategory.toLowerCase() === categorySlug;

            return (
              <Link
                key={index}
                to={`/articles/${categorySlug}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-primary shadow'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-200'
                }`}
              >
                {category}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {categories.length > visibleCount && (
          <button
            className="p-2 bg-white shadow rounded-full hover:bg-gray-200 focus:outline-none"
            onClick={handleNext}
            aria-label="Scroll right"
          >
            <AiOutlineRight className="text-lg text-gray-600" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
