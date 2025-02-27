import React from "react";
import { FaUser, FaCheckCircle, FaLink, FaClipboardCheck, FaFolderOpen } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AssignmentCard = ({ assignment }) => {
  const navigate = useNavigate();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(assignment.invite_link);
    toast.success("Enlace copiado al portapapeles!");
  };

  const goToRepositories = () => {
    navigate(`/assignments/${assignment.id}/repositories`);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer">
      <div className="w-full md:w-3/4" onClick={goToRepositories}>
        <a className="text-blue-400 text-lg font-semibold hover:underline">
          {assignment.title}
        </a>
        <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm mt-2">
          <span className="flex items-center gap-1">
            <FaCheckCircle className="text-green-500" /> Active
          </span>
          <span className="flex items-center gap-1">
            <FaUser className="text-gray-300" /> {assignment.type === "individual" ? "Individual assignment" : "Team assignment"}
          </span>
          <span className="flex items-center gap-1">
            <FaClipboardCheck className="text-yellow-400" /> {assignment.accepted} Accepted
          </span>
          <span className="flex items-center gap-1">
            <FaClipboardCheck className="text-blue-400" /> {assignment.submissions} Submissions
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition duration-300 text-sm"
          onClick={copyToClipboard}
        >
          <FaLink /> Copy invite link
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300 text-sm"
          onClick={goToRepositories}
        >
          <FaFolderOpen /> View Repositories
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;




