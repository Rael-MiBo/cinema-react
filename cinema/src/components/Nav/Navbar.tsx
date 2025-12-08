import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3" to="./">
          <i className="bi bi-film me-2 text-danger"></i>
          CineWeb
        </Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/filmes">Filmes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/salas">Salas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sessoes">Sessões</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/lanches">Estoque Lanches</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}