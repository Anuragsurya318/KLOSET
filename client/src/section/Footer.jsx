import React from "react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-black w-full text-white py-8">
      <ul className="w-[87%] flex flex-wrap justify-center mb-5 m-auto gap-5 lg:text-xl">
        <li onClick={scrollToTop} className="cursor-pointer hover:underline">
          About
        </li>
        <li onClick={scrollToTop} className="cursor-pointer hover:underline">
          Store Locator
        </li>
        <li onClick={scrollToTop} className="cursor-pointer hover:underline">
          FAQs
        </li>
        <li onClick={scrollToTop} className="cursor-pointer hover:underline">
          News
        </li>
        <li onClick={scrollToTop} className="cursor-pointer hover:underline">
          Careers
        </li>
        <li onClick={scrollToTop} className="cursor-pointer hover:underline">
          Contact Us
        </li>
      </ul>
      <p className="text-center text-lg lg:text-xl mr-3">
        Developed with &nbsp;
        <a href="https://github.com/Anuragsurya318" target="_blank">
          ❤️
        </a>
      </p>
    </div>
  );
};

export default Footer;
