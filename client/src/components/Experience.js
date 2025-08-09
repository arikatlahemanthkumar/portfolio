import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiCalendar, FiMapPin, FiAward, FiBook } from 'react-icons/fi';

const Experience = () => {
  const [ref, inView] = useInView({ triggerOnce: true });

  const timelineData = [
    {
      year: '2020',
      title: 'Started B.E in Computer Science',
      description: 'Began my journey in Computer Science and Engineering at Sri Venkateswara College of Engineering, Tirupati',
      type: 'education',
      achievements: ['Foundation in programming', 'Core CS concepts'],
      color: 'from-blue-500 to-purple-600'
    },
    {
      year: '2022',
      title: 'Advanced Programming & Web Development',
      description: 'Explored advanced programming concepts and started learning web development technologies',
      type: 'learning',
      achievements: ['Data Structures & Algorithms', 'Web Development Basics'],
      color: 'from-green-500 to-blue-600'
    },
    {
      year: '2023',
      title: 'MERN Stack Internship Started',
      description: 'Long-Term Internship at SmartBridge Educational Services (October 2023 - April 2024)',
      type: 'internship',
      achievements: ['Practical MERN Stack experience', 'Real-world project development'],
      color: 'from-purple-500 to-pink-600'
    },
    {
      year: '2024',
      title: 'Graduation & Professional Training',
      description: 'Completed B.E with CGPA 8.16 and started MERN Stack Course at DCT Academy, Bangalore',
      type: 'milestone',
      achievements: ['B.E Graduation (CGPA: 8.16)', 'DCT Academy MERN Training'],
      color: 'from-orange-500 to-red-600'
    },
    {
      year: '2025',
      title: 'AI Technologies & Career Ready',
      description: 'Mastering AI technologies including LangGraph and preparing for full-stack development career',
      type: 'current',
      achievements: ['LangGraph Certification', 'AI Agent Development', 'Job Ready'],
      color: 'from-cyan-500 to-blue-600'
    }
  ];

  return (
    <section id="experience" className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            My <span className="gradient-text">Journey</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A timeline of my educational journey, professional growth, and key milestones in technology.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main vertical line */}
          <motion.div
            initial={{ height: 0 }}
            animate={inView ? { height: '100%' } : {}}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-primary-500 via-purple-500 to-pink-500 rounded-full"
            style={{ top: '2rem', bottom: '2rem' }}
          ></motion.div>

          {/* Timeline items */}
          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Year bubble on the line */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
                  className="absolute left-1/2 transform -translate-x-1/2 z-10"
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold text-sm shadow-lg border-4 border-white`}>
                    {item.year}
                  </div>
                </motion.div>

                {/* Content card */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.2 }}
                  className={`w-5/12 ${index % 2 === 0 ? 'mr-auto pr-8' : 'ml-auto pl-8'}`}
                >
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    {/* Type icon */}
                    <div className="flex items-center mb-3">
                      {item.type === 'education' && <FiBook className="text-blue-600 mr-2" />}
                      {item.type === 'learning' && <FiBook className="text-green-600 mr-2" />}
                      {item.type === 'internship' && <FiMapPin className="text-purple-600 mr-2" />}
                      {item.type === 'milestone' && <FiAward className="text-orange-600 mr-2" />}
                      {item.type === 'current' && <FiCalendar className="text-cyan-600 mr-2" />}
                      
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.type === 'education' ? 'bg-blue-100 text-blue-700' :
                        item.type === 'learning' ? 'bg-green-100 text-green-700' :
                        item.type === 'internship' ? 'bg-purple-100 text-purple-700' :
                        item.type === 'milestone' ? 'bg-orange-100 text-orange-700' :
                        'bg-cyan-100 text-cyan-700'
                      }`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    
                    {/* Achievements */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Key Achievements:</h4>
                      {item.achievements.map((achievement, achievementIndex) => (
                        <motion.div
                          key={achievementIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.4, delay: 1.5 + index * 0.2 + achievementIndex * 0.1 }}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                          {achievement}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 p-8 rounded-2xl border border-primary-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Currently</h3>
            <p className="text-gray-600 mb-6">
              Completing my MERN Stack training at DCT Academy and actively seeking opportunities 
              as a Full Stack Developer to apply my skills in real-world projects.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Job Ready', 'MERN Stack Expert', 'AI Enthusiast', 'Problem Solver'].map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 2.2 + index * 0.1 }}
                  className="px-4 py-2 bg-white text-primary-700 rounded-full text-sm font-medium shadow-md border border-primary-200"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience; 