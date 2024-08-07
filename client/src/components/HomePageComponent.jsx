import React from "react";
import { useNavigate } from "react-router-dom";

const HomePageComponent = ({ where, heading, para, imageLink, straight }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-[87%] lg:flex h-80 lg:h-96 m-auto my-20 bg-slate-200 shadow-lg">
      {straight ? (
        <>
          <img src={imageLink} alt="" className="h-full w-1/2 hidden lg:block" />
          <div className="lg:w-[50%] h-full flex justify-center items-center">
            <div className="w-4/5 h-4/5 flex flex-col justify-center">
              <h1 className="text-3xl mb-3 font-semibold">{heading}</h1>
              <p className="text-base">{para}</p>
              <button
                className="bg-black border-2 border-black hover:bg-transparent hover:text-black  text-white w-fit px-4 py-1 lg:px-6 text-lg mt-3 font-semibold"
                onClick={handleClick}
              >
                SHOP NOW
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="lg:w-[50%] h-full flex justify-center items-center">
            <div className="w-4/5 h-4/5 flex flex-col justify-center">
              <h1 className="text-3xl mb-3 font-semibold">{heading}</h1>
              <p className="text-base">{para}</p>
              <button
                className="bg-black border-2 border-black hover:bg-transparent hover:text-black  text-white w-fit px-4 py-1 lg:px-6 text-lg mt-3 font-semibold"
                onClick={handleClick}
              >
                SHOP NOW
              </button>
            </div>
          </div>
          <img src={imageLink} alt="" className="h-full w-1/2 hidden lg:block" />
        </>
      )}
    </div>
  );
};

export default HomePageComponent;
