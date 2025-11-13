import React from 'react';
import { Helmet } from 'react-helmet-async';
import catImage from '../assets/images/cat.png';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>ОКАК | Страница не найдена</title>
      </Helmet>
      
      <div className="app">
        <div className="error">
          404
        </div>
        <div className="img">
          <img src={catImage} alt="cat" />
          <h1 className="okak">ОКАК</h1>
        </div>

        <style jsx>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          .app {
            position: relative;
            height: 100vh;
            background: #050505;
            overflow: hidden;
            font-family: "Montserrat", sans-serif;
            color: #fff;
            font-size: 18px;
          }
          .img {
            position: absolute;
            bottom: 0;
            max-width: 1920px;
            margin: 0 auto;
            animation: catAnim 1.5s ease forwards;
          }
          .img img {
            display: flex;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          @keyframes catAnim {
            0% {
              transform: translateY(50%);
            }
            100% {
              transform: translateY(0);
            }
          }
          .okak {
            position: absolute;
            bottom: 150px;
            left: 50%;
            transform: translateX(-50%);
            font-weight: 900;
            font-size: 115px;
          }
          .error {
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 750px;
            font-weight: 900;
            transform: translate(-50%, 800px);
            animation: errorAnim 1.5s ease forwards;
          }

          @keyframes errorAnim {
            100% {
              transform: translate(-50%, -400px);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default NotFoundPage;