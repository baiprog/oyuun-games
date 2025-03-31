import React from "react";

const GameFilters = () => {
  return (
    <div className="flex px-4 space-x-2 overflow-x-auto no-scrollbar mt-2">
      <button className="bg-lime-400 text-black px-4 py-2 rounded-full font-bold">
        Все игры
      </button>
      <button className="bg-gray-800 text-white px-4 py-2 rounded-full">
        Слоты
      </button>
      <button className="bg-gray-800 text-white px-4 py-2 rounded-full">
        Популярные
      </button>
    </div>
  );
};

export default GameFilters;
