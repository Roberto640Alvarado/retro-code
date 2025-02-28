import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import GithubService from "../services/GithubService";
import FeedbackService from "../services/FeedbackService";
import FeedbackSection from "../components/FeedbackSection";
import { FaGithub, FaArrowLeft } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

function DetailRepository() {
  const { repoName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [testDetails, setTestDetails] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const grade = location.state?.grade || "Sin calificar"; 
  const assignmentTitle = `Reporte de Calificación: ${repoName}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testData = await GithubService.getRepoWorkflowDetails(repoName);
        if (!testData) {
          toast.error("No se encontraron detalles del workflow.");
        }
        setTestDetails(testData);

        const feedbackData = await FeedbackService.getRepoFeedback(repoName);
        if (!feedbackData) {
          toast.error("No se encontró feedback.");
        }
        setFeedback(feedbackData);
      } catch (error) {
        toast.error("Error al obtener datos.");
      }
    };

    fetchData();
  }, [repoName]);

  //Función para generar feedback con FIX
  const handleGenerateFeedback = async () => {
    setIsGeneratingFeedback(true);
    const loadingToastId = toast.loading("Generando feedback...");

    try {
      const repoFiles = await GithubService.getRepoFiles(repoName);
      if (!repoFiles || !repoFiles.readme || !repoFiles.code) {
        toast.error("No se pudieron obtener los archivos del repositorio.");
        return;
      }

      const newFeedback = await FeedbackService.generateFeedback(repoName, repoFiles.readme, repoFiles.code, grade);

      if (newFeedback) {
        setFeedback(newFeedback);
        toast.success("Feedback generado con éxito.");
      } else {
        toast.error("No se pudo generar feedback.");
      }
    } catch (error) {
      toast.error("Error al generar feedback.");
    } finally {
      toast.dismiss(loadingToastId);
      setIsGeneratingFeedback(false);
    }
  };

  //Función para agregar feedback al PR
  const handleAddFeedbackToPR = async () => {
    if (!feedback || !feedback.feedback) {
      toast.error("No hay feedback disponible para enviar.");
      return;
    }

    const response = await GithubService.addFeedbackToPR(repoName, feedback.feedback);
    
    if (response) {
      toast.success("Feedback agregado al Pull Request con éxito!");
    } else {
      toast.error("Hubo un problema al agregar el feedback al PR.");
    }
  };

  if (!testDetails) {
    return <div className="text-white text-center mt-10">Cargando detalles del workflow...</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white flex flex-col">
      <Toaster />
      
      <header className="bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between fixed w-full top-0 z-10">
        <button
          className="flex items-center text-blue-400 hover:text-blue-500 transition duration-300"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" /> Regresar
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-center flex-1">{assignmentTitle}</h1>
      </header>

      <div className="mt-20 p-6 flex justify-center w-full">
        <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg">
          
          {/* Información general */}
          <h2 className="text-3xl font-bold text-white">{testDetails.repo}</h2>
          <p className="text-gray-400">Workflow: {testDetails.workflow_name}</p>
          <p className="text-gray-400">Estado: {testDetails.status}</p>
          <p className="text-gray-400">Conclusión: {testDetails.conclusion}</p>
          <p className="text-lg font-bold mt-2">
            Calificación:{" "}
            <span className="text-green-400">{grade}</span>
          </p>

          <a href={testDetails.run_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 flex items-center gap-2 mt-2 underline">
            <FaGithub /> Ver ejecución en GitHub
          </a>

          {/* Botón Generar Feedback*/}
          {!feedback && (
            <button
              className={`mt-6 w-full px-6 py-2 rounded-md text-white transition shadow-lg ${
                isGeneratingFeedback ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
              }`}
              onClick={handleGenerateFeedback}
              disabled={isGeneratingFeedback}
            >
              {isGeneratingFeedback ? "Generando..." : "Generar Feedback"}
            </button>
          )}

          {/* Sección Feedback */}
          <FeedbackSection feedback={feedback} handleAddFeedbackToPR={handleAddFeedbackToPR} />
        </div>
      </div>
    </div>
  );
}

export default DetailRepository;


