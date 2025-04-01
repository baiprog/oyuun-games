import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, query, where, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";

const adminUIDs = [
  "HmPMtwTgAvcPQX6dR4I4OcGyYxo2", // 🔒 Заменить на реальные UID админов
  "adminUID2"
];

const ToyonPanel = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && adminUIDs.includes(user.uid)) {
      fetchRequests();
      fetchUsers();
    }
  }, [user, filterStatus]);

  const fetchRequests = async () => {
    let q = query(collection(db, "withdraw_requests"));
    if (filterStatus !== "all") {
      q = query(collection(db, "withdraw_requests"), where("status", "==", filterStatus));
    }
    const snapshot = await getDocs(q);
    const requestsWithEmails = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        let email = "не указан";
        if (data.userId) {
          const userRef = doc(db, "users", data.userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            email = userSnap.data().email || email;
          }
        }
        return {
          id: docSnap.id,
          ...data,
          email,
          createdAt: data.createdAt?.toDate ? format(data.createdAt.toDate(), "dd.MM.yyyy HH:mm") : "—"
        };
      })
    );
    setRequests(requestsWithEmails);
  };

  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const allUsers = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? format(data.createdAt.toDate(), "dd.MM.yyyy HH:mm") : "—"
      };
    });
    setUsers(allUsers);
  };

  const handleStatusChange = async (id, newStatus) => {
    const requestRef = doc(db, "withdraw_requests", id);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) return;

    const requestData = requestSnap.data();

    if (newStatus === "approved") {
      const userRef = doc(db, "users", requestData.userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentBalance = userSnap.data().balance || 0;
        const newBalance = currentBalance - requestData.amount;
        if (newBalance >= 0) {
          await updateDoc(userRef, { balance: newBalance });
        } else {
          alert("Недостаточно средств у пользователя");
          return;
        }
      }
    }

    await updateDoc(requestRef, { status: newStatus });
    fetchRequests();
  };

  if (!user || !adminUIDs.includes(user.uid)) {
    return <div className="p-4 text-white">Нет доступа</div>;
  }

  return (
    <div className="p-4 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Toyon — Админ панель</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Заявки на вывод</h2>
        <div className="mb-4">
          <label className="mr-2">Фильтр по статусу:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-zinc-800 text-white p-2 rounded"
          >
            <option value="all">Все</option>
            <option value="pending">Ожидает</option>
            <option value="approved">Одобрено</option>
            <option value="rejected">Отклонено</option>
          </select>
        </div>

        <div className="space-y-3">
          {requests.length === 0 ? (
            <div>Нет заявок</div>
          ) : (
            requests.map((r) => (
              <div key={r.id} className="bg-zinc-800 rounded p-4">
                <div><strong>Email:</strong> {r.email}</div>
                <div><strong>Метод:</strong> {r.method}</div>
                <div><strong>Сумма:</strong> {r.amount} ₽</div>
                <div><strong>Статус:</strong> {r.status}</div>
                <div><strong>Создано:</strong> {r.createdAt}</div>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => handleStatusChange(r.id, "approved")}
                    className="bg-lime-400 text-black px-3 py-1 rounded"
                  >
                    Одобрить
                  </button>
                  <button
                    onClick={() => handleStatusChange(r.id, "rejected")}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Отклонить
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Пользователи</h2>
        {users.length === 0 ? (
          <div>Нет пользователей</div>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div key={u.id} className="bg-zinc-800 rounded p-4">
                <div><strong>Email:</strong> {u.email || "не указан"}</div>
                <div><strong>Баланс:</strong> {u.balance?.toFixed(2) || "0.00"} ₽</div>
                <div><strong>Промокод:</strong> {u.promo || "—"}</div>
                <div><strong>Дата регистрации:</strong> {u.createdAt}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToyonPanel;
