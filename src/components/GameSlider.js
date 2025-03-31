import React from "react";

const GameSlider = () => {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="min-w-[140px] h-[180px] bg-gray-800 rounded-lg flex-shrink-0"
        >
          <div className="w-full h-full flex items-center justify-center text-lg font-bold text-white">
            Игра {i}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameSlider;
