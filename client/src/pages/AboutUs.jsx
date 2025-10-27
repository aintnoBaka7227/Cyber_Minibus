import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen pt-32 md:pt-40 px-6 md:px-16 lg:px-36">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - Content */}
          <div className="order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              About Us
            </h1>
            
            <p className="text-lg leading-relaxed mb-8 text-gray-300 text-justify">
              Welcome to CyberMinibus, your new choice for modern and reliable transportation in South Australia. Our platform is designed to connect you with professional drivers and the right vehicle for your needs, all through a seamless and easy-to-use booking experience. We are committed to getting you to your destination safely, comfortably, and on time, every time.
            </p>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Contact Us
            </h2>
            
            <div className="text-lg text-gray-300 space-y-2">
              <p>
                <span className="font-semibold">Phone:</span> +61 XXX-XXX-XXX
              </p>
              <p>
                <span className="font-semibold">Mail:</span> cyberminibus@mail.com
              </p>
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="order-1 md:order-2">
            <div className="relative">
              <img 
                src="/HomePage.webp" 
                alt="CyberMinibus Transportation" 
                className="w-full h-64 md:h-80 lg:h-96 xl:h-[28rem] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
