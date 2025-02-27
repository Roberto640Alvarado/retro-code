import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ClassroomCard = ({ classroom }) => {
  const navigate = useNavigate();

  const goToAssignments = () => {
    navigate(`/classrooms/${classroom.id}/assignments`);
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-lg transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl cursor-pointer ${
        classroom.archived ? "bg-gray-900 opacity-70 text-gray-300" : "bg-gray-900 text-white"
      }`}
      onClick={goToAssignments}
    >
      <h3 className="text-lg font-bold truncate">{classroom.name}</h3>
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs mt-2 ${
          classroom.archived ? "bg-gray-600 text-gray-300" : "bg-green-500 text-white"
        }`}
      >
        {classroom.archived ? "Archivado" : "Activo"}
      </span>
      <div className="mt-4 flex justify-between items-center">
        <a
          href={classroom.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-blue-400 hover:text-blue-500 transition duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          Ver Classroom <FaExternalLinkAlt className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default ClassroomCard;




