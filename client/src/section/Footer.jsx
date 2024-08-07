import React from "react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-black w-full text-white py-8">
      <ul className="w-[87%] flex flex-wrap justify-center mb-5 m-auto gap-5 lg:text-xl">
        <li onClick={scrollToTop} className="cursor-pointer">
          About
        </li>
        <li onClick={scrollToTop} className="cursor-pointer">
          Store Locator
        </li>
        <li onClick={scrollToTop} className="cursor-pointer">
          FAQs
        </li>
        <li onClick={scrollToTop} className="cursor-pointer">
          News
        </li>
        <li onClick={scrollToTop} className="cursor-pointer">
          Careers
        </li>
        <li onClick={scrollToTop} className="cursor-pointer">
          Contact Us
        </li>
      </ul>
      <p className="text-center text-lg lg:text-xl">
        Developed with{" "}
        <a href="https://github.com/Anuragsurya318" target="_blank">
          ❤️
        </a>
      </p>
    </div>
  );
};

export default Footer;
