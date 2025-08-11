import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/arikatlahemanthkumar',
      icon: FiGithub,
      color: 'hover:text-gray-800'
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/arikatla-hemanth-kumar-0b3693213/',
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

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              <span className="gradient-text">Arikatla Hemanth Kumar</span>
            </h3>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 max-w-md">
              A passionate Full Stack Developer dedicated to creating innovative web solutions. 
              Specialized in MERN stack development and modern web technologies.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 text-lg sm:text-xl transition-colors duration-300 ${link.color}`}
                  aria-label={link.name}
                >
                  <link.icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 text-sm sm:text-base hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Info</h4>
            <div className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
              <p>+91 9492906798</p>
              <p>arikatlahemanthkumar@gmail.com</p>
              <p>Tirupati, Andhra Pradesh</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center"
        >
          <p className="text-gray-400 text-xs sm:text-sm">
            © {currentYear} Hemanth Kumar Arikatla. All rights reserved. Made with{' '}
            <FiHeart className="inline text-red-500" /> using React & Node.js
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;