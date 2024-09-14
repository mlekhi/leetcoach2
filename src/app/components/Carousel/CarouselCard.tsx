import Image from "next/image"; // Next.js optimized image
import React from "react";
import "./carousel.css";

interface CardProps {
  card: {
    image: string;
    content: string;
    answer: string;
  };
}

const CarouselCard: React.FC<CardProps> = ({ card }) => {
  return (
    <div className="m-1 rounded-xl hover:bg-black/10 p-5 min-h-[440px] flex flex-col items-center">
      <div className="reverse-gradient h-[170px] w-full flex justify-center">
        <Image
          src={card.image}
          alt={card.content}
          width={100} // Set width and height based on your needs
          height={100}
          className="w-1/4 pt-[30px]"
        />
      </div>
      <p className="text-3xl font-extrabold my-10 text-white/80 text-center">
        {card.content}
      </p>
      <p className="answer text-center">{card.answer}</p>
    </div>
  );
};

export default CarouselCard;
