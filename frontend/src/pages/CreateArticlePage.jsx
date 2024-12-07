import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
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

const CreateArticle = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle image upload (max 5 images)
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

  // Handle video upload (max 2 videos)
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

  // Tag management
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      if (inputValue.trim() && tags.length < 5) {
        setTags([...tags, inputValue.trim()]);
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

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('category', data.category);
    formData.append('tags', tags.join(',')); // Join tags as a comma-separated string
    formData.append('published', data.published);

    images.forEach((image) => formData.append('images', image));
    videos.forEach((video) => formData.append('videos', video));

    try {
      setLoading(true);
      const response = await axiosInstance.post(`/articles`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Article created successfully!');
      reset();
      setTags([]);
      setImages([]);
      setVideos([]);
      navigate('/');
    } catch (error) {
      console.error('Error creating article:', error);
      alert('Failed to create article. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-3/4 mx-auto p-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Article</h1>
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
              <img
                key={index}
                src={file.preview}
                alt="Preview"
                className="w-20 h-20 object-cover border rounded"
              />
            ))}
          </div>
        </div>

        {/* Video Upload */}
        <div className="mb-4">
          <label className="block text-gray-700">Upload Videos</label>
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
              <video
                key={index}
                src={file.preview}
                className="w-20 h-20 object-cover border rounded"
                controls
              />
            ))}
          </div>
        </div>

        {/* Publish */}
        <div className="mb-4">
          <label className="block text-gray-700">Publish Now?</label>
          <input {...register('published')} type="checkbox" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Article'}
        </button>
      </form>
    </div>
  );
};

export default CreateArticle;
