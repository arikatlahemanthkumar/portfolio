import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiCalendar, FiMapPin, FiAward, FiBook, FiCheckCircle } from 'react-icons/fi';

const Experience = () => {
  const [timelineRef, timelineInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [certRef, certInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showCertifications, setShowCertifications] = useState(false);
  
  const timelineData = [
    {
      year: '  2020-2024',
      title: ' B.Tech in Computer Science',
      description: 'Bachelor of Engineering in Computer Science and Engineering at Sri Venkateswara College of Engineering, Tirupati',
      type: 'education',
      achievements: ['Foundation in programming', 'Core CS concepts'],
      color: 'from-blue-500 to-purple-600',
      
    },
    {
      year: '  2022-2023',
      title: 'Html,css And Javascript for Web Developers',
      description: 'Completed Html,Css And Javascript for Web Developers course at Johns Hopkins University',
      type: 'learning',
      achievements: ['Html,Css,JavaScript '],
      color: 'from-blue-500 to-purple-600',
      
    },
    {
      year: ' 2023-2024',
      title: 'MERN Stack Internship ',
      description: 'Long-Term Internship at SmartBridge Educational Services (October 2023 - April 2024)',
      type: 'internship',
      achievements: ['Practical MERN Stack experience', 'Form Builder project development'],
      color: 'from-purple-500 to-pink-600',
      
    },
    {
      year: '  2024-2025',
      title: 'Mern Stack Training & Internship',
      description: 'Certification of Internship and Training on MERN Stack Course Completion from DCT Academy , Bangalore',
      type: 'milestone',
      achievements: ['Practical MERN Stack experience', 'Ride Sharing Application project development'],
      color: 'from-purple-500 to-pink-600',
      
    },
    {
      year: '2025',
      title: 'Introduction to LangGraph',
      description: 'Certification of Training on LangGraph Course Completion from LangChain Academy',
      type: 'current',
      achievements: ['Practical LangGraph,langChain experience'],
      color: 'from-purple-500 to-pink-600',
      
    },
    
    
  ];
  
  // Control the sequential animation of timeline items
  useEffect(() => {
    if (timelineInView) {
      // First show the timeline
      setShowTimeline(true);
      
      // Then animate each item sequentially
      const timer = setTimeout(() => {
        let index = 0;
        const intervalId = setInterval(() => {
          if (index < timelineData.length) {
            setActiveIndex(index);
            index++;
          } else {
            clearInterval(intervalId);
            // After timeline is complete, show certifications
            setShowCertifications(true);
          }
        }, 800); // Delay between each item appearing
        
        return () => clearInterval(intervalId);
      }, 1000); // Delay before starting the sequence after timeline appears
      
      return () => clearTimeout(timer);
    }
  }, [timelineInView, timelineData.length]);
  
  // Separate effect for certifications if timeline is not in view but certs are
  useEffect(() => {
    if (!timelineInView && certInView) {
      setShowCertifications(true);
    }
  }, [certInView, timelineInView]);

  const certificationData = [
    
    {
      id: 1,
      title: 'Web Development Certification',
      issuer: 'Johns Hopkins University',
      date: 'December 2022 - November 2023',
      description: 'Certification in HTML, CSS, JavaScript for Web Developers',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
      color: 'from-green-500 to-teal-600',
      certificateLink: 'https://drive.google.com/file/d/1L19q9zlXnFEXMnxih4RhcwNNrhdOyz9a/view?usp=drive_link'
    },
    {
      id: 2,
      title: 'MERN Stack Internship',
      issuer: 'SmartInternz',
      date: 'October 2023 - April 2024',
      description: 'Long-Term Internship at SmartBridge Educational Services (October 2023 - April 2024)',
      skills: ['Practical MERN Stack experience', 'Form Builder project development'],
      color: 'from-green-500 to-teal-600',
      certificateLink: 'https://drive.google.com/file/d/1LG3magKPMaZJZBSR0vkVAE9hDhUB2dGV/view?usp=drive_link'
    },
    {
      id: 3,
      title: 'MERN Stack Development',
      issuer: 'DCT Academy',
      date: 'July 2024 - February 2025',
      description: 'Comprehensive certification in MongoDB, Express, React, and Node.js development',
      skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'REST API Development','Redux'],
      color: 'from-blue-500 to-indigo-600'
    
    },
     {
      id: 4,
      title: 'Introduction To LangGraph',
      issuer: 'LangGraph Academy',
      date: 'May 2025-present',
      description: 'certification in building AI agents using LangGraph and modern AI frameworks',
      skills: ['LangGraph', 'LLM Integration', 'AI Agents'],
      color: 'from-purple-500 to-pink-600',
      certificateLink: 'https://drive.google.com/file/d/1a-fILsW-LuFcJt6T6eXzqAbNkkHV6Ewo/view?usp=drive_link'
    },   
  ];
  
  // Container variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  // Item variants for individual card animations
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12
      }
    }
  };
  


  return (
    <section id="experience" className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          ref={timelineRef}
          initial={{ opacity: 0, y: 50 }}
          animate={timelineInView ? { opacity: 1, y: 0 } : {}}
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
            animate={showTimeline ? { height: '100%' } : { height: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute left-1/2 transform -translate-x-1/2 w-1.5 bg-gradient-to-b from-primary-500 via-purple-500 to-pink-500 animate-growLine"
            style={{ top: '2rem', bottom: '2rem', animationDuration: '2s', animationFillMode: 'forwards', animationPlayState: showTimeline ? 'running' : 'paused' }}
          ></motion.div>

          {/* Timeline items */}
          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.2 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                } mb-24`}
              >
                {/* Year bubble on the line */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={timelineInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1 + index * 0.2 }}
                  className="absolute left-1/2 transform -translate-x-1/2 z-10"
                  style={{ 
                    top: '50%',
                    animation: timelineInView ? 'popIn 0.6s forwards' : 'none',
                    animationDelay: `${0.5 + index * 0.2}s`
                  }}
                >
                  <div 
                    className={`flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${item.color} text-white font-bold shadow-lg`}
                    style={{
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <span className="text-sm text-center w-full px-1">{item.year}</span>
                  </div>
                </motion.div>

                {/* Content card */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  animate={activeIndex >= index ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.2,
                    type: "spring",
                    stiffness: 100,
                    damping: 12
                  }}
                  className={`w-5/12 ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}
                  style={{ 
                    animation: activeIndex >= index ? `${index % 2 === 0 ? 'slideInLeft' : 'slideInRight'} 0.8s forwards` : 'none',
                    animationDelay: `${0.7 + index * 0.2}s`,
                    marginLeft: index % 2 === 0 ? '0' : '60px',
                    marginRight: index % 2 === 0 ? '60px' : '0'
                  }}
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
                          animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.4, delay: 1.5 + index * 0.2 + achievementIndex * 0.1 }}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
                          {achievement}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Certificate Link */}
                    {item.certificateLink && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4, delay: 1.7 + index * 0.2 }}
                        className="mt-4"
                      >
                        <a 
                          href={item.certificateLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg text-xs font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                          <FiAward className="mr-1" size={12} />
                          View Certificate
                        </a>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={timelineInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 2 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 p-8 rounded-2xl border border-primary-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Currently</h3>
            <p className="text-gray-600 mb-6">
              Completedmy MERN Stack training at DCT Academy and actively seeking opportunities 
              as a Full Stack Developer to apply my skills in real-world projects.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Job Ready', 'MERN Stack Expert', 'AI Enthusiast', 'Problem Solver'].map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={timelineInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 2.2 + index * 0.1 }}
                  className="px-4 py-2 bg-white text-primary-700 rounded-full text-sm font-medium shadow-md border border-primary-200"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Certifications Section */}
        <motion.div
          ref={certRef}
          initial={{ opacity: 0, y: 50 }}
          animate={showCertifications ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-24 text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            My <span className="gradient-text">Certifications</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Professional certifications and achievements that validate my skills and expertise.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={showCertifications ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-12"
        >
          {certificationData.map((cert, index) => (
            <motion.div
                key={cert.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
                style={{ 
                  animation: showCertifications ? 'popIn 0.6s forwards' : 'none',
                  animationDelay: `${0.2 + index * 0.15}s`
                }}
              >
              <div className={`h-3 bg-gradient-to-r ${cert.color}`}></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{cert.title}</h3>
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
                    {cert.date}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <FiAward className="mr-2 text-primary-600" />
                  <span>{cert.issuer}</span>
                </div>
                
                <p className="text-gray-600 mb-5">{cert.description}</p>
                
                {/* Certificate Link */}
                <div className="mb-5">
                  <a 
                    href={cert.certificateLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    <FiAward className="mr-2" />
                    View Certificate
                  </a>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Covered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={showCertifications ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full"
                      >
                        <FiCheckCircle className="mr-1 text-primary-500" size={12} />
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;