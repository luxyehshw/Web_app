import { useState } from "react";
import { login, register } from "../lib/auth";
import { useRouter } from "next/router";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) await register(email, password);
      else await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>
      <p style={{ marginTop:"10px", color:"blue", cursor:"pointer" }} onClick={()=>setIsRegister(!isRegister)}>
        {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
      </p>
    </div>
  );
}
