import { useEffect, useState } from "react";
import { lanchesService } from "../../services/lanches";
import type { LancheCombo } from "../../types";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function LanchesList() {
  const [lanches, setLanches] = useState<LancheCombo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setLanches(await lanchesService.listar());
  }

  async function remover(id: string | number) {
    if (confirm("Excluir este item dos lanches?")) {
      await lanchesService.remover(id);
      carregar();
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold"><i className="bi bi-cup-straw me-2 text-warning"></i>Lanches</h2>
        <Button onClick={() => navigate("/lanches/novo")} variant="warning">
          <i className="bi bi-plus-lg me-1"></i>Novo Item
        </Button>
      </div>

      <div className="row">
        {lanches.map((l) => (
          <div key={l.id} className="col-md-4 col-lg-3 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="bg-light text-center py-4">
                 <i className="bi bi-basket2-fill display-4 text-warning"></i>
              </div>

              <div className="card-body">
                <h5 className="card-title fw-bold">{l.nome}</h5>
                <p className="card-text text-muted small">{l.descricao || "Sem descrição."}</p>
                
                <div className="d-flex justify-content-between align-items-center mt-3">
                   <h5 className="text-success fw-bold mb-0">R$ {Number(l.valorUnitario).toFixed(2)}</h5>
                   
                   <span className={`badge ${l.qtUnidade < 10 ? 'bg-danger' : 'bg-secondary'}`}>
                      {l.qtUnidade} un.
                   </span>
                </div>
              </div>

              <div className="card-footer bg-white border-0 d-flex justify-content-between">
                 <Button size="sm" variant="outline-secondary" onClick={() => navigate(`/lanches/${l.id}`)}>
                    <i className="bi bi-pencil"></i>
                 </Button>
                 <Button size="sm" variant="outline-danger" onClick={() => remover(l.id!)}>
                    <i className="bi bi-trash"></i>
                 </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}