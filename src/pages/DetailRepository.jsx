import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import GithubService from "../services/GithubService";
import FeedbackService from "../services/FeedbackService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaCheckCircle, FaTimesCircle, FaGithub, FaClipboard } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

function formatFeedbackText(feedback) {
  const parts = feedback.split(/(```cpp|```)/);
  let isCodeBlock = false;

  return parts.map((part, index) => {
    if (part === "```cpp") {
      isCodeBlock = true;
      return null;
    } else if (isCodeBlock && part !== "```") {
      isCodeBlock = false;
      return (
        <div key={index} className="relative">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto mt-2">
            {part.trim()}
          </pre>
          <button
            onClick={() => {
              navigator.clipboard.writeText(part.trim());
              toast.success("Código copiado!");
            }}
            className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-1 rounded-md"
          >
            <FaClipboard />
          </button>
        </div>
      );
    } else if (part === "```") {
      return null;
    } else {
      return (
        <ReactMarkdown
          key={index}
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => <p className="text-gray-300 mt-2" {...props} />,
            strong: ({ node, ...props }) => <strong className="text-yellow-400" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside text-gray-300" {...props} />,
          }}
        >
          {part}
        </ReactMarkdown>
      );
    }
  });
}

function DetailRepository() {
  const { repoName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [testDetails, setTestDetails] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const grade = location.state?.grade || "Sin calificar"; 

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

  if (!testDetails) {
    return <div className="text-white text-center mt-10">Cargando detalles del workflow...</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6 flex justify-center">
      <Toaster />
      <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg">
        
        {/* Nombre del repositorio y calificación */}
        <h1 className="text-3xl font-bold text-white">{testDetails.repo}</h1>
        <p className="text-gray-400">Workflow: {testDetails.workflow_name}</p>
        <p className="text-gray-400">Estado: {testDetails.status}</p>
        <p className="text-gray-400">Conclusión: {testDetails.conclusion}</p>
        <p className="text-lg font-bold mt-2">
          Calificación:{" "}
          <span className="text-green-400">{grade}</span>
        </p>

        <a
          href={testDetails.run_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 flex items-center gap-2 mt-2 underline"
        >
          <FaGithub /> Ver ejecución en GitHub
        </a>

        {/* Resultados de Tests */}
        <h2 className="text-2xl font-bold mt-6">Resultados de Tests</h2>
        <div className="bg-gray-700 p-4 rounded-md mt-2 space-y-4">
          {testDetails.testResults.map((test, index) => (
            <div
              key={index}
              className={`p-4 rounded-md text-white flex items-center justify-between ${
                test.conclusion === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              <div>
                <h3 className="text-lg font-semibold">{test.test_name}</h3>
                <p>Estado: {test.status}</p>
                <p>Conclusión: {test.conclusion}</p>
              </div>
              {test.conclusion === "success" ? (
                <FaCheckCircle className="text-white text-xl" />
              ) : (
                <FaTimesCircle className="text-white text-xl" />
              )}
            </div>
          ))}
        </div>

        {/* Espacio para el feedback */}
        {feedback && (
          <div className="mt-8 p-6 bg-gray-700 rounded-md">
            <h2 className="text-xl font-semibold mb-2">📌 Feedback del Código</h2>
            <div className="mt-4">{formatFeedbackText(feedback.feedback)}</div>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 px-6 py-2 rounded-md text-white hover:bg-blue-500 transition shadow-lg"
          >
            Regresar
          </button>
        </div>

      </div>
    </div>
  );
}

export default DetailRepository;

