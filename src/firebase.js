import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7kkeUHVGISrxtvhvSt2LXtpd4mBlbEC4",
  authDomain: "otp-easytym.firebaseapp.com",
  projectId: "otp-easytym",
  storageBucket: "otp-easytym.appspot.com",
  messagingSenderId: "346925092365",
  appId: "1:346925092365:web:6cddd675532707d0178f44",
  measurementId: "G-G4Q8HJK9HZ",
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
// provider.setCustomParameters({
//   prompt: "select_account",
// });
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
