// src/hooks/useUserRole.js
import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [adminType, setAdminType] = useState(null); // Si deseas diferenciar entre 'admin' y 'principal'
  const [loadingRole, setLoadingRole] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoadingRole(true); // Indica que se está verificando el rol del usuario
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role); // Asigna el rol, ej. 'admin', 'moderador', 'user'
            setAdminType(userData.adminType || null); // Si tienes un tipo específico para admin
          } else {
            console.error("El documento del usuario no existe.");
            setUserRole(null);
            setAdminType(null);
          }
        } catch (error) {
          console.error("Error al obtener el rol del usuario:", error);
        }
      } else {
        setUserRole(null);
        setAdminType(null);
      }
      setLoadingRole(false); // Indica que la verificación ha terminado
    });

    return () => unsubscribe(); // Limpia la suscripción
  }, []);

  return { userRole, adminType, loadingRole };
};

export default useUserRole;
