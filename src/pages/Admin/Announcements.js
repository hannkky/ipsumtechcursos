import React, { useState, useEffect } from 'react';
import { db, storage, auth } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore'; // Añadido `getDoc`
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaEdit, FaTrash, FaLink, FaImage, FaFile } from 'react-icons/fa';
import ProfileIcon from '../../components/ProfileIcon'; // Asegúrate de tener este componente

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    profileImageUrl: '',
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    attachmentUrls: [],
    coverImageUrl: null,
    scheduledDate: null,
  });
  const [attachments, setAttachments] = useState([]);
  const [link, setLink] = useState('');
  const [links, setLinks] = useState([]);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const querySnapshot = await getDocs(collection(db, 'announcements'));
      const fetchedAnnouncements = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(fetchedAnnouncements);
      setFilteredAnnouncements(fetchedAnnouncements);
    };
    fetchAnnouncements();

    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo({
            firstName: userData.firstName || 'Usuario',
            lastName: userData.lastName || '',
            profileImageUrl: userData.profileImageUrl || 'https://via.placeholder.com/40',
          });
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    setFilteredAnnouncements(
      announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, announcements]);

  const handleCreateAnnouncement = async () => {
    let attachmentUrls = [];
    let coverImageUrl = null;

    if (attachments.length > 0) {
      const uploadedFiles = await Promise.all(
        attachments.map(async (file) => {
          const fileRef = ref(storage, `attachments/${file.name}-${Date.now()}`);
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          return { url, name: file.name, type: file.type.includes('image') ? 'image' : 'file' };
        })
      );
      attachmentUrls = [...attachmentUrls, ...uploadedFiles];
    }

    const linkObjects = links.map(link => ({ url: link, name: link, type: 'link' }));
    attachmentUrls = [...attachmentUrls, ...linkObjects];

    if (coverImage) {
      const coverImageRef = ref(storage, `coverImages/${coverImage.name}-${Date.now()}`);
      await uploadBytes(coverImageRef, coverImage);
      coverImageUrl = await getDownloadURL(coverImageRef);
    }

    const newAnnouncementData = { 
      ...newAnnouncement, 
      attachmentUrls, 
      coverImageUrl,
    };
    
    const docRef = await addDoc(collection(db, 'announcements'), newAnnouncementData);
    const updatedAnnouncements = [...announcements, { id: docRef.id, ...newAnnouncementData }];
    setAnnouncements(updatedAnnouncements);
    setFilteredAnnouncements(updatedAnnouncements);
    setShowModal(false);
    resetAnnouncementForm();
  };

  const handleUpdateAnnouncement = async (id) => {
    let updatedAttachmentUrls = [...newAnnouncement.attachmentUrls];
    let coverImageUrl = newAnnouncement.coverImageUrl;

    if (attachments.length > 0) {
      const newUrls = await Promise.all(
        attachments.map(async (file) => {
          const fileRef = ref(storage, `attachments/${file.name}-${Date.now()}`);
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          return { url, name: file.name, type: file.type.includes('image') ? 'image' : 'file' };
        })
      );
      updatedAttachmentUrls = [...updatedAttachmentUrls, ...newUrls];
    }

    const linkObjects = links.map(link => ({ url: link, name: link, type: 'link' }));
    updatedAttachmentUrls = [...updatedAttachmentUrls, ...linkObjects];

    if (coverImage) {
      const coverImageRef = ref(storage, `coverImages/${coverImage.name}-${Date.now()}`);
      await uploadBytes(coverImageRef, coverImage);
      coverImageUrl = await getDownloadURL(coverImageRef);
    }

    const updatedAnnouncement = { 
      ...newAnnouncement, 
      attachmentUrls: updatedAttachmentUrls, 
      coverImageUrl 
    };
    
    const announcementRef = doc(db, 'announcements', id);
    await updateDoc(announcementRef, updatedAnnouncement);

    const updatedAnnouncements = announcements.map(announcement => 
      announcement.id === id ? { ...updatedAnnouncement, id } : announcement
    );
    setAnnouncements(updatedAnnouncements);
    setFilteredAnnouncements(updatedAnnouncements);
    setShowModal(false);
    resetAnnouncementForm();
  };

  const handleDeleteAnnouncement = async (id) => {
    await deleteDoc(doc(db, 'announcements', id));
    const updatedAnnouncements = announcements.filter(announcement => announcement.id !== id);
    setAnnouncements(updatedAnnouncements);
    setFilteredAnnouncements(updatedAnnouncements);
  };

  const resetAnnouncementForm = () => {
    setNewAnnouncement({ 
      title: '', 
      description: '', 
      date: new Date().toISOString().slice(0, 10), 
      attachmentUrls: [], 
      coverImageUrl: null,
      scheduledDate: null, 
    });
    setAttachments([]);
    setLinks([]);
    setLink('');
    setCoverImage(null);
    setIsEditing(false);
    setEditingIndex(null);
  };

  const addLink = () => {
    if (link && (link.startsWith("http://") || link.startsWith("https://"))) {
      setLinks([...links, link]);
      setLink('');
    } else {
      alert("Por favor ingresa un enlace válido que comience con 'http://' o 'https://'.");
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const removeExistingAttachment = (index) => {
    const updatedUrls = newAnnouncement.attachmentUrls.filter((_, i) => i !== index);
    setNewAnnouncement({ ...newAnnouncement, attachmentUrls: updatedUrls });
  };

  const openModal = (announcement = null, index = null) => {
    if (announcement) {
      setNewAnnouncement(announcement);
      setAttachments([]);
      setLinks([]);
      setLink('');
      setCoverImage(null);
      setIsEditing(true);
      setEditingIndex(index);
    } else {
      resetAnnouncementForm();
    }
    setShowModal(true);
  };

  const openDetailModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDetailModal(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar anuncios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-4 py-2 w-1/3"
        />
        <div className="flex items-center space-x-4">
          <ProfileIcon 
            firstName={userInfo.firstName} 
            lastName={userInfo.lastName} 
            profileImageUrl={userInfo.profileImageUrl} 
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestión de Anuncios</h2>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded flex items-center space-x-2"
          onClick={() => openModal()}
        >
          <FaEdit className="mr-2" /> 
          <span>Crear Nuevo Anuncio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnnouncements.map((announcement, index) => (
          <div key={announcement.id} className="bg-white rounded-lg shadow-lg p-4 cursor-pointer" onClick={() => openDetailModal(announcement)}>
            {announcement.coverImageUrl && (
              <img src={announcement.coverImageUrl} alt="Cover" className="w-full h-32 object-cover rounded mb-2" />
            )}
            <h3 className="text-lg font-semibold">{announcement.title}</h3>
            <p className="text-sm text-gray-600">{announcement.description}</p>
            <p className="text-sm text-gray-600">Fecha: {announcement.date}</p>
            {announcement.scheduledDate && (
              <p className="text-sm text-gray-600">Programado para: {announcement.scheduledDate}</p>
            )}
            <div className="flex space-x-2 mt-4">
              <button
                className="bg-yellow-500 text-white py-1 px-2 rounded"
                onClick={(e) => { e.stopPropagation(); openModal(announcement, index); }}
              >
                <FaEdit /> Editar
              </button>
              <button
                className="bg-red-500 text-white py-1 px-2 rounded"
                onClick={(e) => { e.stopPropagation(); handleDeleteAnnouncement(announcement.id); }}
              >
                <FaTrash /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full overflow-y-auto max-h-screen">
            <h3 className="text-xl font-semibold mb-4">{isEditing ? "Editar Anuncio" : "Crear Nuevo Anuncio"}</h3>
            <input
              type="text"
              placeholder="Título"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <textarea
              placeholder="Descripción"
              value={newAnnouncement.description}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, description: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <label className="text-gray-700 font-semibold">Fecha:</label>
            <input
              type="date"
              value={newAnnouncement.date}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <label className="text-gray-700 font-semibold">Portada del Anuncio:</label>
            <input
              type="file"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="border p-2 w-full mb-2"
              accept="image/*"
            />
            {coverImage || newAnnouncement.coverImageUrl ? (
              <img
                src={coverImage ? URL.createObjectURL(coverImage) : newAnnouncement.coverImageUrl}
                alt="Cover Preview"
                className="w-full h-32 object-cover rounded mb-4"
              />
            ) : null}

            <label className="text-gray-700 font-semibold">Archivos adjuntos:</label>
            <input
              type="file"
              multiple
              onChange={(e) => setAttachments([...attachments, ...Array.from(e.target.files)])}
              className="border p-2 w-full mb-2"
            />
            {attachments.length > 0 && (
              <div className="mb-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center mb-1">
                    <span className="flex-1">{file.name}</span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 ml-2"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}

            {newAnnouncement.attachmentUrls && newAnnouncement.attachmentUrls.length > 0 && (
              <div className="mb-2">
                <h4 className="font-semibold mb-2">Archivos adjuntos existentes:</h4>
                {newAnnouncement.attachmentUrls.map((attachment, index) => (
                  <div key={index} className="flex items-center mb-1">
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline flex-1">
                      {attachment.name || (attachment.type === 'link' ? 'Enlace' : 'Archivo')}
                    </a>
                    <button
                      onClick={() => removeExistingAttachment(index)}
                      className="text-red-500 ml-2"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="text-gray-700 font-semibold">Enlaces adjuntos:</label>
            <div className="flex items-center mb-2">
              <input
                type="text"
                placeholder="URL del enlace (http:// o https://)"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="border p-2 w-full mr-2"
              />
              <button
                onClick={addLink}
                className="bg-green-500 text-white py-1 px-3 rounded"
              >
                Agregar Enlace
              </button>
            </div>
            <div className="mb-2">
              {links.map((link, index) => (
                <div key={index} className="flex items-center mb-1">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline flex-1">
                    {link}
                  </a>
                  <button
                    onClick={() => setLinks(links.filter((_, i) => i !== index))}
                    className="text-red-500 ml-2"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <label className="text-gray-700 font-semibold">Programar para Fecha Específica:</label>
            <input
              type="date"
              value={newAnnouncement.scheduledDate || ""}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, scheduledDate: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={isEditing ? () => handleUpdateAnnouncement(announcements[editingIndex].id) : handleCreateAnnouncement}
              className="bg-blue-500 text-white py-2 px-4 rounded w-full mt-4"
            >
              {isEditing ? "Guardar Cambios" : "Crear Anuncio"}
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded w-full mt-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showDetailModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full overflow-y-auto max-h-screen">
            <h3 className="text-2xl font-semibold mb-2">{selectedAnnouncement.title}</h3>
            {selectedAnnouncement.coverImageUrl && (
              <img src={selectedAnnouncement.coverImageUrl} alt="Cover" className="w-full h-48 object-cover rounded mb-4" />
            )}
            <p className="mb-2 text-gray-700">{selectedAnnouncement.description}</p>
            <p className="text-sm text-gray-600 mb-2">Fecha: {selectedAnnouncement.date}</p>
            {selectedAnnouncement.scheduledDate && (
              <p className="text-sm text-gray-600 mb-2">Programado para: {selectedAnnouncement.scheduledDate}</p>
            )}
            
            <div className="mt-4">
              {selectedAnnouncement.attachmentUrls && selectedAnnouncement.attachmentUrls.map((attachment, index) => (
                <div key={index} className="mb-2 flex items-center">
                  {attachment.type === 'link' ? (
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline flex items-center">
                      <FaLink className="mr-2" /> {attachment.name || 'Enlace'}
                    </a>
                  ) : attachment.type === 'image' ? (
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline flex items-center">
                      <FaImage className="mr-2" /> {attachment.name || 'Imagen'}
                    </a>
                  ) : (
                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline flex items-center">
                      <FaFile className="mr-2" /> {attachment.name || 'Archivo'}
                    </a>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="bg-blue-500 text-white py-2 px-4 rounded w-full mt-4"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;

