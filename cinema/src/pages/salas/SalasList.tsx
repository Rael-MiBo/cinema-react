import { useEffect, useState } from "react";
import { salasService } from "../../services/salas";
import type { Sala } from "../../types";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

export default function SalasList() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      setSalas(await salasService.listar());
    } catch (error) {
      console.error(error);
    }
  }

  async function remover(id: string | number) {
    if (confirm("ATENÇÃO: Excluir esta sala vai apagar todas as sessões agendadas nela.\nDeseja continuar?")) {
      await salasService.remover(id);
      carregar();
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold"><i className="bi bi-grid-3x3-gap-fill me-2 text-success"></i>Salas</h2>
        <Button onClick={() => navigate("/salas/novo")} variant="success">
          <i className="bi bi-plus-lg me-1"></i>Nova Sala
        </Button>
      </div>

      <div className="row">
        {salas.map((s) => (
          <div key={s.id} className="col-md-4 mb-4">
            <div className="card shadow-sm border-0 h-100 text-center">
              <div className="card-header bg-dark text-white fw-bold">
                 SALA {s.numero}
              </div>
              <div className="card-body py-4">
                 <i className="bi bi-people-fill display-4 text-secondary opacity-25"></i>
                 <h2 className="display-5 fw-bold text-success my-2">{s.capacidade}</h2>
                 <p className="text-muted text-uppercase small ls-1">Lugares Disponíveis</p>
              </div>
              <div className="card-footer bg-white d-flex justify-content-center gap-2 pb-3">
                  <Button size="sm" variant="light" onClick={() => navigate(`/salas/${s.id}`)}>
                    <i className="bi bi-gear-fill me-1"></i>Configurar
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => remover(s.id!)}>
                    <i className="bi bi-trash-fill"></i>
                  </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}