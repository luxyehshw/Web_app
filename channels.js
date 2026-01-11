import { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import ChannelCard from "../components/ChannelCard";

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "channels"), (snapshot) => {
      setChannels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const createChannel = async () => {
    if (!name) return;
    await addDoc(collection(db, "channels"), {
      name,
      ownerId: auth.currentUser.uid,
      timestamp: new Date(),
    });
    setName("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>Channels</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Channel Name" />
      <button onClick={createChannel}>Create Channel</button>

      <div style={{ marginTop: "20px" }}>
        {channels.map(ch => <ChannelCard key={ch.id} channel={ch} />)}
      </div>
    </div>
  );
}
