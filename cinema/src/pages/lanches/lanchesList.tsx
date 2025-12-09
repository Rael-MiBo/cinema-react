import { useEffect, useState } from "react";
import { lanchesService } from "../../services/lanches";
import type { LancheCombo } from "../../types";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function LanchesList() {
  const [lanches, setLanches] = useState<LancheCombo[]>([]);
  const navigate = useNavigate();

  useEffect(() => { carregar(); }, []);

  async function carregar() { setLanches(await lanchesService.listar()); }

  async function remover(id: string | number) {
    if (confirm("Excluir item?")) {
      await lanchesService.remover(id);
      carregar();
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-0 text-white"><i className="bi bi-cup-straw me-3 text-danger"></i>Lanches</h2>
          <p className="text-muted small mt-1">Gerenciamento de estoque e preços</p>
        </div>
        <Button onClick={() => navigate("/lanches/novo")} variant="primary" size="lg">
          <i className="bi bi-plus-lg me-2"></i>Novo Item
        </Button>
      </div>

      <div className="row g-4">
        {lanches.map((l) => (
          <div key={l.id} className="col-md-4 col-lg-3">
            <div className="card h-100 shadow border-0 bg-dark">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                   <h5 className="fw-bold text-white mb-1">{l.nome}</h5>
                   <h5 className="text-success fw-bold">R$ {Number(l.valorUnitario).toFixed(2)}</h5>
                </div>
                
                <p className="text-muted small mb-4">{l.descricao || "Sem descrição."}</p>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary">
                   <div className={l.qtUnidade < 10 ? "text-danger fw-bold" : "text-muted"}>
                      <i className={`bi bi-box-seam me-2`}></i>
                      {l.qtUnidade} un.
                   </div>
                   
                   <div className="d-flex gap-2">
                     <Button size="sm" variant="outline-secondary" onClick={() => navigate(`/lanches/${l.id}`)}>
                        <i className="bi bi-pencil"></i>
                     </Button>
                     <Button size="sm" variant="outline-danger" onClick={() => remover(l.id!)}>
                        <i className="bi bi-trash"></i>
                     </Button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}