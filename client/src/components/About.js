import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiPhone, FiMail, FiMapPin, FiUser } from 'react-icons/fi';

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true });

  const personalInfo = {
    name: 'Arikatla Hemanth Kumar',
    email: 'arikatlahemanthkumar@gmail.com',
    phone: '+91 9492906798',
    location: 'Tirupati, Andhra Pradesh, India',
    degree: 'B.E in Computer Science And Engineering',
    university: 'Sri Venkateswara College of Engineering, Tirupati',
    graduation: 'CGPA 8.16 (2020-2024)'
  };
  
  const contactInfo = [
    {
      title: 'Name',
      value: personalInfo.name,
      link: '#',
      icon: FiUser
    },
    {
      title: 'Phone',
      value: personalInfo.phone,
      link: `tel:${personalInfo.phone.replace(/\s+/g, '')}`,
      icon: FiPhone
    },
    {
      title: 'Email',
      value: personalInfo.email,
      link: `mailto:${personalInfo.email}`,
      icon: FiMail
    },
    {
      title: 'Location',
      value: personalInfo.location,
      link: '#',
      icon: FiMapPin
    }
  ];

  const highlights = [
    'MERN Stack Developer with practical experience',
    'Building dynamic and responsive web applications',
    'MongoDB, Express.js, React.js, and Node.js',
    'Proficient in REST API development and authentication',
    'Database management with Mongoose',
    'Skilled in Redux for state management',
    'User-friendly applications with hands-on experience',
    'Passionate about learning new technologies'
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
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Personal Info</h3>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  <div className="text-primary-600 text-xl">
                    <info.icon />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{info.title}</h4>
                    <a
                      href={info.link}
                      className="text-gray-600 hover:text-primary-600 transition-colors duration-300"
                    >
                      {info.value}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Education</h4>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h5 className="font-semibold text-primary-600 text-lg">{personalInfo.degree}</h5>
                <p className="text-gray-700 font-medium">{personalInfo.university}</p>
                <p className="text-gray-600">{personalInfo.graduation}</p>
                <div className="mt-3">
                  <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                    CGPA: 8.16
                  </span>
                </div>
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