import React from "react";

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around py-3 border-t border-gray-700 z-50">
      <div className="text-center">
        <div className="text-xl">🏦</div>
        <div className="text-sm">Касса</div>
      </div>
      <div className="text-center">
        <div className="text-xl">🏆</div>
        <div className="text-sm">Спорт</div>
      </div>
      <div className="text-center">
        <div className="text-xl">🎰</div>
        <div className="text-sm">Казино</div>
      </div>
      <div className="text-center">
        <div className="text-xl">☰</div>
        <div className="text-sm">Меню</div>
      </div>
    </nav>
  );
};

export default BottomNav;
