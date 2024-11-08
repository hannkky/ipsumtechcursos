import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: 'Usuario',
    lastName: '',
    profileImageUrl: 'https://via.placeholder.com/100',
  });
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false); // Nuevo estado para el mensaje de confirmación

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo({
            firstName: userData.firstName || 'Usuario',
            lastName: userData.lastName || '',
            profileImageUrl: userData.profileImageUrl || 'https://via.placeholder.com/100',
          });
          setDescription(userData.description || '');
          setTags(userData.tags || []);
          setLocation(userData.location || '');
          setProfilePicPreview(userData.profileImageUrl || 'https://via.placeholder.com/100');
        }
      }
    };
    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setProfilePicPreview(URL.createObjectURL(file));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && inputTag.trim() !== '') {
      setTags([...tags, inputTag.trim()]);
      setInputTag('');
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      let profilePicUrl = profilePicPreview;
      if (profilePic) {
        const storageRef = ref(storage, `profilePics/${user.uid}`);
        await uploadBytesResumable(storageRef, profilePic);
        profilePicUrl = await getDownloadURL(storageRef);
      }
      await updateDoc(doc(db, 'users', user.uid), {
        description,
        tags,
        location,
        profileImageUrl: profilePicUrl,
      });

      // Mostrar el mensaje de confirmación
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000); // Ocultar el mensaje después de 3 segundos
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Configure su perfil</h2>

      {showConfirmation && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          ¡Los cambios se han guardado correctamente!
        </div>
      )}
      
      {/* Imagen de perfil y nombre */}
      <div className="flex items-center mb-6">
        <div className="relative">
          <img
            src={profilePicPreview || userInfo.profileImageUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        <div className="ml-4">
          <h3 className="text-xl font-semibold">{userInfo.firstName} {userInfo.lastName}</h3>
          <p className="text-gray-500">{auth.currentUser?.email}</p>
        </div>
      </div>

      {/* Resto de los campos */}
      <div className="mb-4">
        <label className="text-gray-700 font-semibold">Ubicación</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border rounded p-2 w-1/2"
        >
          <option value="">Seleccione una ubicación</option>
          <option value="México">México</option>
          <option value="Colombia">Colombia</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded p-2 w-full h-24"
          placeholder="Escribe una breve descripción sobre ti"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold">Intereses</label>
        <input
          type="text"
          value={inputTag}
          onChange={(e) => setInputTag(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Escribe un interés y presiona Enter"
          className="border rounded p-2 w-full"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
            >
              {tag}
              <button
                className="ml-2 text-red-500"
                onClick={() => setTags(tags.filter((_, i) => i !== index))}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
      >
        Guardar
      </button>
    </div>
  );
};

export default ProfilePage;
