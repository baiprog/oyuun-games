import React, { useState, useEffect } from "react";
import BottomNav from "./components/BottomNav";
import GameSlider from "./components/GameSlider";
import GameFilters from "./components/GameFilters";
import TournamentSlider from "./components/TournamentSlider";
import Footer from "./components/Footer";
import RegisterModal from "./components/RegisterModal";
import LoginModal from "./components/LoginModal";
import WalletModal from "./components/WalletModal";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Home, Wallet, Gamepad2, Menu } from "lucide-react";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [triggerWalletAfterAuth, setTriggerWalletAfterAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setBalance(data.balance || 0);
        }
        if (triggerWalletAfterAuth) {
          setTriggerWalletAfterAuth(false);
          setShowWallet(true);
        }
      } else {
        setBalance(0);
      }
    });
    return () => unsubscribe();
  }, [triggerWalletAfterAuth]);

  const handleRegistrationSuccess = () => {
    setShowRegister(false);
    setTriggerWalletAfterAuth(true);
  };

  const handleFakeDeposit = async (amount, method) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "deposits"), {
        userId: user.uid,
        amount,
        method,
        status: "success",
        createdAt: serverTimestamp(),
      });
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const currentBalance = userSnap.data().balance || 0;
      await setDoc(userRef, { balance: currentBalance + amount }, { merge: true });
      setBalance(currentBalance + amount);
      setShowWallet(false);
      alert("✅ Пополнение прошло успешно");
    } catch (error) {
      console.error("Ошибка пополнения:", error);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen pb-24">
      <header className="flex justify-between items-center px-4 py-3">
        <div className="text-lg font-bold">OYUUN GAMES</div>

        {user ? (
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-zinc-800 px-3 py-1 rounded-full text-sm font-semibold">
              <span className="bg-lime-400 text-black px-1 py-0.5 rounded-full text-xs mr-1">₽</span>
              <span>{balance.toFixed(2)}</span>
            </div>
            <button
              className="bg-lime-400 text-black rounded-full w-8 h-8 flex items-center justify-center text-2xl font-bold"
              onClick={() => setShowWallet(true)}
            >
              <Wallet size={18} />
            </button>
            <button className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl">
              👤
            </button>
          </div>
        ) : (
          <div className="space-x-2">
            <button
              className="bg-gray-800 text-white px-3 py-1 rounded"
              onClick={() => setShowLogin(true)}
            >
              Вход
            </button>
            <button
              className="bg-lime-400 text-black px-3 py-1 rounded font-bold"
              onClick={() => setShowRegister(true)}
            >
              Регистрация
            </button>
          </div>
        )}
      </header>

      <section className="px-4">
        <h1 className="text-3xl font-bold mb-2">Игры Дыгына</h1>
        import BannerSlider from "./components/BannerSlider";
// ...
<BannerSlider />
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

      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSuccess={handleRegistrationSuccess}
      />
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <WalletModal
        isOpen={showWallet}
        onClose={() => setShowWallet(false)}
        onDeposit={handleFakeDeposit}
      />
    </div>
  );
}

export default App;







