import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GithubService from "../services/GithubService";
import FeedbackService from "../services/FeedbackService";
import RepositoryCard from "../components/RepositoryCard";
import { Toaster, toast } from "react-hot-toast";
import { FaArrowLeft, FaMagic } from "react-icons/fa";

const RepositoriesPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

  //Función para procesar y generar feedback para TODOS los repositorios
  const handleGenerateFeedbackForAll = async () => {
    setIsGenerating(true);

    const reposWithFiles = [];

    for (const repo of repositories) {

        const repoName = repo.repository?.name || "SinNombre";
        const repoGrade = repo.grade || "Sin Calificación";

        if (repoName === "SinNombre") {
            toast.error("Un repositorio no tiene nombre, no se puede procesar.");
            continue;
        }

        try {
            const repoFiles = await GithubService.getRepoFiles(repoName);

            if (!repoFiles || !repoFiles.readme || !repoFiles.code) {
                toast.error(`No se encontraron archivos en ${repoName}`);
                continue;
            }

            reposWithFiles.push({
                name: repoName,
                grade: repoGrade,
                code: repoFiles.code,
                readme: repoFiles.readme,
            });

        } catch (error) {
            toast.error(`Error obteniendo archivos de ${repoName}`);
        }
    }

    for (const repoData of reposWithFiles) {

        try {
            const feedback = await FeedbackService.generateFeedback(
                repoData.name,
                repoData.readme,
                repoData.code,
                repoData.grade
            );

            if (feedback) {
                toast.success(`Feedback generado para ${repoData.name}`);
            } else {
                toast.error(`No se pudo generar feedback para ${repoData.name}`);
            }
        } catch (error) {
            toast.error(`Error al generar feedback para ${repoData.name}`);
        }
    }

    console.log("✅ Finalizó la generación de feedback para todos los repos.");
    setIsGenerating(false);
};



  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster />
      
      {/*Header con botón de regresar y botón de generación masiva*/}
      <header className="bg-gray-800 shadow-md py-6 flex justify-between items-center px-6">
        <button
          className="flex items-center text-blue-400 hover:text-blue-500 transition duration-300"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Regresar
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">{assignmentTitle}</h1>

        {/* Botón Generar Feedback de Vergazo */}
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition text-white ${
            isGenerating ? "bg-gray-500 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-500"
          }`}
          onClick={handleGenerateFeedbackForAll}
          disabled={isGenerating}
        >
          <FaMagic /> {isGenerating ? "Generando..." : "Generar Retroalimentación"}
        </button>
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

