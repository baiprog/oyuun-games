import React from "react";

const tournaments = [
  { name: "Игры Манчаары", date: "10 июля 2025" },
  { name: "Хапсагай Тур", date: "25 июня 2025" },
  { name: "Метание Тяжести", date: "3 августа 2025" },
];

const TournamentSlider = () => {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
      {tournaments.map((t, i) => (
        <div
          key={i}
          className="min-w-[220px] bg-gray-800 text-white p-4 rounded-lg flex-shrink-0"
        >
          <h3 className="text-lg font-bold mb-1">{t.name}</h3>
          <p className="text-sm text-gray-300 mb-3">{t.date}</p>
          <button className="bg-lime-400 text-black font-bold px-3 py-1 rounded">
            Сделать ставку
          </button>
        </div>
      ))}
    </div>
  );
};

export default TournamentSlider;
