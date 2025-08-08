import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiCalendar, FiMapPin, FiExternalLink } from 'react-icons/fi';

const Experience = () => {
  const [ref, inView] = useInView({ triggerOnce: true });

  const timeline = [
    {
      year: '2024',
      title: 'Graduation',
      description: 'Completed B.Tech in Computer Science from Sri Venkateswara University',
      location: 'Tirupati, Andhra Pradesh'
    },
    {
      year: '2023',
      title: 'Full Stack Development',
      description: 'Started learning MERN stack and building web applications',
      location: 'Online'
    },
    {
      year: '2022',
      title: 'Programming Fundamentals',
      description: 'Learned core programming concepts and data structures',
      location: 'University'
    }
  ];

  const certifications = [
    {
      name: 'Data Structures and Algorithms',
      issuer: 'Coursera',
      date: '2024',
      certificateUrl: 'https://drive.google.com/file/d/your-dct-certificate-id/view?usp=sharing'
    },
    {
      name: 'MongoDB Database Administrator',
      issuer: 'MongoDB University',
      date: '2024',
      certificateUrl: 'https://drive.google.com/file/d/1LG3magKPMaZJZBSR0vkVAE9hDhUB2dGV/view?usp=drive_link'
    },
    {
      name: 'React.js Development',
      issuer: 'Udemy',
      date: '2023',
      certificateUrl: 'https://drive.google.com/file/d/1a-fILsW-LuFcJt6T6eXzqAbNkkHV6Ewo/view?usp=drive_link'
    },
    {
      name: 'HTML, CSS, and Javascript for Web Developers',
      issuer: 'Coursera',
      date: '2023',
      certificateUrl: 'https://drive.google.com/file/d/1L19q9zlXnFEXMnxih4RhcwNNrhdOyz9a/view?usp=sharing'
    }
  ];

  return (
    <section id="experience" className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Experience & <span className="gradient-text">Education</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-purple-500 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            My journey in technology and education, showcasing my growth and achievements over the years.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">
              Professional Timeline
            </h3>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-purple-600"></div>
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
                  className="relative mb-8 ml-12"
                >
                  <div className="absolute left-[-2.5rem] top-2 w-5 h-5 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <FiCalendar className="text-primary-600" />
                      <span className="text-sm font-medium text-primary-600">{item.year}</span>
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h4>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <FiMapPin />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">
              Certifications & Training
            </h3>
            <div className="space-y-6">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">{cert.name}</h4>
                      <p className="text-gray-600 text-sm">{cert.issuer}</p>
                    </div>
                    <span className="text-sm text-primary-600 font-medium">{cert.date}</span>
                  </div>
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-300"
                  >
                    <FiExternalLink />
                    <span className="text-sm font-medium">View Certificate</span>
                  </a>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-8 p-6 bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl border border-primary-100"
            >
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Continuous Learning
              </h4>
              <p className="text-gray-600 mb-4">
                I believe in continuous learning and staying updated with the latest technologies. 
                Currently exploring advanced topics in AI/ML and cloud computing.
              </p>
              <div className="flex flex-wrap gap-2">
                {['AI/ML', 'Cloud Computing', 'DevOps', 'System Design'].map((topic, index) => (
                  <span
                    key={topic}
                    className="px-3 py-1 bg-white text-primary-700 rounded-full text-sm font-medium border border-primary-200"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience; 