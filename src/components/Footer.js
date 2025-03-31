import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 text-sm px-4 pt-8 pb-28">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-white font-semibold mb-2">Поддержка</h4>
          <ul>
            <li className="mb-1 hover:text-white cursor-pointer">Техподдержка</li>
            <li className="hover:text-white cursor-pointer">Служба безопасности</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Информация</h4>
          <ul>
            <li className="mb-1 hover:text-white cursor-pointer">Правила</li>
            <li className="mb-1 hover:text-white cursor-pointer">Турниры</li>
            <li className="hover:text-white cursor-pointer">Бонусы</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Казино</h4>
          <ul>
            <li className="mb-1 hover:text-white cursor-pointer">Игры</li>
            <li className="mb-1 hover:text-white cursor-pointer">Live Казино</li>
            <li className="hover:text-white cursor-pointer">Провайдеры</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">Спорт</h4>
          <ul>
            <li className="mb-1 hover:text-white cursor-pointer">Live</li>
            <li className="mb-1 hover:text-white cursor-pointer">Линия</li>
            <li className="hover:text-white cursor-pointer">Киберспорт</li>
          </ul>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-white font-semibold mb-2">Поддержка <span className="bg-lime-400 text-black text-xs font-bold px-2 py-1 rounded ml-1">24/7</span></h4>
        <p className="mb-2">Обратитесь к нам, если есть вопросы</p>
        <button className="bg-gray-800 text-white px-4 py-2 rounded font-semibold">Написать</button>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        {["USDT", "TON", "ETH", "BTC", "+20"].map((coin, idx) => (
          <span key={idx} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">{coin}</span>
        ))}
      </div>

      <button className="bg-gray-800 text-white px-4 py-2 rounded mb-4">Переводы на карту</button>

      <p className="text-center text-xs mt-4 text-gray-500">
        © 2025 Oyuun Games. Oyuun Gaming Ltd (Автономный остров Анжуан). Все права защищены.
      </p>
    </footer>
  );
};

export default Footer;
