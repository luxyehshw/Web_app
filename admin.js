import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), snapshot => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubscribeAnn = onSnapshot(collection(db, "announcements"), snapshot => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeUsers(); unsubscribeAnn();
    };
  }, []);

  const toggleMute = async (userId, muted) => {
    await updateDoc(doc(db, "users", userId), { muted: !muted });
  };

  const deleteUser = async (userId) => {
    await deleteDoc(doc(db, "users", userId));
  };

  const pinAnnouncement = async (annId, pinned) => {
    await updateDoc(doc(db, "announcements", annId), { pinned: !pinned });
  };

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto" }}>
      <h2>Admin Panel</h2>

      <h3>Users</h3>
      {users.map(u => (
        <div key={u.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "5px 0" }}>
          <p>Email: {u.email} | Muted: {u.muted ? "Yes" : "No"} | Premium: {u.premium ? "Yes" : "No"}</p>
          <button onClick={() => toggleMute(u.id, u.muted)}>{u.muted ? "Unmute" : "Mute"}</button>
          <button onClick={() => deleteUser(u.id)}>Delete</button>
        </div>
      ))}

      <h3>Announcements</h3>
      {announcements.map(a => (
        <div key={a.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "5px 0" }}>
          <p>{a.text} | Pinned: {a.pinned ? "Yes" : "No"}</p>
          <button onClick={() => pinAnnouncement(a.id, a.pinned)}>{a.pinned ? "Unpin" : "Pin"}</button>
        </div>
      ))}
    </div>
  );
}
