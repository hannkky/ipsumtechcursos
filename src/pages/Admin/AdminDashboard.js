import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import { collection, onSnapshot, query, where, orderBy, getDoc, doc } from 'firebase/firestore';
import Sidebar from '../../components/Sidebar';
import DashboardCard from '../../components/DashboardCard';
import ProfileIcon from '../../components/ProfileIcon'; // Eliminamos Notifications
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [allAnnouncements, setAllAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', profileImageUrl: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserInfo({
            firstName: userDoc.data().firstName || 'Usuario',
            lastName: userDoc.data().lastName || '',
            profileImageUrl: userDoc.data().profileImageUrl || '',
          });
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUserCount(snapshot.size);
    });

    const unsubscribeCourses = onSnapshot(collection(db, 'courses'), (snapshot) => {
      setCourseCount(snapshot.size);
    });

    const unsubscribeEvents = onSnapshot(
      query(collection(db, 'events'), where('endDate', '>=', new Date().toISOString())),
      (snapshot) => {
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEventCount(events.length);
        setUpcomingEvents(events);
        setFilteredEvents(events);
      }
    );

    const unsubscribeAnnouncements = onSnapshot(
      query(collection(db, 'announcements'), orderBy('date', 'desc')),
      (snapshot) => {
        const announcements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAnnouncementCount(announcements.length);
        setAllAnnouncements(announcements.slice(0, 5));
        setFilteredAnnouncements(announcements.slice(0, 5));
      }
    );

    return () => {
      unsubscribeUsers();
      unsubscribeCourses();
      unsubscribeEvents();
      unsubscribeAnnouncements();
    };
  }, []);

  useEffect(() => {
    setFilteredEvents(
      upcomingEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredAnnouncements(
      allAnnouncements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, upcomingEvents, allAnnouncements]);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Buscar en eventos y anuncios..."
            className="border rounded-lg px-4 py-2 w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            <ProfileIcon 
              firstName={userInfo.firstName} 
              lastName={userInfo.lastName} 
              profileImageUrl={userInfo.profileImageUrl} 
            />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-6">Panel de Administración</h1>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <DashboardCard title="Usuarios Registrados" count={userCount} icon="👥" bgColor="bg-blue-100" />
          <DashboardCard title="Cursos Activos" count={courseCount} icon="📘" bgColor="bg-green-100" />
          <DashboardCard title="Eventos Activos" count={eventCount} icon="📅" bgColor="bg-yellow-100" />
          <DashboardCard title="Anuncios Activos" count={announcementCount} icon="📢" bgColor="bg-purple-100" />
        </div>

        <div className="flex justify-between items-center mb-8 space-x-4">
          <button onClick={() => navigate('/admin/users')} className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 flex-1 text-center">Gestión de Usuarios</button>
          <button onClick={() => navigate('/admin/courses')} className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 flex-1 text-center">Gestión de Cursos</button>
          <button onClick={() => navigate('/admin/events')} className="bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 flex-1 text-center">Gestión de Eventos</button>
          <button onClick={() => navigate('/admin/announcements')} className="bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 flex-1 text-center">Gestión de Anuncios</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Próximos Eventos</h2>
            <ul>
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <li key={event.id} className="flex justify-between mb-2">
                    <span>{event.title}</span>
                    <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
                  </li>
                ))
              ) : (
                <li>No hay eventos próximos</li>
              )}
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Últimos Anuncios</h2>
            <ul>
              {filteredAnnouncements.length > 0 ? (
                filteredAnnouncements.map(announcement => (
                  <li key={announcement.id} className="flex justify-between mb-2">
                    <span>{announcement.title}</span>
                    <span>{new Date(announcement.date).toLocaleDateString()}</span>
                  </li>
                ))
              ) : (
                <li>No hay anuncios recientes</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
