import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Вход выполнен:", user);
      onClose();
    } catch (err) {
      console.error("Ошибка входа:", err);
      setError("Неверный email или пароль");
    }
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
            className="bg-zinc-900 rounded-t-2xl w-full max-w-md p-6 pt-4 text-white"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Войти</h2>
              <button onClick={onClose} className="text-white text-xl">✕</button>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-1 p-2 rounded bg-zinc-800 text-white"
                />
              </div>
              <div>
                <label className="text-sm">Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 p-2 rounded bg-zinc-800 text-white"
                />
              </div>
              <div className="text-right text-sm text-lime-400 cursor-pointer hover:underline">
                Восстановить пароль
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <button
                type="submit"
                className="w-full bg-lime-400 text-black font-bold py-2 rounded"
              >
                Войти
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-400">
              Нужен аккаунт? <button className="text-lime-400 font-semibold">Регистрация</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;