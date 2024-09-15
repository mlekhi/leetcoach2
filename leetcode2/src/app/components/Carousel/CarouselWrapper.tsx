"use client";

import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import './carousel.css'; // Ensure this file contains necessary styles
import CarouselCard from './CarouselCard'; // Add this line

// Dynamically import Slider to avoid SSR issues
const Slider = dynamic(() => import('react-slick'), { ssr: false });

const Carousel = () => {
  const slider = useRef<any>(null);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
  };

  return (
    <div className="pt-20">
      <Slider ref={slider} {...settings}>
        {cards.map((card, index) => (
          <CarouselCard
            card={card} 
            key={index}
          />
        ))}
      </Slider>

      <div className="flex justify-center mt-4">
        <button 
          className="carousel-control" 
          onClick={() => slider.current?.slickPrev()}
        >
          <IoIosArrowBack />
        </button>
        <button 
          className="carousel-control" 
          onClick={() => slider.current?.slickNext()}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

const cards = [
  {
    image: '/icons/message.png',
    content: "Personalized Interview Feedback",
    answer: "Provides tailored feedback on communication skills, helping candidates improve their interview performance with actionable insights."
  },
  {
    image: '/icons/person.png',
    content: "Stress Reduction Techniques",
    answer: "Equips candidates with strategies to manage interview anxiety and stress, fostering a more confident and composed presentation."
  },
  {
    image: '/icons/up.png',
    content: "Enhanced Communication Skills",
    answer: "Assesses and improves candidates' ability to articulate thoughts clearly and effectively, boosting their overall communication prowess."
  },
  {
    image: '/icons/play.png',
    content: "AI-Driven Interview Simulation",
    answer: "Offers realistic interview scenarios powered by AI, allowing candidates to practice and refine their skills in a virtual environment."
  },
  {
    image: '/icons/analytics.png',
    content: "Real-Time Performance Analytics",
    answer: "Provides instant feedback and detailed analytics on interview performance, enabling candidates to track progress and identify areas for improvement."
  },
];

export default Carousel;
