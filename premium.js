import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function Premium() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
      // Fetch user's theme from Firestore
      const docRef = doc(db, "users", auth.currentUser.uid);
      docRef.get().then(snapshot => {
        if (snapshot.exists()) {
          setTheme(snapshot.data().theme || "default");
        }
      });
    }
  }, []);

  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme);
    const docRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(docRef, { theme: newTheme });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>Premium Features</h2>
      <p>Welcome, {user?.email}</p>

      <h3>Change Profile Theme</h3>
      <select value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
        <option value="default">Default</option>
        <option value="dark">Dark</option>
        <option value="blue">Blue</option>
        <option value="pink">Pink</option>
      </select>

      <h3>Premium Stickers</h3>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <img src="/stickers/premium1.png" alt="Sticker1" width="60" />
        <img src="/stickers/premium2.png" alt="Sticker2" width="60" />
        <img src="/stickers/premium3.png" alt="Sticker3" width="60" />
      </div>
      <p>These stickers are only usable by premium users.</p>
    </div>
  );
}
