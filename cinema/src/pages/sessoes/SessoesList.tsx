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

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const [listaSessoes, listaFilmes, listaSalas] = await Promise.all([
      sessoesService.listar(), filmesService.listar(), salasService.listar()
    ]);
    setSessoes(listaSessoes); setFilmes(listaFilmes); setSalas(listaSalas);
  }

  function getNomeFilme(id: any) {
    const f = filmes.find(x => String(x.id) === String(id));
    return f ? f.titulo : "---";
  }

  function getSalaInfo(id: any) {
    const s = salas.find(x => String(x.id) === String(id));
    return s ? `Sala ${s.numero}` : "--";
  }

  async function remover(id: any) {
    if (confirm("Cancelar esta sessão?")) {
      await sessoesService.remover(id); carregar();
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h2 className="fw-bold mb-0 text-white"><i className="bi bi-calendar-check me-3 text-danger"></i>Sessões Agendadas</h2>
          <p className="text-muted small mt-1">Venda de ingressos e controle de horários</p>
        </div>
        <Button onClick={() => navigate("/sessoes/novo")} variant="primary" size="lg">
          <i className="bi bi-plus-lg me-2"></i>Agendar Sessão
        </Button>
      </div>

      <div className="row g-4">
        {sessoes.map((s) => {
          const dataObj = new Date(s.horarioExibicao);
          return (
            <div key={s.id} className="col-md-6 col-lg-4">
              <div className="card h-100 bg-dark border-0 shadow position-relative" style={{borderLeft: "5px solid #E50914"}}>
                <div className="card-body p-4 d-flex flex-column">
                   
                   <div className="d-flex justify-content-between mb-2">
                      <span className="badge bg-secondary text-white">{getSalaInfo(s.salaId)}</span>
                      <span className="text-success fw-bold">R$ {Number(s.valorIngresso).toFixed(2)}</span>
                   </div>

                   <h4 className="card-title fw-bold text-white mb-3">{getNomeFilme(s.filmeId)}</h4>

                   <div className="d-flex align-items-center mb-4 text-muted">
                      <div className="border border-secondary rounded p-2 text-center me-3" style={{minWidth: "60px"}}>
                         <div className="fw-bold fs-5 text-white">{dataObj.getDate()}</div>
                         <div className="small text-uppercase">{dataObj.toLocaleString('default', { month: 'short' })}</div>
                      </div>
                      <div>
                         <div className="fs-5 text-white"><i className="bi bi-clock me-2"></i>{dataObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                         <div className="small">{dataObj.toLocaleDateString()}</div>
                      </div>
                   </div>

                   <div className="mt-auto">
                     <Button className="w-100 py-2 fw-bold mb-3" variant="success" onClick={() => navigate(`/venda/${s.id}`)}>
                       <i className="bi bi-ticket-perforated-fill me-2"></i>VENDER
                     </Button>
                     
                     <div className="d-flex justify-content-between border-top border-secondary pt-2">
                        <button className="btn btn-link text-decoration-none text-muted btn-sm" onClick={() => navigate(`/sessoes/${s.id}`)}>Editar</button>
                        <button className="btn btn-link text-decoration-none text-danger btn-sm" onClick={() => remover(s.id)}>Cancelar</button>
                     </div>
                   </div>

                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}