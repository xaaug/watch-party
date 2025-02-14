import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig"; // Make sure the path is correct
import { onAuthStateChanged, User } from "firebase/auth";

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup function
  }, []);

  return { user, loading };
};

export default useAuth;
