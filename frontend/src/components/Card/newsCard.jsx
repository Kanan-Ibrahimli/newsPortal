import React from 'react';
import { Link } from 'react-router-dom';

function Card({ title, image, date }) {
  return (
    <div className="card bg-white rounded-lg shadow hover:shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
  );
}

export default Card;
