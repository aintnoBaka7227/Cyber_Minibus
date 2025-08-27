import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen pt-20 px-6 md:px-16 lg:px-36">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
          About CyberMinibus
        </h1>
        
        <div className="prose prose-lg mx-auto text-gray-300">
          <p className="text-xl leading-relaxed mb-6">
            Welcome to CyberMinibus - your premier destination for modern transportation solutions.
          </p>
          
          <p className="leading-relaxed mb-6">
            CyberMinibus represents the future of urban mobility, combining cutting-edge technology 
            with comfortable, efficient transportation services. Our mission is to revolutionize 
            the way people move through cities by providing smart, sustainable, and user-friendly 
            transit options.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
          <p className="leading-relaxed mb-6">
            To create a seamless, connected transportation network that serves communities 
            while reducing environmental impact and enhancing quality of life for everyone.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Services</h2>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2">Smart route planning and optimization</li>
            <li className="mb-2">Real-time tracking and updates</li>
            <li className="mb-2">Comfortable and modern vehicles</li>
            <li className="mb-2">Eco-friendly transportation solutions</li>
            <li className="mb-2">24/7 customer support</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Get in Touch</h2>
          <p className="leading-relaxed">
            Have questions or suggestions? We'd love to hear from you. Contact our team 
            to learn more about how CyberMinibus can serve your transportation needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
