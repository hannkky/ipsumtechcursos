import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ipLogo from '../../assets/icons/ipsumlogo.svg';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const validDomains = ["@ipsumtechnology.co", "@ipsumtechnology.mx"];
    return validDomains.some(domain => email.endsWith(domain));
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setModalMessage('Por favor, completa todos los campos.');
      setShowModal(true);
      return;
    }

    if (!validateEmail(email)) {
      setModalMessage('El correo debe terminar con @ipsumtechnology.co o @ipsumtechnology.mx');
      setShowModal(true);
      return;
    }

    if (password !== confirmPassword) {
      setModalMessage('Las contraseñas no coinciden.');
      setShowModal(true);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        role: 'user',
        location: null,
        tags: [],
        description: '',
        createdAt: new Date(),
      });

      navigate('/profile-setup');
    } catch (err) {
      setModalMessage('Hubo un error al crear la cuenta.');
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/2 bg-gradient-to-br from-[#8ec641] via-[#06a3da] to-[#8ec641] text-white flex items-center justify-center p-12">
        {/* Sección izquierda */}
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-8">
        <img src={ipLogo} alt="App Logo" className="w-16 mb-4" />

        <h2 className="text-2xl font-semibold mb-2">Crea tu cuenta</h2>

        <div className="w-full max-w-sm">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <input
            type="text"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border p-3 w-full mb-4 rounded-lg"
          />

          <input
            type="text"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border p-3 w-full mb-4 rounded-lg"
          />

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

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-3 w-full mb-4 rounded-lg"
          />

          <button
            onClick={handleRegister}
            className="w-full bg-[#07a3da] text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Crear Cuenta
          </button>

          <p className="text-center text-sm mt-4">
            ¿Ya tienes cuenta? <span onClick={() => navigate('/')} className="text-[#07a3da] cursor-pointer">Inicia sesión aquí</span>
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p>{modalMessage}</p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-full mt-4" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;