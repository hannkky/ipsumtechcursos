import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ProfileIcon from '../../components/ProfileIcon';

const pastelColors = {
  rojo: '#eeaaaa',
  naranja: '#ffdbbd',
  amarillo: '#f4eeba',
  verde: '#caf5ce',
  azul: '#c5ecff',
  morado: '#d2ccfb',
  rosa: '#ffcfef'
};

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    profileImageUrl: '',
  });
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date().toISOString().slice(0, 16),
    tags: [],
    color: pastelColors.red
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const fetchedEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(fetchedEvents);
      setFilteredEvents(fetchedEvents);
    };
    fetchEvents();

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
    setFilteredEvents(
      events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, events]);

  const handleCreateEvent = async () => {
    const docRef = await addDoc(collection(db, 'events'), newEvent);
    const updatedEvents = [...events, { id: docRef.id, ...newEvent }];
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
    setShowModal(false);
    resetEventForm();
  };

  const handleUpdateEvent = async (id) => {
    const eventRef = doc(db, 'events', id);
    await updateDoc(eventRef, newEvent);
    const updatedEvents = events.map(event => 
      event.id === id ? { ...newEvent, id } : event
    );
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
    setShowModal(false);
    resetEventForm();
  };

  const handleDeleteEvent = async (id) => {
    await deleteDoc(doc(db, 'events', id));
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
  };

  const resetEventForm = () => {
    setNewEvent({ 
      title: '', 
      description: '', 
      startDate: new Date().toISOString().slice(0, 16), 
      endDate: new Date().toISOString().slice(0, 16), 
      tags: [], 
      color: pastelColors.red
    });
    setTagInput('');
    setIsEditing(false);
    setEditingIndex(null);
  };

  const openModal = (event = null, index = null) => {
    if (event) {
      setNewEvent(event);
      setIsEditing(true);
      setEditingIndex(index);
    } else {
      resetEventForm();
    }
    setShowModal(true);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !newEvent.tags.includes(tagInput.trim())) {
      setNewEvent({ ...newEvent, tags: [...newEvent.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewEvent({ ...newEvent, tags: newEvent.tags.filter(tag => tag !== tagToRemove) });
  };

  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventStartDate = new Date(event.startDate);
      const eventEndDate = new Date(event.endDate);
      return eventStartDate <= date && date <= eventEndDate;
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const eventsForDate = getEventsForDate(date);
      if (eventsForDate.length === 1) {
        return <div style={{ backgroundColor: eventsForDate[0].color, width: '100%', height: '5px', borderRadius: '5px' }}></div>;
      } else if (eventsForDate.length > 1) {
        return (
          <div className="flex justify-center items-center">
            <span style={{ backgroundColor: '#ffce54', borderRadius: '50%', padding: '3px 6px', color: 'white', fontSize: '12px' }}>
              {eventsForDate.length}
            </span>
          </div>
        );
      }
    }
  };

  const currentDate = new Date();
  const upcomingEvents = filteredEvents.filter(event => new Date(event.endDate) >= currentDate);
  const pastEvents = filteredEvents.filter(event => new Date(event.endDate) < currentDate);

  return (
    <div className="p-8 grid grid-cols-4 gap-4">
      <div className="flex justify-between items-center col-span-4 mb-6">
        <input
          type="text"
          placeholder="Buscar eventos..."
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

      <div className="col-span-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Gestión de Eventos</h2>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded ml-2"
            onClick={() => openModal()}
          >
            Crear Nuevo Evento
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingEvents.map((event, index) => (
            <div key={event.id} className="rounded-lg shadow-lg p-4 bg-white">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-800">{event.description}</p>
              <p className="text-sm">Inicio: {new Date(event.startDate).toLocaleString()}</p>
              <p className="text-sm">Fin: {new Date(event.endDate).toLocaleString()}</p>
              <div className="flex flex-wrap mt-2">
                {event.tags && event.tags.map((tag, index) => (
                  <span key={index} style={{ backgroundColor: event.color }} className="text-gray-800 px-2 py-1 rounded mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex space-x-2 mt-4">
                <button
                  className="bg-yellow-500 text-white py-1 px-2 rounded"
                  onClick={() => openModal(event, index)}
                >
                  <FaEdit /> Editar
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Eventos Pasados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.map((event) => (
              <div key={event.id} className="rounded-lg shadow-lg p-4 bg-gray-100">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-800">{event.description}</p>
                <p className="text-sm">Inicio: {new Date(event.startDate).toLocaleString()}</p>
                <p className="text-sm">Fin: {new Date(event.endDate).toLocaleString()}</p>
                <div className="flex space-x-2 mt-4">
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-1">
        <h2 className="text-xl font-semibold mb-4">Calendario</h2>
        <Calendar
          tileContent={tileContent}
          className="border-2 border-gray-300 rounded-lg p-2 shadow-md bg-white"
        />

        <h2 className="text-xl font-semibold mt-8 mb-4">Eventos Programados</h2>
        <ul>
          {upcomingEvents.map(event => (
            <li key={event.id} className="bg-white rounded-lg shadow-md p-4 mb-2 flex items-center">
              <span className="font-semibold">{event.title}</span>
              <span className="ml-4 text-sm text-gray-600">
                {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">{isEditing ? "Editar Evento" : "Crear Nuevo Evento"}</h3>
            <label className="block mb-1">Título</label>
            <input
              type="text"
              placeholder="Título del evento"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <label className="block mb-1">Descripción</label>
            <textarea
              placeholder="Descripción del evento"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <label className="block mb-1">Fecha y Hora de Inicio</label>
            <input
              type="datetime-local"
              value={newEvent.startDate}
              onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <label className="block mb-1">Fecha y Hora de Fin</label>
            <input
              type="datetime-local"
              value={newEvent.endDate}
              onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <label className="block mb-1">Color del Evento</label>
            <select
              value={newEvent.color}
              onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
              className="border p-2 w-full mb-2"
            >
              {Object.entries(pastelColors).map(([colorName, colorValue]) => (
                <option key={colorName} value={colorValue} style={{ backgroundColor: colorValue }}>
                  {colorName.charAt(0).toUpperCase() + colorName.slice(1)}
                </option>
              ))}
            </select>
            <label className="block mb-1">Etiquetas</label>
            <div className="flex items-center mb-2">
              <input
                type="text"
                placeholder="Añadir etiqueta"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                className="border p-2 w-full"
              />
              <button onClick={handleAddTag} className="ml-2 bg-blue-500 text-white py-1 px-3 rounded">Añadir</button>
            </div>
            <div className="flex flex-wrap">
              {newEvent.tags.map((tag, index) => (
                <span key={index} style={{ backgroundColor: newEvent.color }} className="text-gray-800 px-2 py-1 mr-2 mb-2 flex items-center">
                  {tag}
                  <FaTimes className="ml-2 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                </span>
              ))}
            </div>
            <button
              onClick={isEditing ? () => handleUpdateEvent(events[editingIndex].id) : handleCreateEvent}
              className="bg-blue-500 text-white py-2 px-4 rounded w-full mt-4"
            >
              {isEditing ? "Guardar Cambios" : "Crear Evento"}
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
    </div>
  );
};

export default Events;
