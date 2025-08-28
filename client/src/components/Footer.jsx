import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
        <div className="md:max-w-96">
          <img className="w-36 h-auto" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            Your fast and easy ride across South Australia is just a tap away with CyberMinibus. Choose your destination and get you there comfortably with us.
          </p>
        </div>
        <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
          <div>
            <h2 className="font-semibold mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link to="/" onClick={() => scrollTo(0, 0)}>Home</Link>
              </li>
              <li>
                <Link to="/about-us" onClick={() => scrollTo(0, 0)}>About us</Link>
              </li>
              <li>
                <Link to="/about-us" onClick={() => scrollTo(0, 0)}>Contact us</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+61 XXX-XXX-XXX</p>
              <p>cyberminibus@mail.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="pt-4 text-center text-sm pb-5">
        Copyright {new Date().getFullYear()} © CyberMinibus. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
