import { useEffect, useState } from "react";
import { salasService } from "../../services/salas";
import type { Sala } from "../../types";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

export default function SalasList() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const navigate = useNavigate();

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    try { setSalas(await salasService.listar()); } 
    catch (error) { console.error(error); }
  }

  async function remover(id: string | number) {
    if (confirm("Excluir sala? Isso apagará as sessões dela.")) {
      await salasService.remover(id);
      carregar();
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-0 text-white"><i className="bi bi-grid-3x3-gap me-3 text-danger"></i>Salas de Exibição</h2>
          <p className="text-muted small mt-1">Configuração de assentos e telas</p>
        </div>
        <Button onClick={() => navigate("/salas/novo")} variant="primary" size="lg">
          <i className="bi bi-plus-lg me-2"></i>Nova Sala
        </Button>
      </div>

      <div className="row g-4">
        {salas.map((s) => (
          <div key={s.id} className="col-sm-6 col-lg-3">
            <div className="card h-100 shadow border-0 bg-dark text-center py-4 position-relative overflow-hidden">
              {/* Detalhe decorativo */}
              <div className="position-absolute top-0 start-0 w-100 bg-secondary" style={{height: "4px"}}></div>

              <div className="card-body">
                 <h6 className="text-muted text-uppercase fw-bold ls-1 mb-3">Sala {s.numero}</h6>
                 
                 <div className="my-4">
                    <i className="bi bi-people-fill display-4 text-secondary"></i>
                    <h2 className="display-6 fw-bold text-white mt-2">{s.capacidade}</h2>
                    <small className="text-muted">LUGARES</small>
                 </div>

                 <div className="d-flex justify-content-center gap-2">
                    <Button size="sm" variant="outline-secondary" onClick={() => navigate(`/salas/${s.id}`)}>
                      <i className="bi bi-gear-fill me-1"></i> Configurar
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => remover(s.id!)}>
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