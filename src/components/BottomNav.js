import React from "react";
import { Wallet, Trophy, Gamepad2, Menu } from "lucide-react";

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around py-2 border-t border-gray-700 z-50">
      <div className="flex flex-col items-center text-xs">
        <Wallet size={22} />
        <span className="mt-1">Касса</span>
      </div>
      <div className="flex flex-col items-center text-xs">
        <Trophy size={22} />
        <span className="mt-1">Спорт</span>
      </div>
      <div className="flex flex-col items-center text-xs">
        <Gamepad2 size={22} />
        <span className="mt-1">Казино</span>
      </div>
      <div className="flex flex-col items-center text-xs">
        <Menu size={22} />
        <span className="mt-1">Меню</span>
      </div>
    </nav>
  );
};

export default BottomNav;

