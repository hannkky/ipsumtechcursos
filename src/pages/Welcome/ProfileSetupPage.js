import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../firebase';
import { CameraIcon, XIcon } from '@heroicons/react/solid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ipLogo from '../../assets/icons/iplogo.svg';

const ProfileSetupPage = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [countries, setCountries] = useState([]);
  const [tagColors] = useState([
    'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-red-100', 'bg-purple-100', 
    'bg-pink-100', 'bg-teal-100', 'bg-orange-100', 'bg-indigo-100'
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    // Lista de países (puedes expandirla)
    const fetchCountries = async () => {
      const countryList = [
        'México', 'Estados Unidos', 'Canadá', 'España', 'Argentina', 
        'Colombia', 'Perú', 'Chile', 'Brasil', 'Uruguay', 'Paraguay', 
        'Venezuela', 'Panamá', 'Costa Rica', 'Guatemala'
      ];
      setCountries(countryList);
    };
    fetchCountries();

    // Obtener datos del usuario actual
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserName(userData.firstName || 'Usuario');
          setEmail(userData.email || 'email@ejemplo.com');
        }
      }
    };
    fetchUserData();
  }, []);

  // Agregar una etiqueta
  const handleAddTag = (e) => {
    if (e.key === 'Enter' && inputTag.trim() !== '') {
      setTags([...tags, { label: inputTag.trim(), color: tagColors[tags.length % tagColors.length] }]);
      setInputTag('');
    }
  };

  // Cambiar foto de perfil
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setProfilePicPreview(URL.createObjectURL(file));
  };

  // Guardar cambios del perfil
  const handleProfileUpdate = async () => {
    const user = auth.currentUser;
    if (user) {
      if (profilePic) {
        const storageRef = ref(storage, `profilePics/${user.uid}`);
        const uploadTask = uploadBytesResumable(storageRef, profilePic);

        uploadTask.on(
          'state_changed',
          null,
          (error) => console.error('Error uploading file:', error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, 'users', user.uid), {
              description,
              tags: tags.map((tag) => tag.label),
              profilePic: downloadURL,
              location,
            });
            toast.success('¡Perfil actualizado correctamente!');
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000); // Espera 2 segundos antes de redirigir
          }
        );
      } else {
        await updateDoc(doc(db, 'users', user.uid), {
          description,
          tags: tags.map((tag) => tag.label),
          profilePic: 'default-gray-profile.png',
          location,
        });
        toast.success('¡Perfil actualizado correctamente!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000); // Espera 2 segundos antes de redirigir
      }
    }
  };

  // Saltar configuración
  const handleSkip = async () => {
    const user = auth.currentUser;
    await updateDoc(doc(db, 'users', user.uid), {
      profilePic: 'default-gray-profile.png',
    });
    toast.info('Perfil configurado, saltando...');
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000); // Espera 2 segundos antes de redirigir
  };

  // Eliminar todas las etiquetas
  const handleRemoveAllTags = () => {
    setTags([]);
  };

  // Verificar si todos los campos están llenos
  const isFormValid = () => {
    return profilePicPreview && description.trim() && location.trim();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Barra azul izquierda */}
      <div className="w-64 bg-[#1e3a8a] flex flex-col items-start px-6 py-8">
        <img src={ipLogo} alt="Logo" className="w-14 h-14 mb-4" style={{ textAlign: 'left' }} />
        <h1 className="text-white text-[1.875rem] font-bold leading-[2.25rem]">
          Ipsum<br />Learning
        </h1>
      </div>

      {/* Contenedor principal alineado a la izquierda */}
      <div className="flex-1 p-10">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        
        <h2 className="text-2xl font-bold mb-4">Configura tu perfil</h2>
        
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-0">
          <div className="flex justify-start items-center mb-6">
            <div className="flex items-center">
              {/* Foto de perfil o círculo para subir */}
              <div className="relative">
                <label className="block w-24 h-24 rounded-full bg-blue-400 cursor-pointer">
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-white">
                      <CameraIcon className="h-6 w-6" />
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Nombre y correo del usuario */}
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{userName}</h3>
                <p className="text-gray-500">{email}</p>
              </div>
            </div>
            <div className="ml-auto">
              <label className="text-sm font-semibold text-gray-700">Ubicación</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full mt-2"
              >
                <option value="">Selecciona tu país</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full mt-2"
              placeholder="Escribe una breve descripción sobre ti"
            />
          </div>

          {/* Intereses (etiquetas) */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-gray-700">Intereses</label>
              <button onClick={handleRemoveAllTags} className="text-red-500 hover:text-red-700">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <input
              type="text"
              value={inputTag}
              onChange={(e) => setInputTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Escribe una etiqueta y presiona Enter"
              className="border border-gray-300 rounded-lg p-3 w-full mt-2"
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className={`${tag.color} border ${tag.color.replace('bg-', 'border-')} text-black px-3 py-1 rounded-full text-sm flex items-center gap-2`}
                >
                  {tag.label}
                  <button
                    className="text-gray-500 hover:text-red-500 transition"
                    onClick={() => setTags(tags.filter((_, i) => i !== index))}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleProfileUpdate}
              className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition"
              disabled={!isFormValid()}
            >
              Guardar
            </button>
            <button
              onClick={handleSkip}
              className="bg-gray-300 text-black py-2 px-6 rounded-full hover:bg-gray-400 transition"
            >
              Saltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
