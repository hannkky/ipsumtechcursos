import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, storage, auth } from '../../firebase';
import { UserIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/solid';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const countries = [
  { value: 'MX', label: 'México' },
  { value: 'CO', label: 'Colombia' },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('user');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', // Campo de contraseña
    role: 'user',
    location: null,
    tags: [],
    tagInput: '',
    profileImageUrl: null,
    description: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        location: countries.find((c) => c.value === doc.data().location) || null,
      }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    if (selectedRole === 'user') return user.role === 'user';
    if (selectedRole === 'moderador') return user.role === 'moderador';
    if (selectedRole === 'admin') return user.role === 'admin';
    return false;
  });

  const handleAddUser = async () => {
    if (!newUser.email.endsWith('@ipsumtechnology.mx') && !newUser.email.endsWith('@ipsumtechnology.co')) {
      alert('El correo debe tener una terminación @ipsumtechnology.mx o @ipsumtechnology.co');
      return;
    }

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      const user = userCredential.user;

      let profileImageUrl = null;
      if (profileImage) {
        const storageRef = ref(storage, `profileImages/${newUser.email}`);
        await uploadBytes(storageRef, profileImage);
        profileImageUrl = await getDownloadURL(storageRef);
      }

      const newUserData = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
        location: newUser.location ? newUser.location.value : null,
        tags: newUser.tags,
        profileImageUrl,
        description: newUser.description,
        uid: user.uid, // Guardamos el UID para referencia
      };

      // Guardar datos adicionales en Firestore
      console.log("Intentando guardar en Firestore:", newUserData);
      await addDoc(collection(db, 'users'), newUserData);
      console.log("Datos guardados en Firestore");

      setUsers([...users, { id: user.uid, ...newUserData, location: newUser.location }]);

      // Resetear campos
      resetNewUser();
      setShowAddUserModal(false);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      alert("Hubo un error al crear el usuario. Por favor, inténtalo de nuevo.");
    }
  };

  const resetNewUser = () => {
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      password: '', // Resetear contraseña
      role: 'user',
      location: null,
      tags: [],
      tagInput: '',
      profileImageUrl: null,
      description: '',
    });
    setProfileImage(null);
    setProfileImagePreview(null);
  };

  const handleDeleteUser = async (userId) => {
    await deleteDoc(doc(db, 'users', userId));
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleRoleChange = async (userId, newRole) => {
    const user = users.find((u) => u.id === userId);
    if (user.role === 'principal') return;

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role: newRole });
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole } : user)));
  };

  const openEditUserModal = (user) => {
    setEditingUser({
      ...user,
      location: countries.find((c) => c.value === user.location) || null,
      tags: user.tags || [],
      tagInput: '',
      profileImageUrl: user.profileImageUrl || null,
      description: user.description || '',
    });
    setProfileImagePreview(user.profileImageUrl || null);
    setShowEditUserModal(true);
  };

  const handleSaveEditUser = async () => {
    if (editingUser && (editingUser.email.endsWith('@ipsumtechnology.mx') || editingUser.email.endsWith('@ipsumtechnology.co'))) {
      let profileImageUrl = editingUser.profileImageUrl;
      if (profileImage) {
        const storageRef = ref(storage, `profileImages/${editingUser.email}`);
        await uploadBytes(storageRef, profileImage);
        profileImageUrl = await getDownloadURL(storageRef);
      }

      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, {
        ...editingUser,
        location: editingUser.location ? editingUser.location.value : null,
        tags: editingUser.tags,
        profileImageUrl,
      });
      setUsers(users.map((user) => (user.id === editingUser.id ? { ...editingUser, profileImageUrl } : user)));
      setShowEditUserModal(false);
      setProfileImage(null);
      setProfileImagePreview(null);
    } else {
      alert('El correo debe tener una terminación @ipsumtechnology.mx o @ipsumtechnology.co');
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && newUser.tagInput.trim() !== '') {
      setNewUser({
        ...newUser,
        tags: [...newUser.tags, newUser.tagInput.trim()],
        tagInput: '',
      });
    }
  };

  const handleEditTagAdd = (e) => {
    if (e.key === 'Enter' && editingUser.tagInput.trim() !== '') {
      setEditingUser({
        ...editingUser,
        tags: [...editingUser.tags, editingUser.tagInput.trim()],
        tagInput: '',
      });
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setNewUser({
      ...newUser,
      tags: newUser.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleEditTagRemove = (tagToRemove) => {
    setEditingUser({
      ...editingUser,
      tags: editingUser.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Directorio</h2>
        <button
          className="bg-orange-500 text-white py-2 px-4 rounded flex items-center hover:bg-orange-600"
          onClick={() => setShowAddUserModal(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Añadir Usuario
        </button>
      </div>

      <div className="flex space-x-4 mb-4">
        {['user', 'moderador', 'admin'].map((role) => (
          <button
            key={role}
            className={`px-4 py-2 rounded ${selectedRole === role ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setSelectedRole(role)}
          >
            {role === 'user' ? 'Usuarios' : role === 'moderador' ? 'Moderadores' : 'Admin'}
          </button>
        ))}
      </div>

      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b font-semibold text-left">Nombre</th>
            <th className="py-2 px-4 border-b font-semibold text-left">Rol</th>
            <th className="py-2 px-4 border-b font-semibold text-left">Email</th>
            <th className="py-2 px-4 border-b font-semibold text-left">Ubicación</th>
            <th className="py-2 px-4 border-b font-semibold text-left">Etiquetas</th>
            <th className="py-2 px-4 border-b font-semibold text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b flex items-center">
                <UserIcon className="h-6 w-6 text-gray-500 mr-2" />
                {user.firstName || 'Sin nombre'}
              </td>
              <td className="py-2 px-4 border-b">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border p-1 rounded"
                  disabled={user.role === 'principal'}
                >
                  <option value="user">Usuario</option>
                  <option value="moderador">Moderador</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.location ? user.location.label : 'No especificada'}</td>
              <td className="py-2 px-4 border-b">
                {user.tags && user.tags.length > 0 ? user.tags.join(', ') : 'Sin etiquetas'}
              </td>
              <td className="py-2 px-4 border-b flex space-x-2">
                <button onClick={() => openEditUserModal(user)} className="text-blue-600 hover:text-blue-800">
                  <PencilIcon className="h-5 w-5" />
                </button>
                {user.role !== 'principal' && (
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Agregar Usuario */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Añadir Usuario</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Apellidos"
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <Select
              options={countries}
              placeholder="Selecciona país"
              onChange={(selected) => setNewUser({ ...newUser, location: selected })}
              className="mb-2"
              value={newUser.location}
            />
            <textarea
              placeholder="Descripción"
              value={newUser.description}
              onChange={(e) => setNewUser({ ...newUser, description: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Añadir etiqueta"
              value={newUser.tagInput}
              onChange={(e) => setNewUser({ ...newUser, tagInput: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newUser.tagInput.trim() !== '') {
                  setNewUser({
                    ...newUser,
                    tags: [...newUser.tags, newUser.tagInput.trim()],
                    tagInput: '',
                  });
                }
              }}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="file"
              onChange={handleImageChange}
              className="border p-2 w-full mb-2 rounded"
            />
            {profileImagePreview && (
              <img src={profileImagePreview} alt="Preview" className="mb-2 w-24 h-24 rounded-full object-cover" />
            )}
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            >
              <option value="user">Usuario</option>
              <option value="moderador">Moderador</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleAddUser}
              className="bg-blue-600 text-white py-2 px-4 rounded mt-2 w-full hover:bg-blue-700"
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setShowAddUserModal(false);
                resetNewUser(); // Limpiar los campos al cancelar
              }}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded mt-2 w-full hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Editar Usuario */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={editingUser.firstName}
              onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Apellidos"
              value={editingUser.lastName}
              onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <Select
              options={countries}
              placeholder="Selecciona país"
              value={editingUser.location}
              onChange={(selected) => setEditingUser({ ...editingUser, location: selected })}
              className="mb-2"
            />
            <textarea
              placeholder="Descripción"
              value={editingUser.description}
              onChange={(e) => setEditingUser({ ...editingUser, description: e.target.value })}
              className="border p-2 w-full mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Añadir etiqueta"
              value={editingUser.tagInput || ''}
              onChange={(e) => setEditingUser({ ...editingUser, tagInput: e.target.value })}
              onKeyDown={handleEditTagAdd}
              className="border p-2 w-full mb-2 rounded"
            />
            <div className="flex flex-wrap mb-2">
              {editingUser.tags.map((tag) => (
                <span key={tag} className="bg-gray-200 px-2 py-1 mr-2 mb-2 rounded flex items-center">
                  {tag}
                  <button
                    className="ml-1 text-red-600 hover:text-red-800"
                    onClick={() => handleEditTagRemove(tag)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              type="file"
              onChange={handleImageChange}
              className="border p-2 w-full mb-2 rounded"
            />
            {profileImagePreview && (
              <img src={profileImagePreview} alt="Preview" className="mb-2 w-24 h-24 rounded-full object-cover" />
            )}
            <button
              onClick={handleSaveEditUser}
              className="bg-blue-600 text-white py-2 px-4 rounded mt-2 w-full hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => {
                setShowEditUserModal(false);
                setEditingUser(null); // Limpiar el usuario editado al cancelar
              }}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded mt-2 w-full hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
