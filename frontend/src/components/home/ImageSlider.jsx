import React, { useState, useEffect, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

// Define image URLs for travel/country-related images
const defaultSlides = [
  {
    url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1920&auto=format&fit=crop",
    caption: "Explore the world's most breathtaking landmarks",
    location: "Paris, France",
    alt: "Eiffel Tower in Paris, France",
  },
  {
    url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1920&auto=format&fit=crop",
    caption: "Discover natural wonders across continents",
    location: "Santorini, Greece",
    alt: "Santorini coastal view in Greece",
  },
  {
    url: "https://images.unsplash.com/photo-1528702748617-c64d49f918af?q=80&w=1920&auto=format&fit=crop",
    caption: "Experience diverse cultures and traditions",
    location: "Kyoto, Japan",
    alt: "Traditional temple in Kyoto, Japan",
  },
  {
    url: "https://images.unsplash.com/photo-1562832135-14a35d25edef?q=80&w=1920&auto=format&fit=crop",
    caption: "Get to know our planet's fascinating geography",
    location: "Machu Picchu, Peru",
    alt: "Ancient Machu Picchu ruins in Peru",
  },
  {
    url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1920&auto=format&fit=crop",
    caption: "Visit iconic cities from around the globe",
    location: "New York City, USA",
    alt: "New York City skyline",
  },
];

/**
 * Image slider component
 *
 * @param {Object} props - Component props
 * @param {Array} [props.slides] - Array of slide objects (url, caption, location, alt)
 * @param {number} [props.interval] - Auto-rotation interval in ms
 * @param {number} [props.height] - Height of the slider in pixels
 */
const ImageSlider = ({
  slides = defaultSlides,
  interval = 4000,
  height = 500,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [nextSlide, interval, isPaused]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  useEffect(() => {
    setIsLoaded(false);
    const img = new Image();
    img.src = slides[currentIndex].url;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(true);
  }, [currentIndex, slides]);

  return (
    <Box
      className="relative w-full overflow-hidden rounded-lg shadow-xl"
      style={{ height: `${height}px` }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Image Slideshow"
      aria-roledescription="carousel"
    >
      {/* Main image */}
      <Box
        className={`w-full h-full transition-all duration-500 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-40"
        }`}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${slides[currentIndex].url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        role="img"
        aria-label={slides[currentIndex].alt}
      />

      {/* Caption area */}
      <Box className="absolute bottom-16 left-0 right-0 text-center px-4">
        <Typography
          variant="h4"
          className="text-white font-bold text-shadow mb-2"
        >
          {slides[currentIndex].caption}
        </Typography>
        <Typography
          variant="subtitle1"
          className="text-white bg-black/30 inline-block px-4 py-1 rounded-full"
        >
          {slides[currentIndex].location}
        </Typography>
      </Box>

      {/* Navigation */}
      <IconButton
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 transition-colors"
        size="large"
        aria-label="Previous slide"
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <IconButton
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 transition-colors"
        size="large"
        aria-label="Next slide"
      >
        <ArrowForwardIosIcon />
      </IconButton>

      {/* Slide indicators */}
      <Box
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
        role="tablist"
        aria-label="Slide selector"
      >
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            role="tab"
            tabIndex={0}
            aria-selected={index === currentIndex}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </Box>
    </Box>
  );
};

ImageSlider.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      caption: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      alt: PropTypes.string.isRequired,
    })
  ),
  interval: PropTypes.number,
  height: PropTypes.number,
};

export default memo(ImageSlider);
