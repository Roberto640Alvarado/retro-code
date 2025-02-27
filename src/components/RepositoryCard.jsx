import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCodeBranch, FaStar, FaGithub } from "react-icons/fa";

const RepositoryCard = ({ repository }) => {
  const navigate = useNavigate();
  const student = repository.students[0];

  const handleNavigate = () => {
    navigate(`/repository/${repository.repository.name}`, {
      state: { grade: repository.grade ? repository.grade : "Sin calificar" },
    });
  };

  return (
    <div
      onClick={handleNavigate}
      className="flex items-center bg-gray-800 p-4 rounded-lg shadow-md transition duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
      {/* Avatar del estudiante */}
      <img
        src={student.avatar_url}
        alt={student.login}
        className="w-12 h-12 rounded-full mr-4"
      />

      <div className="flex-1">
        <h3 className="text-lg font-bold text-blue-400">
          {repository.repository.name}
        </h3>
        <p className="text-gray-400 text-sm">@{student.login}</p>

        <div className="flex items-center gap-3 text-gray-400 text-sm mt-2">
          <span className="flex items-center gap-1">
            <FaCodeBranch className="text-yellow-400" /> {repository.commit_count} Commits
          </span>
          <span className="flex items-center gap-1">
            <FaStar className="text-green-400" /> {repository.grade ? repository.grade : "Sin calificar"}
          </span>
        </div>
      </div>

      <a
        href={repository.repository.html_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()} 
        className="flex items-center gap-2 text-blue-400 hover:text-blue-500 transition duration-300 text-sm"
      >
        Repository <FaGithub size={20} />
      </a>
    </div>
  );
};

export default RepositoryCard;


