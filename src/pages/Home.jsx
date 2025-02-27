import React, { useEffect, useState } from "react";
import GithubService from "../services/GithubService";
import ClassroomCard from "../components/ClassroomCard";
import { Toaster, toast } from "react-hot-toast";

const Home = () => {
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const data = await GithubService.getClassrooms();
        setClassrooms(data);
      } catch (error) {
        toast.error("Error al cargar las classrooms");
      }
    };

    fetchClassrooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster />
      <header className="bg-gray-800 shadow-md py-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center">
          <a
            href="https://www.uca.edu.sv"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition duration-300"
          >
            Universidad Centroamericana José Simeón Cañas
          </a>
        </h1>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            📚 GitHub Classrooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classrooms.length > 0 ? (
              classrooms.map((classroom) => (
                <ClassroomCard key={classroom.id} classroom={classroom} />
              ))
            ) : (
              <p className="text-gray-400">No hay classrooms disponibles</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;


