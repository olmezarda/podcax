import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

const getFriendlyError = (error: any): string => {
  const code =
    (error?.code ||
     error?.error?.code ||
     error?.message ||
     error?.error?.message ||
     '').toLowerCase();

  if (code.includes('invalid-email')) return 'Please enter a valid email address.';
  if (code.includes('user-not-found')) return 'No account found with this email.';
  if (code.includes('wrong-password') || code.includes('invalid-credential'))
    return 'Incorrect email or password. Please try again.';
  if (code.includes('email-already-in-use')) return 'This email is already in use.';
  if (code.includes('weak-password')) return 'Password must be at least 6 characters.';

  return 'Something went wrong. Please try again.';
};

export const signUp = async (email: string, password: string, username: string, accountType: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: username });
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      username,
      accountType,
      createdAt: serverTimestamp()
    });
    return user;
  } catch (error: any) {
    throw new Error(getFriendlyError(error));
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;
    return { user: userCredential.user, userData };
  } catch (error: any) {
    throw new Error(getFriendlyError(error));
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(getFriendlyError(error));
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(getFriendlyError(error));
  }
};
