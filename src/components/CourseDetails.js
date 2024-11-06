import React from 'react';

const CourseDetails = () => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">Cooking class for your summer holiday carbonara recipe</h2>
      <div className="mb-6 flex justify-between items-center">
        <div className="text-sm text-gray-500">Personal | 6 Jan, 10:00 AM | 90 min</div>
        <div className="flex space-x-4">
          <div>
            <span className="font-bold text-lg">01</span> Days
          </div>
          <div>
            <span className="font-bold text-lg">13</span> Hours
          </div>
          <div>
            <span className="font-bold text-lg">24</span> Minutes
          </div>
          <div>
            <span className="font-bold text-lg">19</span> Seconds
          </div>
        </div>
      </div>
      <div className="video-container mb-6">
        <iframe
          width="100%"
          height="400"
          src="https://www.youtube.com/embed/your-video-url"
          title="YouTube video player"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Ingredients Preparation</h3>
        <p className="text-gray-700 mb-4">The dish forms part of a family...</p>
        {/* Aquí puedes agregar más detalles como tabs (Información, Recursos, etc.) */}
      </div>
    </div>
  );
};

export default CourseDetails;
