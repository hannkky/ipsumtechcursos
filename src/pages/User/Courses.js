import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, getDoc, setDoc, doc, updateDoc } from 'firebase/firestore';
import ProfileIcon from '../../components/ProfileIcon';

const Badge = ({ courseName, userName, userImage, completionDate, logoImage }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
      <div className="w-24 h-24 bg-cover rounded-full" style={{ backgroundImage: `url(${logoImage})` }}></div>
      <h2 className="text-lg font-bold mt-4">{courseName}</h2>
      <div className="flex items-center mt-2">
        <img src={userImage} alt="Usuario" className="w-8 h-8 rounded-full mr-2" />
        <span className="text-md">{userName}</span>
      </div>
      <p className="text-sm text-gray-500 mt-1">{completionDate}</p>
    </div>
  );
};

const CourseDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', profileImageUrl: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [showBadge, setShowBadge] = useState(false);
  const [showBadgeData, setShowBadgeData] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserInfo({
          firstName: data.firstName || 'Usuario',
          lastName: data.lastName || '',
          profileImageUrl: data.profileImageUrl || 'https://via.placeholder.com/40',
        });
      }

      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const coursesList = coursesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesList);

      const userCoursesRef = collection(db, `users/${user.uid}/user_courses`);
      const progressSnapshot = await getDocs(userCoursesRef);
      const progressList = progressSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const completed = [];
      const inProgress = [];
      const remainingCourses = [...coursesList];

      progressList.forEach((course) => {
        const courseData = remainingCourses.find((c) => c.id === course.id);
        if (courseData) {
          const courseWithInfo = { ...course, title: courseData.title, thumbnailUrl: courseData.thumbnailUrl };
          if (course.completed) {
            completed.push(courseWithInfo);
          } else {
            inProgress.push(courseWithInfo);
          }
          remainingCourses.splice(remainingCourses.indexOf(courseData), 1);
        }
      });

      setCompletedCourses(completed);
      setInProgressCourses(inProgress);
      setCourses(remainingCourses);
    };

    initializeData();
  }, []);

  const startCourse = async (courseId) => {
    const user = auth.currentUser;
    const selected = courses.find((course) => course.id === courseId);

    if (!selected || !user) return;

    const courseProgressRef = doc(db, `users/${user.uid}/user_courses/${courseId}`);
    const courseProgressDoc = await getDoc(courseProgressRef);

    if (!courseProgressDoc.exists()) {
      await setDoc(courseProgressRef, { completed: false, progress: 0 });
      setInProgressCourses((prev) => [
        ...prev,
        { id: courseId, completed: false, progress: 0, title: selected.title, thumbnailUrl: selected.thumbnailUrl },
      ]);
    }

    setSelectedCourse(selected);
    setProgress({ completed: courseProgressDoc.data()?.progress || 0, total: selected.lessons ? selected.lessons.length : 0 });
    setCourses(courses.filter((course) => course.id !== courseId));
  };

  const loadFullCourseData = async (course) => {
    const courseRef = doc(db, 'courses', course.id);
    const courseDoc = await getDoc(courseRef);
    if (courseDoc.exists()) {
      return { id: course.id, ...courseDoc.data() };
    }
    return course;
  };

  const closeCourse = () => {
    if (progress.completed === 0) {
      setCourses((prev) => [...prev, selectedCourse]);
    }
    setSelectedCourse(null);
  };

  const completeLesson = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setProgress((prev) => {
      const newProgress = prev.completed + 1;
      const isCourseComplete = newProgress === prev.total;

      if (isCourseComplete) {
        completeCourse(selectedCourse.id);
      } else {
        updateProgress(selectedCourse.id, newProgress);
      }

      return { ...prev, completed: newProgress };
    });
  };

  const updateProgress = async (courseId, newProgress) => {
    const user = auth.currentUser;
    if (user) {
      const courseRef = doc(db, `users/${user.uid}/user_courses/${courseId}`);
      await updateDoc(courseRef, { progress: newProgress });
    }
  };

  const completeCourse = async (courseId) => {
    const user = auth.currentUser;
    if (user) {
      const courseRef = doc(db, `users/${user.uid}/user_courses/${courseId}`);
      await updateDoc(courseRef, { completed: true, progress: progress.total });

      const completedCourse = inProgressCourses.find((course) => course.id === courseId);
      setCompletedCourses((prev) => [...prev, completedCourse]);
      setInProgressCourses((prev) => prev.filter((course) => course.id !== courseId));
      setSelectedCourse(null);

      const completionDate = new Date().toLocaleDateString();
      setShowBadgeData({
        courseName: completedCourse.title,
        userName: `${userInfo.firstName} ${userInfo.lastName}`,
        userImage: userInfo.profileImageUrl,
        completionDate: completionDate,
        logoImage: 'URL_DE_TU_IMAGEN'
      });
      setShowBadge(true);
      setTimeout(() => setShowBadge(false), 5000);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCourses = courses.filter((course) =>
    course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRetakeCourse = async (course) => {
    const user = auth.currentUser;
    if (user) {
      const courseRef = doc(db, `users/${user.uid}/user_courses/${course.id}`);
      await updateDoc(courseRef, { completed: false, progress: 0 });

      const fullCourse = await loadFullCourseData(course);
      setInProgressCourses((prev) => [
        ...prev,
        { ...fullCourse, completed: false, progress: 0 },
      ]);
      setCompletedCourses((prev) => prev.filter((c) => c.id !== course.id));
      setSelectedCourse(fullCourse);
      setProgress({ completed: 0, total: fullCourse.lessons ? fullCourse.lessons.length : 0 });
    }
  };

  const handleContinueCourse = async (course) => {
    const fullCourse = await loadFullCourseData(course);
    setSelectedCourse(fullCourse);
    setProgress({ completed: course.progress || 0, total: fullCourse.lessons ? fullCourse.lessons.length : 0 });
  };

  return (
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar cursos..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded-lg px-4 py-2 w-1/3"
        />
        <div className="flex items-center space-x-4">
          <ProfileIcon profileImageUrl={userInfo.profileImageUrl} />
          <span className="font-semibold">{userInfo.firstName} {userInfo.lastName}</span>
        </div>
      </div>

      {showBadge && showBadgeData && (
        <Badge 
          courseName={showBadgeData.courseName}
          userName={showBadgeData.userName}
          userImage={showBadgeData.userImage}
          completionDate={showBadgeData.completionDate}
          logoImage={showBadgeData.logoImage}
        />
      )}

      <div className="flex">
        <div className="w-3/4 pr-4">
          <h2 className="text-2xl font-semibold mb-4">Todos los Cursos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCourses.map((course) => (
              course && (
                <div key={`all-${course.id}`} className="bg-white rounded-lg shadow-lg p-4">
                  <h3 className="text-lg font-semibold">{course.title || "Curso sin título"}</h3>
                  {course.thumbnailUrl && <img src={course.thumbnailUrl} alt="Imagen del Curso" className="w-full h-32 object-cover rounded mb-2" />}
                  <p className="text-sm text-gray-600">{course.category || "Sin categoría"}</p>
                  <p className="text-sm text-gray-600">Duración: {course.duration || "Indefinida"}</p>
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
                    onClick={() => startCourse(course.id)}
                  >
                    Comenzar Curso
                  </button>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="w-1/4 space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Cursos en Progreso</h3>
            <ul>
              {inProgressCourses.length > 0 ? (
                inProgressCourses.map((course) => (
                  course && (
                    <li key={`progress-${course.id}`} className="mb-2 flex justify-between items-center">
                      <span>{course.title || "Curso sin título"}</span>
                      <button
                        className="text-blue-500 text-sm"
                        onClick={() => handleContinueCourse(course)}
                      >
                        Continuar
                      </button>
                    </li>
                  )
                ))
              ) : (
                <p>No tienes cursos en progreso</p>
              )}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Cursos Completados</h3>
            <ul>
              {completedCourses.length > 0 ? (
                completedCourses.map((course) => (
                  course && (
                    <li key={`completed-${course.id}`} className="mb-2 flex justify-between items-center">
                      <span>{course.title || "Curso sin título"}</span>
                      <button
                        className="text-green-500 text-sm"
                        onClick={() => handleRetakeCourse(course)}
                      >
                        Volver a tomar
                      </button>
                    </li>
                  )
                ))
              ) : (
                <p>No tienes cursos completados</p>
              )}
            </ul>
          </div>
        </div>
      </div>

      {selectedCourse && (
        <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">{selectedCourse.title || "Curso sin título"}</h3>
            <button onClick={closeCourse} className="text-red-500">
              Cerrar Curso
            </button>
          </div>
          <p className="text-gray-600 mb-4">{selectedCourse.description || "Sin descripción"}</p>
          {selectedCourse.thumbnailUrl && (
            <img src={selectedCourse.thumbnailUrl} alt="Imagen del Curso" className="w-full h-48 object-cover rounded mb-4" />
          )}
          <h4 className="text-xl font-semibold mb-2">Lecciones</h4>
          <ul className="space-y-2">
            {selectedCourse.lessons?.map((lesson, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{lesson.title || "Lección sin título"}</span>
                {index === progress.completed && (
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={completeLesson}
                  >
                    {index === progress.total - 1 ? "Completar Curso" : "Marcar como Completado"}
                  </button>
                )}
              </li>
            ))}
          </ul>
          <p className="text-sm mt-2">
            Lecciones completadas: {progress.completed} / {progress.total}
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseDashboard;
