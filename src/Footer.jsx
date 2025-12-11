import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-5">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          
          {/* Logo + Name */}
          <div>
            <h2 className="text-2xl font-bold text-white">ScholarStream</h2>
            <p className="text-sm mt-1">
              Connecting students with global scholarship opportunities.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5 text-xl">
            <a href="#" className="hover:text-white">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-white">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-white">
              <FaLinkedin />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom Section */}
        <div className="text-center text-sm">
          © {new Date().getFullYear()} ScholarStream. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

