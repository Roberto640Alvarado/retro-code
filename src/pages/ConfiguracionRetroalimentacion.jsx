import { useState } from "react";

export default function ConfiguracionRetroalimentacion() {
  const [lenguaje, setLenguaje] = useState("C++");
  const [criterios, setCriterios] = useState([
    { nombre: "Correctitud", descripcion: "El código funciona sin errores.", peso: 40 },
    { nombre: "Eficiencia", descripcion: "El código es óptimo en tiempo.", peso: 20 },
    { nombre: "Legibilidad", descripcion: "Buenas prácticas y estilo.", peso: 20 }
  ]);
  const [temas, setTemas] = useState(["Algoritmos", "Estructuras de datos"]);
  const [nuevoCriterio, setNuevoCriterio] = useState({ nombre: "", descripcion: "", peso: 0 });

  const temasDisponibles = ["Algoritmos", "Estructuras de datos", "POO", "Manejo de errores"];

  const agregarCriterio = () => {
    if (nuevoCriterio.nombre.trim() !== "" && nuevoCriterio.peso > 0) {
      setCriterios([...criterios, nuevoCriterio]);
      setNuevoCriterio({ nombre: "", descripcion: "", peso: 0 });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Configurar Retroalimentación</h2>

      {/* 🔹 Selección de Lenguaje */}
      <div className="mb-4">
        <label className="block font-semibold">Lenguaje de Programación</label>
        <select
          value={lenguaje}
          onChange={(e) => setLenguaje(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        >
          <option value="C++">C++</option>
          <option value="Java">Java</option>
          <option value="Python">Python</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Otro">Otro...</option>
        </select>
      </div>

      {/* 🔹 Criterios de Evaluación */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Criterios de Evaluación</h3>
        {criterios.map((criterio, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              value={criterio.nombre}
              readOnly
              className="border p-2 w-1/3 rounded bg-gray-100"
            />
            <input
              type="text"
              value={criterio.descripcion}
              readOnly
              className="border p-2 w-2/3 rounded bg-gray-100"
            />
            <input
              type="number"
              value={criterio.peso}
              readOnly
              className="border p-2 w-1/6 text-center rounded bg-gray-100"
            />
          </div>
        ))}

        {/* Agregar Nuevo Criterio */}
        <div className="flex space-x-2 mt-2">
          <input
            type="text"
            placeholder="Nuevo Criterio"
            value={nuevoCriterio.nombre}
            onChange={(e) => setNuevoCriterio({ ...nuevoCriterio, nombre: e.target.value })}
            className="border p-2 w-1/3 rounded"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={nuevoCriterio.descripcion}
            onChange={(e) => setNuevoCriterio({ ...nuevoCriterio, descripcion: e.target.value })}
            className="border p-2 w-2/3 rounded"
          />
          <input
            type="number"
            placeholder="%"
            value={nuevoCriterio.peso}
            onChange={(e) => setNuevoCriterio({ ...nuevoCriterio, peso: parseInt(e.target.value) })}
            className="border p-2 w-1/6 text-center rounded"
          />
        </div>
        <button
          onClick={agregarCriterio}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Agregar Criterio
        </button>
      </div>

      {/* 🔹 Temas a Evaluar */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Temas a Evaluar</h3>
        {temasDisponibles.map((tema) => (
          <label key={tema} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={temas.includes(tema)}
              onChange={() => {
                setTemas((prev) =>
                  prev.includes(tema) ? prev.filter((t) => t !== tema) : [...prev, tema]
                );
              }}
            />
            <span>{tema}</span>
          </label>
        ))}
      </div>

      {/* 🔹 Resumen */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold">Resumen de Configuración</h3>
        <p>🎯 <strong>Lenguaje:</strong> {lenguaje}</p>
        <p>📚 <strong>Temas:</strong> {temas.join(", ")}</p>
        <p>📊 <strong>Criterios:</strong></p>
        <ul>
          {criterios.map((c, i) => (
            <li key={i}>{c.nombre} ({c.peso}%)</li>
          ))}
        </ul>
      </div>

      <button className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
        Guardar Configuración
      </button>
    </div>
  );
}
