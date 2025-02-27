import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GithubService from "../services/GithubService";
import RepositoryCard from "../components/RepositoryCard";
import { Toaster, toast } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";

const RepositoriesPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const data = await GithubService.getAcceptedAssignments(assignmentId);
        setRepositories(data);
        if (data.length > 0) {
          setAssignmentTitle(data[0].assignment.title);
        }
      } catch (error) {
        toast.error("Error al cargar los repositorios");
      }
    };

    fetchRepositories();
  }, [assignmentId]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster />
      <header className="bg-gray-800 shadow-md py-6 flex justify-between items-center px-6">
        <button
          className="flex items-center text-blue-400 hover:text-blue-500 transition duration-300"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Regresar
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">{assignmentTitle}</h1>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            📁 Repositorios Aceptados
          </h2>
          <div className="space-y-4">
            {repositories.length > 0 ? (
              repositories.map((repo) => (
                <RepositoryCard key={repo.id} repository={repo} />
              ))
            ) : (
              <p className="text-gray-400">No hay repositorios disponibles</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepositoriesPage;
