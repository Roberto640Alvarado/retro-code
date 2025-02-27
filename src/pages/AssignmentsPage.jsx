import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GithubService from "../services/GithubService";
import AssignmentCard from "../components/AssignmentCard";
import { Toaster, toast } from "react-hot-toast";
import { FaArrowLeft, FaHome } from "react-icons/fa";

const AssignmentsPage = () => {
  const { classroomId } = useParams();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [classroomName, setClassroomName] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await GithubService.getAssignments(classroomId);
        setAssignments(data);
        if (data.length > 0) {
          setClassroomName(data[0].classroom.name);
        }
      } catch (error) {
        toast.error("Error al cargar los assignments");
      }
    };

    fetchAssignments();
  }, [classroomId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster />
      
      {/* Header con botones de regreso */}
      <header className="bg-gray-800 shadow-md py-6 flex justify-between items-center px-6">
        <button
          className="flex items-center text-blue-400 hover:text-blue-500 transition duration-300"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Regresar
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">{classroomName}</h1>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            📝 Assignments de la Classroom
          </h2>
          <div className="space-y-4">
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))
            ) : (
              <p className="text-gray-400">No hay assignments disponibles</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AssignmentsPage;

