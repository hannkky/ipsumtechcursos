import React from 'react';

const CourseTimeline = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Fechas Importantes</h2>
      <div className="timeline">
        <div className="timeline-item">
          <div className="timeline-date">10:10 AM</div>
          <div className="timeline-content">
            <p><strong>Karen Hope</strong> attached 2 files to Graphic Design</p>
            <div className="file-attachments">
              <span>Module1_GraphicDesign.doc</span> | <span>1.5 Mb</span>
            </div>
          </div>
        </div>
        {/* Repite más items */}
      </div>
    </div>
  );
};

export default CourseTimeline;
