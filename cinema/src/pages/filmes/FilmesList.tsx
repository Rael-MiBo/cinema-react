import { useEffect, useState } from "react";
import { filmesService } from "../../services/filmes";
import type { Filme } from "../../types";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

export default function FilmesList() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try { setFilmes(await filmesService.listar()); } 
    catch (error) { console.error(error); }
  }

  async function remover(id: string | number) {
    if (confirm("Tem certeza que deseja excluir este filme?")) {
      await filmesService.remover(id);
      carregar();
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-0 text-white"><i className="bi bi-film me-3 text-danger"></i>Catálogo de Filmes</h2>
          <p className="text-muted small mt-1">Gerencie os títulos em cartaz</p>
        </div>
        <Button onClick={() => navigate("/filmes/novo")} variant="primary" size="lg">
          <i className="bi bi-plus-lg me-2"></i>Novo Filme
        </Button>
      </div>

      <div className="row g-4">
        {filmes.map((f) => (
          <div className="col-md-6 col-lg-4" key={f.id}>
            <div className="card h-100 shadow-sm hover-card bg-dark border-secondary">
              <div className="card-body d-flex flex-column">
                
                <div className="d-flex justify-content-between align-items-start mb-3">
                   <h5 className="card-title fw-bold text-white mb-0">{f.titulo}</h5>
                   <span className="badge bg-secondary border border-secondary text-white">
                      {f.classificacao}
                   </span>
                </div>
                
                <div className="mb-4">
                  <span className="badge bg-dark border border-secondary text-muted me-2">
                    <i className="bi bi-clock me-1"></i>{f.duracao} min
                  </span>
                  <span className="badge bg-dark border border-secondary text-muted">
                    {f.genero}
                  </span>
                </div>

                <p className="card-text text-muted small flex-grow-1">
                  {f.sinopse.substring(0, 120)}...
                </p>

                <div className="d-flex gap-2 mt-4 pt-3 border-top border-secondary">
                   <Button className="flex-grow-1" size="sm" variant="outline-secondary" onClick={() => navigate(`/filmes/${f.id}`)}>
                      EDITAR
                   </Button>
                   <Button size="sm" variant="outline-danger" onClick={() => remover(f.id!)}>
                      <i className="bi bi-trash"></i>
                   </Button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}