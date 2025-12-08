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
    try {
      const dados = await filmesService.listar();
      setFilmes(dados);
    } catch (error) {
      console.error(error);
    }
  }

  async function remover(id: string | number) {
    if (confirm("Tem certeza que deseja excluir este filme e suas sessões?")) {
      await filmesService.remover(id);
      carregar();
    }
  }

  function getCorClassificacao(c: string) {
    if (c === "L") return "bg-success";
    if (c === "10" || c === "12") return "bg-primary";
    if (c === "14" || c === "16") return "bg-warning text-dark";
    return "bg-danger";
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          <i className="bi bi-film me-2 text-danger"></i>Filmes em Cartaz
        </h2>
        <Button onClick={() => navigate("/filmes/novo")} variant="primary">
          <i className="bi bi-plus-lg me-1"></i>Novo Filme
        </Button>
      </div>

      <div className="row">
        {filmes.map((f) => (
          <div className="col-md-6 col-lg-4 mb-4" key={f.id}>
            <div className="card h-100 shadow-sm border-0 hover-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title fw-bold text-primary">
                    {f.titulo}
                  </h5>
                  <span
                    className={`badge ${getCorClassificacao(
                      f.classificacao
                    )} rounded-pill`}
                  >
                    {f.classificacao}
                  </span>
                </div>

                <h6 className="card-subtitle mb-3 text-muted">
                  <i className="bi bi-clock me-1"></i>
                  {f.duracao} min
                  <span className="mx-2">|</span>
                  <span className="badge bg-secondary">{f.genero}</span>
                </h6>

                <p className="card-text text-muted small">
                  {f.sinopse.substring(0, 100)}...
                </p>
              </div>

              <div className="card-footer bg-white border-top-0 d-flex justify-content-end gap-2 pb-3">
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => navigate(`/filmes/${f.id}`)}
                >
                  <i className="bi bi-pencil-square me-1"></i>Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => remover(f.id!)}
                >
                  <i className="bi bi-trash me-1"></i>Excluir
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
