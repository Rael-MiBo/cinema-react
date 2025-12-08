import { useEffect, useState } from "react";
import { sessoesService } from "../../services/sessoes";
import { filmesService } from "../../services/filmes";
import { salasService } from "../../services/salas";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import type { Sessao, Filme, Sala } from "../../types";

export default function SessoesList() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const [listaSessoes, listaFilmes, listaSalas] = await Promise.all([
      sessoesService.listar(),
      filmesService.listar(),
      salasService.listar()
    ]);
    setSessoes(listaSessoes);
    setFilmes(listaFilmes);
    setSalas(listaSalas);
  }

  function getNomeFilme(id: any) {
    const filme = filmes.find(f => String(f.id) === String(id));
    return filme ? filme.titulo : "Filme não encontrado";
  }

  function getSalaInfo(id: any) {
    const sala = salas.find(s => String(s.id) === String(id));
    return sala ? `Sala ${sala.numero}` : "Sala N/A";
  }

  async function remover(id: any) {
    if (confirm("Excluir sessão?")) {
      await sessoesService.remover(id);
      carregar();
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold"><i className="bi bi-calendar-event me-2 text-primary"></i>Sessões</h2>
        <Button onClick={() => navigate("/sessoes/novo")} variant="primary">
          <i className="bi bi-plus-lg me-1"></i>Agendar Sessão
        </Button>
      </div>

      <div className="row">
        {sessoes.map((s) => {
          const dataObj = new Date(s.horarioExibicao);
          return (
            <div key={s.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow border-0 h-100 position-relative overflow-hidden">
                {/* Faixa decorativa lateral */}
                <div className="position-absolute top-0 start-0 bottom-0 bg-primary" style={{width: "6px"}}></div>
                
                <div className="card-body ms-2">
                   <div className="d-flex justify-content-between">
                      <span className="badge bg-light text-dark border mb-2">
                        <i className="bi bi-geo-alt-fill me-1 text-danger"></i>
                        {getSalaInfo(s.salaId)}
                      </span>
                      <small className="text-muted fw-bold">
                        R$ {Number(s.valorIngresso).toFixed(2)}
                      </small>
                   </div>
                   
                   <h5 className="card-title fw-bold mt-1">{getNomeFilme(s.filmeId)}</h5>
                   
                   <div className="d-flex align-items-center mt-3 mb-3 text-secondary">
                      <i className="bi bi-clock-history fs-4 me-2"></i>
                      <div>
                        <div className="fw-bold text-dark">{dataObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="small">{dataObj.toLocaleDateString()}</div>
                      </div>
                   </div>

                   <Button className="w-100 fw-bold shadow-sm" variant="success" onClick={() => navigate(`/venda/${s.id}`)}>
                     <i className="bi bi-ticket-perforated me-2"></i>VENDER INGRESSO
                   </Button>
                </div>

                <div className="card-footer bg-light ms-2 border-0 d-flex justify-content-end gap-2">
                    <button className="btn btn-sm btn-link text-decoration-none text-secondary" onClick={() => navigate(`/sessoes/${s.id}`)}>
                       Editar
                    </button>
                    <button className="btn btn-sm btn-link text-decoration-none text-danger" onClick={() => remover(s.id)}>
                       Excluir
                    </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}