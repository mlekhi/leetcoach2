import React from 'react'
// import styled from '@emotion/styled';
import Swiper from "react-slick";
import './carousel.css';
import CarouselCard from './CarouselCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const Carousel = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    className: "hey"
  };

  const slider = React.useRef(null);

  return (
    <div className="pt-20 justify-center">
      <Swiper ref={slider} {...settings}>
        {cards.map((card, index) => (
          <CarouselCard
            card={card} 
            key={index}
          />
        ))}
      </Swiper>

      <div className="flex justify-center">
        <button 
          className="carousel-control" 
          onClick={() => slider?.current?.slickPrev()}
        >
          <IoIosArrowBack/>
        </button>
        <button 
          className="carousel-control" 
          onClick={() => slider?.current?.slickNext()}
        >
          <IoIosArrowForward/>
        </button>

      </div>
    </div>
  )
}


const cards = [
    {
      image: '../../icons/chat.png',
      content: "Personalized Interview Feedback",
      answer: "Provides tailored feedback on communication skills, helping candidates improve their interview performance with actionable insights."
    },
    {
      image: '../../icons/mental-health.png',
      content: "Stress Reduction Techniques",
      answer: "Equips candidates with strategies to manage interview anxiety and stress, fostering a more confident and composed presentation."
    },
    {
      image: '../../icons/emotional-intelligence.png',
      content: "Enhanced Communication Skills",
      answer: "Assesses and improves candidates' ability to articulate thoughts clearly and effectively, boosting their overall communication prowess."
    },
    {
      image: '../../icons/bot.png',
      content: "AI-Driven Interview Simulation",
      answer: "Offers realistic interview scenarios powered by AI, allowing candidates to practice and refine their skills in a virtual environment."
    },
    {
      image: '../../icons/message.png',
      content: "Real-Time Performance Analytics",
      answer: "Provides instant feedback and detailed analytics on interview performance, enabling candidates to track progress and identify areas for improvement."
    },
  ];

  
export default Carousel