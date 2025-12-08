import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="display-4 fw-bold mb-4">Bem-vindo ao CineWeb</h1>
      <p className="lead text-muted mb-5">Sistema de Gerenciamento de Cinema e Vendas</p>

      <div className="row g-4">
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0 hover-card">
            <div className="card-body py-5">
              <i className="bi bi-ticket-perforated-fill text-primary display-4 mb-3"></i>
              <h4 className="card-title">Vender Ingressos</h4>
              <p className="card-text text-muted">Gerenciar sessões e realizar vendas.</p>
              <Link to="/sessoes" className="btn btn-primary w-100 stretched-link">
                Acessar Sessões
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body py-5">
              <i className="bi bi-camera-reels-fill text-danger display-4 mb-3"></i>
              <h4 className="card-title">Filmes</h4>
              <p className="card-text text-muted">Cadastrar catálogo e cartaz.</p>
              <Link to="/filmes" className="btn btn-outline-danger w-100 stretched-link">
                Ver Filmes
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body py-5">
              <i className="bi bi-cup-straw text-warning display-4 mb-3"></i>
              <h4 className="card-title">Lanches</h4>
              <p className="card-text text-muted">Gerenciar pipoca e bebidas.</p>
              <Link to="/lanches" className="btn btn-outline-warning text-dark w-100 stretched-link">
                Estoque
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body py-5">
              <i className="bi bi-grid-3x3-gap-fill text-success display-4 mb-3"></i>
              <h4 className="card-title">Salas</h4>
              <p className="card-text text-muted">Configurar assentos e telas.</p>
              <Link to="/salas" className="btn btn-outline-success w-100 stretched-link">
                Configurar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}