// src/hooks/useUserRole.js
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [adminType, setAdminType] = useState(null);
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoadingRole(true); // Inicia el estado de carga al verificar el usuario
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
          setAdminType(docSnap.data().adminType || null);
        } else {
          console.error("El documento del usuario no existe.");
          setUserRole(null); // O establece un rol predeterminado
          setAdminType(null);
        }
      } else {
        setUserRole(null);
        setAdminType(null);
      }
      setLoadingRole(false); // Finaliza el estado de carga
    });

    return () => unsubscribe(); // Limpia la suscripción
  }, []);

  return { userRole, adminType, loadingRole };
};

export default useUserRole;
