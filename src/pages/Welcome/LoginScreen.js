import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ipLogo from '../../assets/icons/ipsumlogo.svg';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Asegúrate de importar este método correctamente

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const validDomains = ["@ipsumtechnology.co", "@ipsumtechnology.mx"];
    return validDomains.some(domain => email.endsWith(domain));
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setModalMessage('Por favor, completa todos los campos.');
      setShowModal(true);
      return;
    }

    if (!validateEmail(email)) {
      setModalMessage('El correo debe terminar con @ipsumtechnology.co o @ipsumtechnology.mx');
      setShowModal(true);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // Método modificado
      const user = userCredential.user;
      console.log("User logged in:", user.uid);

      // Obtener el rol del usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data:", userData);
        
        // Redirigir al usuario según su rol
        if (userData.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (userData.role === 'moderador') {
          navigate('/moderador-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setModalMessage('No se encontró el rol del usuario.');
        setShowModal(true);
      }
    } catch (err) {
      console.error("Login error:", err);
      setModalMessage('Email o contraseña incorrecta.');
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sección izquierda con el degradado */}
      <div
        className="w-1/2 bg-gradient-to-br from-[#8ec641] via-[#06a3da] to-[#8ec641] text-white flex items-center justify-center p-12"
        style={{
          background: 'linear-gradient(135deg, #8ec641, #06a3da, #06a3da, #8ec641)',
        }}
      >
      </div>

      {/* Sección derecha para el formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <img src={ipLogo} alt="App Logo" className="w-16 mb-4" />

        <h2 className="text-2xl font-semibold mb-2">Un gusto verte de nuevo</h2>

        <div className="w-full max-w-sm">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 w-full mb-4 rounded-lg"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 w-full mb-4 rounded-lg"
          />

          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-sm">
              <input type="checkbox" className="mr-2" />
              Recordarme
            </label>
            <a href="#" className="text-[#07a3da] text-sm">¿Olvidaste tu contraseña?</a>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-[#07a3da] text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Iniciar Sesión
          </button>

          <p className="text-center text-sm mt-4">
            ¿No tienes cuenta? <span onClick={() => navigate('/register')} className="text-[#07a3da] cursor-pointer">Regístrate aquí</span>
          </p>
        </div>

        <footer className="mt-6 text-sm text-gray-500">
        </footer>
      </div>

      {/* Modal para mensajes de error */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p>{modalMessage}</p>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-full mt-4"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
