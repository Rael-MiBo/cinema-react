import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { sessoesService } from "../../services/sessoes";
import { filmesService } from "../../services/filmes";
import { salasService } from "../../services/salas";
import { sessaoSchema } from "../../schemas/sessaoSchema";
import Button from "../../components/Button";
import Input from "../../components/Input";
import type { Sessao, Filme, Sala } from "../../types";

export default function SessaoForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  
  // Inicializa strings vazias para obrigar a seleção
  const [data, setData] = useState<Sessao>({
    filmeId: "", 
    salaId: "",
    horarioExibicao: "",
    valorIngresso: 0,
  });

  useEffect(() => {
    filmesService.listar().then(setFilmes);
    salasService.listar().then(setSalas);
    if (id) {
      sessoesService.obter(id).then(setData).catch(console.error);
    }
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    
    if (!data.filmeId || !data.salaId) {
      alert("Selecione um Filme e uma Sala!");
      return;
    }

    // --- NOVA VALIDAÇÃO DE PERÍODO ---
    // 1. Acha o filme selecionado na lista carregada
    const filmeSelecionado = filmes.find(f => String(f.id) === String(data.filmeId));
    
    if (filmeSelecionado) {
      const dataSessao = new Date(data.horarioExibicao);
      
      // Cria datas do filme (adicionando fuso para garantir dia correto)
      const inicioFilme = new Date(filmeSelecionado.dataInicialExibicao);
      inicioFilme.setHours(0, 0, 0, 0); // Começa à meia-noite do dia inicial

      const fimFilme = new Date(filmeSelecionado.dataFinalExibicao);
      fimFilme.setHours(23, 59, 59, 999); // Vai até o último segundo do dia final

      // 2. Verifica se a sessão está fora do intervalo
      if (dataSessao < inicioFilme || dataSessao > fimFilme) {
        alert(
          `ERRO: Este filme só está em cartaz entre:\n` +
          `${inicioFilme.toLocaleDateString()} e ${fimFilme.toLocaleDateString()}.\n\n` +
          `Você tentou agendar para: ${dataSessao.toLocaleDateString()}`
        );
        return; // BLOQUEIA O SALVAMENTO
      }
    }
    // ---------------------------------

    try {
      sessaoSchema.parse(data); 
      if (id) await sessoesService.atualizar(id, data);
      else await sessoesService.criar(data);
      alert("Sessão salva!");
      navigate("/sessoes");
    } catch (err: any) {
      alert("Erro: " + (err.errors ? err.errors[0].message : "Verifique os dados."));
    }
  }
  
  return (
    <div className="col-md-6 mx-auto">
      <h2 className="text-center mb-4">{id ? "Editar Sessão" : "Nova Sessão"}</h2>
      <form onSubmit={submit}>
        
        {/* SELECT DE FILMES SEGURO */}
        <div className="mb-3">
          <label className="form-label">Filme</label>
          <select 
            className="form-select" 
            value={data.filmeId} 
            onChange={e => setData({...data, filmeId: e.target.value})}
          >
            <option value="">Selecione um filme...</option>
            {filmes.map(f => (
              <option key={f.id} value={f.id}>{f.titulo}</option>
            ))}
          </select>
        </div>

        {/* SELECT DE SALAS SEGURO */}
        <div className="mb-3">
          <label className="form-label">Sala</label>
          <select 
            className="form-select" 
            value={data.salaId} 
            onChange={e => setData({...data, salaId: e.target.value})}
          >
            <option value="">Selecione uma sala...</option>
            {salas.map(s => (
              <option key={s.id} value={s.id}>Sala {s.numero} ({s.capacidade} lug.)</option>
            ))}
          </select>
        </div>

        <Input
          type="datetime-local"
          label="Horário"
          value={data.horarioExibicao}
          onChange={(e) => setData({...data, horarioExibicao: e.target.value})}
        />

        <Input
          type="number"
          label="Valor do Ingresso (Inteira)"
          value={data.valorIngresso}
          onChange={(e) => setData({...data, valorIngresso: Number(e.target.value)})}
        />

        <div className="text-center mt-3">
          <Button type="submit">Salvar Sessão</Button>
        </div>
      </form>
    </div>
  );
}