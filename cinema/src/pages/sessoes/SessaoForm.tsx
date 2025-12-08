import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sessoesService } from "../../services/sessoes";
import { filmesService } from "../../services/filmes";
import { salasService } from "../../services/salas";
import { sessaoSchema } from "../../schemas/sessaoSchema";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import type { Sessao, Filme, Sala } from "../../types";

export default function SessaoForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [data, setData] = useState<Sessao>({ filmeId: "", salaId: "", horarioExibicao: "", valorIngresso: 0 });

  useEffect(() => {
    filmesService.listar().then(setFilmes);
    salasService.listar().then(setSalas);
    if (id) sessoesService.obter(id).then(setData).catch(console.error);
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    if (!data.filmeId || !data.salaId) { alert("Selecione Filme e Sala!"); return; }

    const filmeSelecionado = filmes.find(f => String(f.id) === String(data.filmeId));
    if (filmeSelecionado) {
      const dataSessao = new Date(data.horarioExibicao);
      const inicioFilme = new Date(filmeSelecionado.dataInicialExibicao); inicioFilme.setHours(0,0,0,0);
      const fimFilme = new Date(filmeSelecionado.dataFinalExibicao); fimFilme.setHours(23,59,59,999);
      if (dataSessao < inicioFilme || dataSessao > fimFilme) {
        alert("Erro: Sessão fora do período de cartaz do filme!"); return;
      }
    }

    try {
      sessaoSchema.parse(data);
      if (id) await sessoesService.atualizar(id, data);
      else await sessoesService.criar(data);
      alert("Sessão agendada!");
      navigate("/sessoes");
    } catch (err: any) { alert(err.errors ? err.errors[0].message : "Erro."); }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-7">
        <div className="card shadow border-0">
          <div className="card-header bg-dark text-white py-3">
             <h4 className="mb-0 fw-bold"><i className="bi bi-calendar-event me-2"></i>Agendar Sessão</h4>
          </div>
          <div className="card-body p-4">
            <form onSubmit={submit}>
              
              <Select 
                label="Filme"
                value={data.filmeId}
                onChange={e => setData({...data, filmeId: e.target.value})}
                options={[
                    { value: "", label: "Selecione um filme..." },
                    ...filmes.map(f => ({ value: f.id!, label: f.titulo }))
                ]}
              />

              <Select 
                label="Sala"
                value={data.salaId}
                onChange={e => setData({...data, salaId: e.target.value})}
                options={[
                    { value: "", label: "Selecione uma sala..." },
                    ...salas.map(s => ({ value: s.id!, label: `Sala ${s.numero} (${s.capacidade} lug.)` }))
                ]}
              />

              <div className="row">
                <div className="col-md-7">
                  <Input type="datetime-local" label="Data e Horário" value={data.horarioExibicao} onChange={(e) => setData({...data, horarioExibicao: e.target.value})} />
                </div>
                <div className="col-md-5">
                   <Input type="number" label="Valor Ingresso (R$)" value={data.valorIngresso} onChange={(e) => setData({...data, valorIngresso: Number(e.target.value)})} />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                 <Button type="button" variant="light" onClick={() => navigate("/sessoes")}>Cancelar</Button>
                 <Button type="submit" variant="primary">Confirmar Agendamento</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}