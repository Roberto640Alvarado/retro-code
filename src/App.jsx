import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AssignmentsPage from "./pages/AssignmentsPage";
import RepositoriesPage from "./pages/RepositoriesPage";
import ConfiguracionRetroalimentacion from "./pages/ConfiguracionRetroalimentacion";
import DetailRepository from "./pages/DetailRepository";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classrooms/:classroomId/assignments" element={<AssignmentsPage />} />
        <Route path="/assignments/:assignmentId/repositories" element={<RepositoriesPage />} />
        <Route path="/repository/:repoName" element={<DetailRepository />} />
      </Routes>
    </Router>
  );
}

export default App;


