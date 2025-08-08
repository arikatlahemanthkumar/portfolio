import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true });

  const personalInfo = {
    name: 'Hemanth Kumar Arikatla',
    email: 'hemantharikatla03@gmail.com',
    phone: '+91 9492906798',
    location: 'Tirupati, Andhra Pradesh, India',
    degree: 'B.Tech in Computer Science',
    university: 'Sri Venkateswara University',
    graduation: '2024'
  };

  const highlights = [
    'Full Stack Development with MERN Stack',
    'Modern React.js with Hooks and Context',
    'Node.js and Express.js Backend Development',
    'MongoDB Database Design and Management',
    'RESTful API Development and Integration',
    'Responsive Web Design and UI/UX',
    'Git Version Control and Collaboration',
    'Problem Solving and Algorithm Design'
  ];

  return (
    <section id="about" className="section-padding bg-gray-50">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A passionate Full Stack Developer with expertise in modern web technologies. 
            I love creating efficient, scalable solutions and turning complex problems into simple, beautiful designs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Personal Information
              </h3>
              <div className="space-y-4">
                {Object.entries(personalInfo).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-700 capitalize w-24">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Education
              </h3>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {personalInfo.degree}
                </h4>
                <p className="text-gray-600 mb-2">{personalInfo.university}</p>
                <p className="text-primary-600 font-medium">Graduated: {personalInfo.graduation}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Professional Summary
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                I am a dedicated Full Stack Developer with a strong foundation in computer science and 
                a passion for creating innovative web solutions. My expertise spans the entire development 
                stack, from designing user-friendly interfaces to building robust backend systems.
              </p>
              <p className="text-gray-600 leading-relaxed">
                I believe in writing clean, maintainable code and staying up-to-date with the latest 
                technologies. My goal is to contribute to meaningful projects that make a difference 
                in people's lives.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Key Highlights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-gray-700">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About; 