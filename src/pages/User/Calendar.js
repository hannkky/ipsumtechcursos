import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, onSnapshot, query, where, orderBy, getDoc, doc } from 'firebase/firestore';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', profileImageUrl: '' });

  // Obtener información del usuario
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserInfo({
            firstName: data.firstName || 'Usuario',
            lastName: data.lastName || '',
            profileImageUrl: data.profileImageUrl || 'https://via.placeholder.com/40',
          });
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Obtener eventos y anuncios
  useEffect(() => {
    const fetchEvents = onSnapshot(
      query(collection(db, 'events'), where('endDate', '>=', new Date().toISOString())),
      (snapshot) => setEvents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );

    const fetchAnnouncements = onSnapshot(
      query(collection(db, 'announcements'), orderBy('date', 'desc')),
      (snapshot) => setAnnouncements(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );

    return () => {
      fetchEvents();
      fetchAnnouncements();
    };
  }, []);

  // Filtrar eventos y anuncios según el término de búsqueda
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex p-8 space-x-4">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Buscar eventos o anuncios..."
            className="border rounded-lg px-4 py-2 w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            <img
              src={userInfo.profileImageUrl}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-semibold">{userInfo.firstName} {userInfo.lastName}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Primera columna - Calendario y lista de eventos/anuncios */}
          <div className="col-span-1 bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Calendario</h2>
            <Calendar
              tileContent={({ date }) => {
                const eventsForDate = filteredEvents.filter(
                  (event) =>
                    new Date(event.startDate).toDateString() === date.toDateString() ||
                    new Date(event.endDate).toDateString() === date.toDateString()
                );
                return eventsForDate.length > 0 ? (
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    {eventsForDate.length}
                  </div>
                ) : null;
              }}
            />
            <h2 className="text-lg font-semibold mt-6 mb-4">Lista de Eventos</h2>
            <ul className="text-sm">
              {filteredEvents.map((event) => (
                <li key={event.id} className="mb-2">
                  <span className="font-semibold">{event.title}</span>
                  <p className="text-gray-600">
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
            <h2 className="text-lg font-semibold mt-6 mb-4">Lista de Anuncios</h2>
            <ul className="text-sm">
              {filteredAnnouncements.map((announcement) => (
                <li key={announcement.id} className="mb-2">
                  <span className="font-semibold">{announcement.title}</span>
                  <p className="text-gray-600">{new Date(announcement.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Segunda columna - Detalle de eventos */}
          <div className="col-span-1">
            <h2 className="text-xl font-semibold mb-4">Próximos Eventos</h2>
            <div className="space-y-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white shadow rounded-lg p-4">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-800">{event.description}</p>
                  </div>
                ))
              ) : (
                <p>No hay eventos próximos</p>
              )}
            </div>
          </div>

          {/* Tercera columna - Detalle de anuncios */}
          <div className="col-span-1">
            <h2 className="text-xl font-semibold mb-4">Anuncios Recientes</h2>
            <div className="space-y-4">
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="bg-white shadow rounded-lg p-4">
                    <h3 className="font-bold text-lg">{announcement.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(announcement.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-800">{announcement.description}</p>
                  </div>
                ))
              ) : (
                <p>No hay anuncios recientes</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
