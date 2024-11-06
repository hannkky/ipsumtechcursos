import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FiArrowLeft, FiBook } from 'react-icons/fi';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [editingLessonIndex, setEditingLessonIndex] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    shortDescription: '',
    about: '',
    category: '',
    visibility: 'all',
    allowedUsers: [],
    thumbnailUrl: null,
    lessons: [],
    durationHours: 0,
    durationMinutes: 0,
  });
  const [newLesson, setNewLesson] = useState({
    title: '',
    shortDescription: '',
    about: '',
    thumbnail: null,
    thumbnailUrl: null,
    resources: [],
    durationHours: 0,
    durationMinutes: 0,
    step: 1,
  });
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCourses();
  }, []);

  const handleThumbnailUpload = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleCreateCourse = async () => {
    const thumbnailUrl = thumbnail ? await handleThumbnailUpload(thumbnail, `courseThumbnails/${newCourse.title}`) : null;
    const newCourseData = { 
      ...newCourse, 
      thumbnailUrl, 
      lessons: [],
      duration: `${newCourse.durationHours}h ${newCourse.durationMinutes}m` 
    };

    delete newCourseData.thumbnail;
    const docRef = await addDoc(collection(db, 'courses'), newCourseData);
    setCourses([...courses, { id: docRef.id, ...newCourseData }]);
    setShowCourseModal(false);
    resetNewCourse();
  };

  const handleUpdateCourse = async (courseId) => {
    const courseRef = doc(db, 'courses', courseId);
    const thumbnailUrl = thumbnail ? await handleThumbnailUpload(thumbnail, `courseThumbnails/${newCourse.title}`) : newCourse.thumbnailUrl;
    const updatedCourse = { 
      ...newCourse, 
      thumbnailUrl, 
      duration: `${newCourse.durationHours}h ${newCourse.durationMinutes}m`
    };

    delete updatedCourse.thumbnail;
    await updateDoc(courseRef, updatedCourse);
    setCourses(courses.map(course => (course.id === courseId ? { ...updatedCourse, id: courseId } : course)));
    setShowCourseModal(false);
    resetNewCourse();
  };

  const handleDeleteCourse = async (courseId) => {
    await deleteDoc(doc(db, 'courses', courseId));
    setCourses(courses.filter(course => course.id !== courseId));
    if (selectedCourse?.id === courseId) setSelectedCourse(null);
  };

  const handleAddOrUpdateLesson = async () => {
    let lessonThumbnailUrl = newLesson.thumbnailUrl;

    if (newLesson.thumbnail instanceof File) {
      lessonThumbnailUrl = await handleThumbnailUpload(newLesson.thumbnail, `lessonThumbnails/${newLesson.title}-${Date.now()}`);
    }

    const lessonData = { 
      ...newLesson, 
      thumbnailUrl: lessonThumbnailUrl, 
      duration: `${newLesson.durationHours}h ${newLesson.durationMinutes}m`
    };

    delete lessonData.thumbnail;

    const updatedLessons = [...selectedCourse.lessons];
    if (isEditingLesson && editingLessonIndex !== null) {
      updatedLessons[editingLessonIndex] = lessonData;
    } else {
      updatedLessons.push(lessonData);
    }

    const courseRef = doc(db, 'courses', selectedCourse.id);
    await updateDoc(courseRef, { lessons: updatedLessons });

    setCourses(courses.map(course => 
      course.id === selectedCourse.id ? { ...course, lessons: updatedLessons } : course
    ));
    setShowLessonModal(false);
    resetNewLesson();
    setIsEditingLesson(false);
    setEditingLessonIndex(null);
    setSelectedCourse({ ...selectedCourse, lessons: updatedLessons });
  };

  const handleEditLesson = (index) => {
    const lesson = selectedCourse.lessons[index];
    setNewLesson({ ...lesson });
    setIsEditingLesson(true);
    setEditingLessonIndex(index);
    setShowLessonModal(true);
  };

  const handleDeleteLesson = async (index) => {
    const updatedLessons = selectedCourse.lessons.filter((_, i) => i !== index);

    const courseRef = doc(db, 'courses', selectedCourse.id);
    await updateDoc(courseRef, { lessons: updatedLessons });

    setCourses(courses.map(course => 
      course.id === selectedCourse.id ? { ...course, lessons: updatedLessons } : course
    ));
  };

  const resetNewCourse = () => {
    setNewCourse({
      title: '',
      shortDescription: '',
      about: '',
      category: '',
      visibility: 'all',
      allowedUsers: [],
      thumbnailUrl: null,
      lessons: [],
      durationHours: 0,
      durationMinutes: 0,
    });
    setThumbnail(null);
  };

  const resetNewLesson = () => {
    setNewLesson({
      title: '',
      shortDescription: '',
      about: '',
      thumbnail: null,
      thumbnailUrl: null,
      resources: [],
      durationHours: 0,
      durationMinutes: 0,
      step: 1,
    });
  };

  const handleThumbnailPreview = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setNewCourse({ ...newCourse, thumbnailUrl: URL.createObjectURL(file) });
  };

  const handleLessonThumbnailPreview = (e) => {
    const file = e.target.files[0];
    setNewLesson({ ...newLesson, thumbnail: file, thumbnailUrl: URL.createObjectURL(file) });
  };

  return (
    <div className="p-8">
      {!selectedCourse ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Gestión de Cursos</h2>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded"
              onClick={() => {
                resetNewCourse();
                setShowCourseModal(true);
              }}
            >
              Crear Nuevo Curso
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.category}</p>
                <p className="text-sm text-gray-600">Duración del curso: {course.duration}</p>
                <p className="text-sm text-gray-600">{course.shortDescription}</p>
                {course.thumbnailUrl && (
                  <img src={course.thumbnailUrl} alt="Thumbnail" className="w-full h-32 object-cover rounded my-2" />
                )}
                <div className="flex space-x-2">
                  <button
                    className="bg-yellow-500 text-white py-1 px-2 rounded"
                    onClick={() => {
                      setNewCourse(course);
                      setThumbnail(null);
                      setShowCourseModal(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() => setSelectedCourse(course)}
                  >
                    Ver Lecciones
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2">
            <button onClick={() => setSelectedCourse(null)} className="flex items-center text-blue-500 mb-4">
              <FiArrowLeft className="mr-2" /> 
              Volver a Cursos
            </button>
            <h3 className="text-2xl font-semibold mb-2">{selectedCourse.title}</h3>
            <p className="mb-2">Descripción breve: {selectedCourse.shortDescription}</p>
            <p className="mb-2">Acerca del curso: {selectedCourse.about}</p>
            <p className="mb-4">Duración total del curso: {selectedCourse.duration}</p>
            {selectedCourse.thumbnailUrl && (
              <img src={selectedCourse.thumbnailUrl} alt="Course Thumbnail" className="w-full h-48 object-cover rounded mb-4" />
            )}
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
              onClick={() => {
                resetNewLesson();
                setIsEditingLesson(false);
                setShowLessonModal(true);
              }}
            >
              Agregar Lección
            </button>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-2">
              <h4 className="text-xl font-semibold mb-4">Contenido del Curso</h4>
              {selectedCourse.lessons.map((lesson, index) => (
                <div key={index} className="p-4 bg-white rounded-lg shadow-md mb-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <FiBook className="text-gray-600 mr-2" />
                    <div>
                      <p className="text-lg font-semibold">Paso {index + 1}: {lesson.title}</p>
                      <p>Duración: {lesson.duration}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-yellow-500 text-white py-1 px-2 rounded"
                      onClick={() => handleEditLesson(index)}
                    >
                      <FaEdit /> Editar
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded"
                      onClick={() => handleDeleteLesson(index)}
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1">
            <h4 className="text-xl font-semibold mb-4">Contenido del Curso</h4>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              {selectedCourse.lessons.map((lesson, index) => (
                <div key={index} className="p-2 flex items-center">
                  <FiBook className="text-gray-600 mr-2" />
                  <span>Paso {lesson.step}: {lesson.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">{newCourse.id ? "Editar Curso" : "Crear Nuevo Curso"}</h3>
            <input
              type="file"
              onChange={handleThumbnailPreview}
              className="mb-2"
            />
            {newCourse.thumbnailUrl && (
              <div className="mb-2">
                <img src={newCourse.thumbnailUrl} alt="Thumbnail" className="w-32 h-32 object-cover mb-2" />
              </div>
            )}
            <input
              type="text"
              placeholder="Título del Curso"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <textarea
              placeholder="Descripción breve"
              value={newCourse.shortDescription}
              onChange={(e) => setNewCourse({ ...newCourse, shortDescription: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <textarea
              placeholder="Acerca del curso"
              value={newCourse.about}
              onChange={(e) => setNewCourse({ ...newCourse, about: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Categoría"
              value={newCourse.category}
              onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <div className="mb-4">
              <label>Duración del Curso:</label>
              <div className="flex space-x-2">
                <select
                  value={newCourse.durationHours}
                  onChange={(e) => setNewCourse({ ...newCourse, durationHours: parseInt(e.target.value) })}
                  className="border p-2"
                >
                  {[...Array(25).keys()].map((hour) => (
                    <option key={hour} value={hour}>{hour} horas</option>
                  ))}
                </select>
                <select
                  value={newCourse.durationMinutes}
                  onChange={(e) => setNewCourse({ ...newCourse, durationMinutes: parseInt(e.target.value) })}
                  className="border p-2"
                >
                  {[0, 15, 30, 45].map((minute) => (
                    <option key={minute} value={minute}>{minute} minutos</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={newCourse.id ? () => handleUpdateCourse(newCourse.id) : handleCreateCourse}
              className="bg-green-500 text-white py-2 px-4 rounded w-full mt-4"
            >
              {newCourse.id ? "Guardar Cambios" : "Crear Curso"}
            </button>
            <button
              onClick={() => setShowCourseModal(false)}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded w-full mt-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-4">{isEditingLesson ? "Editar Lección" : "Agregar Lección"}</h3>
            <input
              type="text"
              placeholder="Título de la Lección"
              value={newLesson.title}
              onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <textarea
              placeholder="Descripción breve"
              value={newLesson.shortDescription}
              onChange={(e) => setNewLesson({ ...newLesson, shortDescription: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <textarea
              placeholder="Acerca de la Lección"
              value={newLesson.about}
              onChange={(e) => setNewLesson({ ...newLesson, about: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <input
              type="file"
              onChange={handleLessonThumbnailPreview}
              className="mb-2"
            />
            {newLesson.thumbnailUrl && (
              <img src={newLesson.thumbnailUrl} alt="Lesson Thumbnail" className="w-32 h-32 object-cover mb-2" />
            )}
            <div className="mb-4">
              <label>Duración de la Lección:</label>
              <div className="flex space-x-2">
                <select
                  value={newLesson.durationHours}
                  onChange={(e) => setNewLesson({ ...newLesson, durationHours: parseInt(e.target.value) })}
                  className="border p-2"
                >
                  {[...Array(25).keys()].map((hour) => (
                    <option key={hour} value={hour}>{hour} horas</option>
                  ))}
                </select>
                <select
                  value={newLesson.durationMinutes}
                  onChange={(e) => setNewLesson({ ...newLesson, durationMinutes: parseInt(e.target.value) })}
                  className="border p-2"
                >
                  {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => (
                    <option key={minute} value={minute}>{minute} minutos</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleAddOrUpdateLesson}
              className="bg-blue-500 text-white py-2 px-4 rounded w-full mt-4"
            >
              {isEditingLesson ? "Guardar Cambios" : "Agregar Lección"}
            </button>
            <button
              onClick={() => setShowLessonModal(false)}
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

export default CourseManagement;

