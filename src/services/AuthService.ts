import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./Firebase/FirebaseConfig";
import { UserType } from "../utils/Types";


export async function registerUser(email: string, password: string, username: string): Promise<UserType | null> {
  try {
    // Crear el usuario con Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Crear documento del usuario en Firestore
    const userData: UserType = {
      id: user.uid,
      email: email,
      username: username
    };
    
    await setDoc(doc(db, "users", user.uid), userData);
    
    // Guardar userId en localStorage
    localStorage.setItem("userId", user.uid);
    
    return userData;
  } catch (error: any) {
    console.error("Error al registrar usuario:", error.message);
    return null;
  }
}

export async function loginUser(email: string, password: string): Promise<boolean> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Guardar userId en localStorage
    localStorage.setItem("userId", user.uid);
    
    return true;
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error.message);
    return false;
  }
}

export async function logoutUser(): Promise<boolean> {
  try {
    await signOut(auth);
    
    // Limpiar localStorage
    localStorage.removeItem("userId");
    
    return true;
  } catch (error: any) {
    console.error("Error al cerrar sesión:", error.message);
    return false;
  }
}

export function isLoggedIn(): boolean {
  return localStorage.getItem("userId") !== null;
}