import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import { API_URL } from '../constants/url';
import axiosInstance from '../api/api';

const categories = [
  'Politics',
  'Business',
  'Agriculture',
  'Sports',
  'Entertainment',
  'Opinion',
  'Technology',
  'Health',
  'Science',
  'Travel',
  'Education',
  'Fashion',
  'Lifestyle',
  'Music',
  'Art',
  'Food',
  'Movies',
  'Automotive',
  'Gaming',
  'Books',
];

const ArticleEditorPage = () => {
  const { id } = useParams(); // Get the article ID from the URL
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axiosInstance.get(`/articles/${id}`);
        const article = response.data;
        setValue('title', article.title);
        setValue('content', article.content);
        setValue('category', article.category);
        setValue('published', article.published);
        setTags(article.tags || []);
        setImages(
          (article.images || []).map((url) => ({
            preview: `${API_URL}/${url}`,
            isExisting: true, // Mark as existing image
          }))
        );
        setVideos(
          (article.videos || []).map((url) => ({
            preview: url,
            isExisting: true, // Mark as existing video
          }))
        );
      } catch (error) {
        console.error('Error fetching article:', error);
        alert('Failed to fetch article data.');
      }
    };

    fetchArticle();
  }, [id, setValue]);

  // Handle image upload
  const onDropImages = (acceptedFiles) => {
    if (images.length + acceptedFiles.length > 5) {
      alert('You can upload up to 5 images.');
      return;
    }
    setImages([
      ...images,
      ...acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      ),
    ]);
  };

  // Handle video upload
  const onDropVideos = (acceptedFiles) => {
    if (videos.length + acceptedFiles.length > 2) {
      alert('You can upload up to 2 videos.');
      return;
    }
    setVideos([
      ...videos,
      ...acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      ),
    ]);
  };

  // Handle tag input
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue && tags.length < 5) {
        setTags([...tags, inputValue]);
        setInputValue('');
      } else if (tags.length >= 5) {
        alert('You can only add up to 5 tags.');
      }
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({
      accept: 'image/*',
      onDrop: onDropImages,
    });

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } =
    useDropzone({
      accept: 'video/*',
      onDrop: onDropVideos,
    });

  // Submit handler
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category);
    formData.append('tags', tags);
    formData.append('published', data.published);

    images.forEach((image) => {
      formData.append('images', image);
    });

    videos.forEach((video) => {
      formData.append('videos', video);
    });

    try {
      setLoading(true);
      await axiosInstance.put(`/articles/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Article updated successfully!');
      reset();
      navigate('/');
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Failed to update article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-3/4 mx-auto p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="text-red-500">{errors.category.message}</span>
          )}
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            {...register('title', { required: 'Title is required' })}
            type="text"
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter the article title"
          />
          {errors.title && (
            <span className="text-red-500">{errors.title.message}</span>
          )}
        </div>

        {/* Content */}
        <div className="mb-4">
          <label className="block text-gray-700">Content</label>
          <textarea
            {...register('content', { required: 'Content is required' })}
            className="w-full px-4 py-2 border rounded"
            rows="6"
            placeholder="Write the article content"
          />
          {errors.content && (
            <span className="text-red-500">{errors.content.message}</span>
          )}
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Tags (up to 5)
          </label>
          <div className="flex flex-wrap items-center gap-2 border p-3 rounded">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-200 text-blue-700 px-3 py-1 rounded-lg flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-2 text-red-500 font-bold"
                >
                  x
                </button>
              </span>
            ))}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className="flex-1 outline-none"
              placeholder="Type and press enter"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700">Upload Images (up to 5)</label>
          <div
            {...getImageRootProps()}
            className="border-dashed border-2 p-4 cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <input {...getImageInputProps()} />
            <FiUpload className="text-4xl mb-2" />
            <p className="text-sm">Click or drag images here to upload</p>
          </div>
          <div className="flex mt-4 gap-4">
            {images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={file.preview}
                  alt="Preview"
                  className="w-20 h-20 object-cover border rounded"
                />
                <button
                  type="button"
                  className="absolute bottom-1/2 right-1/2 translate-y-1/2 translate-x-1/2 text-primary text-4xl"
                  onClick={() => {
                    setImages(images.filter((_, i) => i !== index));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Video Upload */}
        <div className="mb-4">
          <label className="block text-gray-700">Upload Videos (up to 2)</label>
          <div
            {...getVideoRootProps()}
            className="border-dashed border-2 p-4 cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
          >
            <input {...getVideoInputProps()} />
            <FiUpload className="text-4xl mb-2" />
            <p className="text-sm">Click or drag videos here to upload</p>
          </div>
          <div className="flex mt-4 gap-4">
            {videos.map((file, index) => (
              <div key={index} className="relative">
                <video
                  src={file.preview}
                  controls
                  className="w-40 h-20 object-cover border rounded"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded px-2 text-xl"
                  onClick={() => {
                    setVideos(videos.filter((_, i) => i !== index));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Published */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Published
          </label>
          <input
            type="checkbox"
            {...register('published')}
            className="w-5 h-5"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Article'}
        </button>
      </form>
    </div>
  );
};

export default ArticleEditorPage;
