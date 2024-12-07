import React from 'react';
import { motion } from 'framer-motion';
import bg_img from '../assets/newsHero.jpeg'; // Replace with a relevant background image

const AboutUsPage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <motion.div
        className="w-full h-screen bg-cover bg-center relative rounded-lg overflow-hidden"
        style={{
          backgroundImage: `url(${bg_img})`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="bg-black bg-opacity-50 absolute inset-0"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            About <span className="text-primary">Our News Portal</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Delivering the latest and most accurate news, empowering readers to
            stay informed and engaged in today’s fast-paced world.
          </motion.p>
        </div>
      </motion.div>

      {/* Content Section */}
      <motion.section
        className="container mx-auto px-4 py-16"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Our Vision
        </h2>
        <p className="text-gray-700 text-lg md:text-xl leading-relaxed text-center max-w-4xl mx-auto">
          Our mission is to create a centralized hub for delivering news and
          multimedia content that informs, inspires, and engages readers
          worldwide. We are committed to providing accurate, up-to-date, and
          diverse perspectives on current events.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: 'Comprehensive Coverage',
              description:
                'Offering articles across politics, business, technology, sports, entertainment, and more.',
            },
            {
              title: 'Interactive Features',
              description:
                'Empowering users with comment sections, social sharing, and advanced search tools.',
            },
            {
              title: 'Reliable Information',
              description:
                'Ensuring accuracy and credibility in all content through thorough editorial processes.',
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-md rounded-lg p-6 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default AboutUsPage;
