import React from "react";
import BottomNav from "./components/BottomNav";
import GameSlider from "./components/GameSlider";
import GameFilters from "./components/GameFilters";
import TournamentSlider from "./components/TournamentSlider";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-black text-white min-h-screen pb-24">
      <header className="flex justify-between items-center px-4 py-3">
        <div className="text-lg font-bold">OYUUN GAMES</div>
        <div className="space-x-2">
          <button className="bg-gray-800 text-white px-3 py-1 rounded">Вход</button>
          <button className="bg-lime-400 text-black px-3 py-1 rounded font-bold">Регистрация</button>
        </div>
      </header>

      <section className="px-4">
        <h1 className="text-3xl font-bold mb-2">Игры Дыгына</h1>
        <div className="bg-yellow-900 text-white p-4 rounded-lg text-center mb-4">
          <div className="text-4xl font-bold">50%</div>
          <div className="text-md">от дохода на призы</div>
        </div>
      </section>

      <GameFilters />

      <section className="px-4 mt-4">
        <h2 className="text-xl font-semibold mb-2">Слоты</h2>
        <GameSlider />
      </section>

      <section className="px-4 mt-6">
        <h2 className="text-xl font-semibold mb-2">Live-игры</h2>
        <GameSlider />
      </section>

      <section className="px-4 mt-6">
        <h2 className="text-xl font-semibold mb-2">Ближайшие турниры</h2>
        <TournamentSlider />
      </section>

      <Footer />
      <BottomNav />
    </div>
  );
}

export default App;
