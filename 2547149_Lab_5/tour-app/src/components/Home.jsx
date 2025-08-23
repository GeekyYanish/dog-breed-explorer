import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Home() {
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1468746587034-766ade47c1ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Discover. Wander. Repeat.',
      subtitle: 'Curated travel experiences to the most iconic places around the globe.',
    },
    {
      image: 'https://images.unsplash.com/photo-1695828735560-122fc856de5a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Escape to Nature',
      subtitle: 'Reconnect with serenity in the heart of nature’s beauty.',
    },
    {
      image: 'https://images.unsplash.com/photo-1573004814905-55057414ebe2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Urban Adventures',
      subtitle: 'Explore the charm of bustling cityscapes and hidden gems.',
    },
  ];

  return (
    <section className="relative">
      <Carousel
        showThumbs={false}
        showStatus={false}
        autoPlay
        infiniteLoop
        interval={5000}
        transitionTime={800}
        stopOnHover={false}
        emulateTouch
        swipeable
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="relative h-[80vh]">
            <img
              src={slide.image}
              alt={`slide-${idx}`}
              className="object-cover h-full w-full brightness-[0.6]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-md">{slide.title}</h2>
              <p className="text-lg md:text-xl max-w-2xl text-zinc-300 drop-shadow-md">
                {slide.subtitle}
              </p>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
}
