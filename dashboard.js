import { useEffect, useState } from "react";
import { auth, db, storage } from "../lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { logout } from "../lib/auth";
import PostCard from "../components/PostCard";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState(null);
  const [premium, setPremium] = useState(false);
  const [theme, setTheme] = useState("default");
  const router = useRouter();

  useEffect(() => {
    if(!auth.currentUser) router.push("/");
    else {
      const userDoc = doc(db,"users",auth.currentUser.uid);
      getDoc(userDoc).then(docSnap=>{
        if(docSnap.exists()){
          setPremium(docSnap.data().premium || false);
          setTheme(docSnap.data().theme || "default");
        }
      });
    }
  }, []);

  useEffect(()=>{
    const q = query(collection(db,"posts"),orderBy("timestamp","desc"));
    const unsubscribe = onSnapshot(q,(snapshot)=>{
      setPosts(snapshot.docs.map(doc=>({id:doc.id,...doc.data()})));
    });
    return unsubscribe;
  },[]);

  const handleUpload = async ()=>{
    if(!file) return alert("Select file");
    const storageRef = ref(storage, `posts/${auth.currentUser.uid}/${file.name}`);
    await uploadBytes(storageRef,file);
    const url = await getDownloadURL(storageRef);
    await addDoc(collection(db,"posts"),{
      userId: auth.currentUser.uid,
      fileUrl: url,
      type: file.type.startsWith("video") ? "video" : "image",
      timestamp: new Date(),
      sticker: null
    });
    setFile(null);
  };

  return (
    <div style={{maxWidth:"600px",margin:"20px auto"}}>
      <h2>Dashboard</h2>
      <p>Theme: {theme} | Premium: {premium ? "Yes" : "No"}</p>
      <button onClick={logout}>Logout</button>

      <div style={{margin:"10px 0"}}>
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Post</button>
      </div>

      {premium && (
        <div>
          <h4>Use Premium Stickers</h4>
          <div style={{display:"flex",gap:"10px"}}>
            <img src="/stickers/premium1.png" width="60" alt="sticker"/>
            <img src="/stickers/premium2.png" width="60" alt="sticker"/>
            <img src="/stickers/premium3.png" width="60" alt="sticker"/>
          </div>
        </div>
      )}

      <div>
        {posts.map(post=><PostCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}
