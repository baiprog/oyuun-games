import React, { useEffect, useState } from "react";
import banner1 from "../assets/banner1.png";
import banner2 from "../assets/banner2.png";
import banner3 from "../assets/banner3.png";

const banners = [banner1, banner2, banner3];

const BannerSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 10000); // каждые 10 секунд
    return () => clearInterval(interval);
  }, []);

  const goTo = (index) => setCurrent(index);

  return (
    <div className="relative rounded-lg overflow-hidden mb-4">
      <img
        src={banners[current]}
        alt={`Баннер ${current + 1}`}
        className="w-full h-auto transition-all duration-700"
      />

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full ${i === current ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;