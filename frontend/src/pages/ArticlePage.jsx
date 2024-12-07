import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/api';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
  FaTelegramPlane,
} from 'react-icons/fa';
import { API_URL } from '../constants/url';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayedComments, setDisplayedComments] = useState(5); // Limit displayed comments
  const [commentAdded, setCommentAdded] = useState(false); // Indicate successful comment submission
  const navigate = useNavigate();

  // Fetch article details and comments
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axiosInstance.get(`/articles/${id}`);
        setArticle(res.data);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axiosInstance.get(`/articles/${id}/comments/`);
        setComments(res.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchArticle();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async () => {
    try {
      const res = await axiosInstance.post(`/articles/${id}/comments/`, {
        comment: newComment,
      });
      setComments((prevComments) => [...prevComments, res.data]); // Add new comment to the list
      setNewComment(''); // Clear input
      setCommentAdded(true); // Indicate successful addition

      setTimeout(() => {
        setCommentAdded(false);
        window.location.reload(); // Reload the page after successful comment submission
      }, 2000); // Delay to show success message
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/auth/login');
      } else {
        console.error('Error submitting comment:', error);
      }
    }
  };

  // Handle next and previous image
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex + 1 < article.images.length ? prevIndex + 1 : 0
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex - 1 >= 0 ? prevIndex - 1 : article.images.length - 1
    );
  };

  // Load more comments
  const handleLoadMoreComments = () => {
    setDisplayedComments((prev) => prev + 5);
  };

  if (!article) return <div>Loading...</div>;

  return (
    <div className="w-3/4 h-full bg-white text-gray-800">
      {/* Article Header */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        {article.images.length > 0 && (
          <div className="relative w-full h-full">
            <img
              src={`${API_URL}/${article.images[currentImageIndex]}`}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
              onClick={handlePrevImage}
            >
              <AiOutlineLeft />
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
              onClick={handleNextImage}
            >
              <AiOutlineRight />
            </button>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <div className="text-gray-600 text-sm mb-4">
          Published: {new Date(article.createdAt).toLocaleDateString()} |
          Author: {article.author.name}
        </div>
        <p className="mb-6">{article.content}</p>

        {/* Videos */}
        {article.videos.length > 0 && (
          <div className="my-6">
            {article.videos.map((video, index) => (
              <video
                key={index}
                controls
                src={`${API_URL}/${video}`}
                className="w-full h-auto mb-4"
              />
            ))}
          </div>
        )}
      </div>
      <section className="social-media px-6 py-4 bg-gray-50">
        <h2 className="text-xl font-bold mb-4">Share this article</h2>
        <div className="flex space-x-4">
          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 bg-blue-100 p-3 rounded-full hover:bg-blue-600 hover:text-white transition duration-300"
          >
            <FaFacebookF size={20} />
          </a>

          {/* Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${article.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 bg-blue-100 p-3 rounded-full hover:bg-blue-400 hover:text-white transition duration-300"
          >
            <FaTwitter size={20} />
          </a>

          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${article.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 bg-blue-100 p-3 rounded-full hover:bg-blue-700 hover:text-white transition duration-300"
          >
            <FaLinkedinIn size={20} />
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `${article.title} - ${window.location.href}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 bg-green-100 p-3 rounded-full hover:bg-green-600 hover:text-white transition duration-300"
          >
            <FaWhatsapp size={20} />
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?url=${window.location.href}&text=${article.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 bg-blue-100 p-3 rounded-full hover:bg-blue-500 hover:text-white transition duration-300"
          >
            <FaTelegramPlane size={20} />
          </a>
        </div>
      </section>
      {/* Comment Section */}
      <div className="px-6 py-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>

        {/* Comments List */}
        <div className="space-y-4 mb-6">
          {comments?.slice(0, displayedComments).map((comment, index) => (
            <div
              key={comment._id || `comment-${index}`}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="text-sm font-bold">{comment.user?.name}</div>
              <div className="text-gray-600 text-sm">
                {new Date(comment.createdAt).toLocaleString()}
              </div>
              <p className="mt-2">{comment.comment}</p>
            </div>
          ))}
          {comments.length > displayedComments && (
            <button
              onClick={handleLoadMoreComments}
              className="text-primary hover:underline"
            >
              See More
            </button>
          )}
        </div>

        {/* Add Comment */}
        <div className="flex items-center space-x-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none"
          />
          <button
            onClick={handleCommentSubmit}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-80"
          >
            Submit
          </button>
        </div>
        {commentAdded && (
          <div className="text-green-600 mt-2">Comment added successfully!</div>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
