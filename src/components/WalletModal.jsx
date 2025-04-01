import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addDoc, collection, serverTimestamp, query, where, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

const WalletModal = ({ isOpen, onClose, onDeposit }) => {
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("");
  const [tab, setTab] = useState("deposit");
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const withdrawalsQuery = query(
          collection(db, "withdraw_requests"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const depositsQuery = query(
          collection(db, "deposits"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const [withdrawalsSnap, depositsSnap] = await Promise.all([
          getDocs(withdrawalsQuery),
          getDocs(depositsQuery)
        ]);

        const withdrawals = withdrawalsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: "withdraw" }));
        const deposits = depositsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), type: "deposit" }));

        const combined = [...withdrawals, ...deposits].sort(
          (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
        );

        setHistory(combined);
      } catch (err) {
        console.error("Ошибка загрузки истории:", err);
      }
    };
    if (tab === "history") fetchHistory();
  }, [tab]);

  const handleDeposit = () => {
    if (!amount || !method) return alert("Укажите сумму и способ оплаты");
    onDeposit(Number(amount), method);
  };

  const handleWithdraw = async () => {
    if (!amount || !method) return alert("Укажите сумму и метод вывода");
    const user = auth.currentUser;
    if (!user) return alert("Пользователь не найден");

    try {
      await addDoc(collection(db, "withdraw_requests"), {
        userId: user.uid,
        method,
        amount: Number(amount),
        status: "pending",
        createdAt: serverTimestamp(),
      });
      alert("✅ Заявка на вывод отправлена");
      setAmount(0);
      setMethod("");
      setTab("history");
    } catch (err) {
      console.error("Ошибка при выводе:", err);
      alert("Ошибка при отправке заявки");
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  const statusLabels = {
    pending: "Ожидает",
    approved: "Одобрено",
    rejected: "Отклонено",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-zinc-900 rounded-t-2xl w-full max-w-md p-6 pt-4 text-white overflow-y-auto max-h-[90vh]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Кошелек</h2>
              <button onClick={onClose} className="text-white text-xl">✕</button>
            </div>

            <div className="flex space-x-4 mb-4">
              <button
                className={`px-3 py-1 rounded ${tab === "deposit" ? "bg-lime-400 text-black font-bold" : "bg-zinc-800"}`}
                onClick={() => setTab("deposit")}
              >
                Депозит
              </button>
              <button
                className={`px-3 py-1 rounded ${tab === "withdraw" ? "bg-lime-400 text-black font-bold" : "bg-zinc-800"}`}
                onClick={() => setTab("withdraw")}
              >
                Вывод
              </button>
              <button
                className={`px-3 py-1 rounded ${tab === "history" ? "bg-lime-400 text-black font-bold" : "bg-zinc-800"}`}
                onClick={() => setTab("history")}
              >
                История
              </button>
            </div>

            {tab === "deposit" && (
              <>
                <div className="text-sm mb-2 text-gray-400">Регион оплаты</div>
                <div className="flex items-center mb-4">
                  <img src="https://flagcdn.com/w40/ru.png" alt="russia" className="w-6 h-4 rounded mr-2" />
                  <span>RUB</span>
                </div>

                <div className="mb-4">
                  <label className="text-sm block mb-1">Сумма пополнения</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 rounded bg-zinc-800 text-white mb-4"
                  />
                </div>

                <h3 className="text-md font-semibold mb-2">Выберите метод</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {["SberPay", "СБП", "Карта", "USDT", "TON", "BTC"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`p-3 rounded ${method === m ? "bg-lime-400 text-black font-bold" : "bg-zinc-800"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleDeposit}
                  className="w-full bg-lime-400 text-black font-bold py-2 rounded"
                >
                  Пополнить
                </button>
              </>
            )}

            {tab === "withdraw" && (
              <>
                <div className="mb-4">
                  <label className="text-sm block mb-1">Сумма вывода</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Введите сумму"
                    className="w-full p-2 rounded bg-zinc-800 text-white mb-4"
                  />
                </div>

                <h3 className="text-md font-semibold mb-2">Метод вывода</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {["Карта", "СБП", "USDT", "TON"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`p-3 rounded ${method === m ? "bg-lime-400 text-black font-bold" : "bg-zinc-800"}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleWithdraw}
                  className="w-full bg-lime-400 text-black font-bold py-2 rounded"
                >
                  Отправить заявку
                </button>
              </>
            )}

            {tab === "history" && (
              <>
                <div className="flex space-x-2 mb-4 text-sm">
                  {["all", "deposit", "withdraw"].map((f) => (
                    <button
                      key={f}
                      className={`px-3 py-1 rounded ${filter === f ? "bg-lime-400 text-black font-bold" : "bg-zinc-800"}`}
                      onClick={() => setFilter(f)}
                    >
                      {f === "all" ? "Все" : f === "deposit" ? "Пополнения" : "Выводы"}
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  {filteredHistory.length === 0 ? (
                    <div className="text-center text-sm text-gray-400">История пуста</div>
                  ) : (
                    filteredHistory.map((item) => (
                      <div key={item.id} className="bg-zinc-800 rounded p-3 flex justify-between items-center">
                        <div>
                          <div className="text-sm font-semibold">
                            {item.type === "withdraw" ? "Вывод" : "Пополнение"}
                          </div>
                          <div className="text-xs text-gray-400">Метод: {item.method}</div>
                          {item.type === "withdraw" && (
                            <div className="text-xs mt-1 text-gray-400">Статус: {statusLabels[item.status] || "-"}</div>
                          )}
                        </div>
                        <div
                          className={`text-md font-bold ${item.type === "withdraw" ? "text-red-400" : "text-lime-400"}`}
                        >
                          {item.type === "withdraw" ? "-" : "+"}{item.amount} ₽
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletModal;


