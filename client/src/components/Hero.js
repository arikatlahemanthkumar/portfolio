import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Typewriter from 'typewriter-effect';
import { FiGithub, FiLinkedin, FiMail, FiDownload, FiTarget } from 'react-icons/fi';
import { FaReact, FaRocket, FaLaptopCode, FaBolt, FaWrench } from 'react-icons/fa';

const Hero = () => {
  const [ref, inView] = useInView({ triggerOnce: true });

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/hemantharikatla',
      icon: FiGithub,
      color: 'hover:text-gray-800'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/hemanth-kumar-arikatla/',
      icon: FiLinkedin,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Email',
      url: 'mailto:hemantharikatla03@gmail.com',
      icon: FiMail,
      color: 'hover:text-red-500'
    }
  ];

  const floatingElements = [
    { icon: FaReact, delay: 0, size: 'text-4xl' },
    { icon: FaRocket, delay: 2, size: 'text-3xl' },
    { icon: FaLaptopCode, delay: 4, size: 'text-4xl' },
    { icon: FiTarget, delay: 6, size: 'text-3xl' },
    { icon: FaBolt, delay: 8, size: 'text-2xl' },
    { icon: FaWrench, delay: 10, size: 'text-3xl' }
  ];

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <div className="absolute inset-0">
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={inView ? { opacity: 0.1, scale: 1 } : {}}
            transition={{ delay: element.delay, duration: 2 }}
            className={`absolute text-primary-400 ${element.size}`}
            style={{
              left: `${20 + index * 15}%`,
              top: `${30 + index * 10}%`,
              animation: `float ${6 + index}s ease-in-out infinite`
            }}
          >
            <element.icon />
          </motion.div>
        ))}
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl lg:text-6xl font-bold text-gray-900"
              >
                Hi, I'm{' '}
                <span className="gradient-text">Hemanth</span>
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-2xl lg:text-3xl text-gray-600 font-medium"
              >
                <Typewriter
                  options={{
                    strings: [
                      'Full Stack Developer',
                      'MERN Stack Expert',
                      'React.js Developer',
                      'Node.js Developer',
                      'AI/ML Enthusiast'
                    ],
                    autoStart: true,
                    loop: true,
                    deleteSpeed: 50,
                    delay: 100
                  }}
                />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-gray-600 max-w-lg"
            >
              Passionate about creating innovative web solutions and turning ideas into reality. 
              Specialized in modern web technologies and always eager to learn new skills.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="/Arikatla_Hemanth_Kumar_Resume.pdf"
                download
                className="btn-primary flex items-center space-x-2"
              >
                <FiDownload />
                <span>Download Resume</span>
              </a>
              
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1 + index * 0.1, type: 'spring', stiffness: 200 }}
                    className={`p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 ${link.color}`}
                  >
                    <link.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <img
                  src="/profile-image.jpg"
                  alt="Hemanth Kumar"
                  className="w-72 h-72 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-72 h-72 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-6xl font-bold border-4 border-white shadow-lg" style={{ display: 'none' }}>
                  HK
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 