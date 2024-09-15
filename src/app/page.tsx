import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import Carousel from "./components/Carousel/CarouselWrapper"; // Ensure this path is correct

function Landing() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center py-8 px-4">
      <header className="relative w-full max-w-4xl mx-auto p-6 rounded-lg">
        <div className="relative pt-40 pb-40 rounded-lg">
          <div className="relative z-10">
            <h1 className="text-6xl font-extrabold text-white mb-4 text-left">
              LeetCoach
            </h1>
            <p className="text-lg text-gray-200 mb-4 text-left">
              LeetCoach is an AI-driven technical interviewer designed to assess
              not only your coding skills, but also your communication.
            </p>
            <p className="text-lg text-gray-200 mb-6 text-left">
              Practice your coding interviews with real-time feedback on how you
              explain your solutions. Perfect your answers and ace your next
              technical interview!
            </p>
            <a
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300 ease-in-out shadow-neon-blue hover:shadow-neon-purple hover:scale-105"
              href="/main"
            >
              Start Your First Interview
            </a>
          </div>

          <div className="mt-8">
            <Carousel />
          </div>
        </div>
      </header>
    </div>
  );
}

export default Landing;
