import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const register = async (email, password) => await createUserWithEmailAndPassword(auth, email, password);
export const login = async (email, password) => await signInWithEmailAndPassword(auth, email, password);
export const logout = async () => await signOut(auth);
