import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const loc = useLocation();

  return (
    <nav className="nav-netflix">
      <div className="nav-logo">CineWeb</div>

      <div className="nav-links">
        <Link className={loc.pathname.includes("filmes") ? "active" : ""} to="/filmes">
          Filmes
        </Link>

        <Link className={loc.pathname.includes("salas") ? "active" : ""} to="/salas">
          Salas
        </Link>

        <Link className={loc.pathname.includes("sessoes") ? "active" : ""} to="/sessoes">
          Sessões
        </Link>
      </div>
    </nav>
  );
}
