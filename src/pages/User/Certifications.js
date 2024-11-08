import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import ProfileIcon from '../../components/ProfileIcon';

const Badge = ({ badgeData }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg max-w-xs mx-auto">
      <div className="w-24 h-24 bg-cover rounded-full" style={{ backgroundImage: `url(${badgeData.logoImage})` }}></div>
      <h2 className="text-lg font-bold mt-4">{badgeData.courseName}</h2>
      <div className="flex items-center mt-2">
        <img src={badgeData.userImage} alt="Usuario" className="w-8 h-8 rounded-full mr-2" />
        <span className="text-md">{badgeData.userName}</span>
      </div>
      <p className="text-sm text-gray-500 mt-1">{badgeData.completionDate}</p>
    </div>
  );
};

const BadgesDashboard = () => {
  const [badges, setBadges] = useState([]);
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', profileImageUrl: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth.currentUser;
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
    };

    const fetchBadges = async () => {
      const user = auth.currentUser;
      if (user) {
        const badgesSnapshot = await getDocs(collection(db, `users/${user.uid}/badges`));
        const userBadges = badgesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setBadges(userBadges);
      }
    };

    fetchUserInfo();
    fetchBadges();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBadges = badges.filter((badge) =>
    badge.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-4">
      {/* Header with Search Bar and Profile Info */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar insignias..."
          value={searchTerm}
          onChange={handleSearchChange}
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

      <h1 className="text-2xl font-bold mb-4">Mis Insignias</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.length > 0 ? (
          filteredBadges.map((badge) => (
            <Badge
              key={badge.id}
              badgeData={{
                courseName: badge.courseName,
                logoImage: badge.logoImage,
                userName: `${userInfo.firstName} ${userInfo.lastName}`,
                userImage: userInfo.profileImageUrl,
                completionDate: badge.completionDate,
              }}
            />
          ))
        ) : (
          <p>No tienes insignias aún.</p>
        )}
      </div>
    </div>
  );
};

export default BadgesDashboard;
