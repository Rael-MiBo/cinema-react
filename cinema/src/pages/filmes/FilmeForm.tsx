import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { filmesService } from "../../services/filmes";
import { filmeSchema } from "../../schemas/filmeSchema";
import Input from "../../components/Input";
import Button from "../../components/Button";
import type { Filme } from "../../types";

export default function FilmeForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estado inicial completo (Evita erros de TypeScript)
  const [data, setData] = useState<Filme>({
    titulo: "",
    sinopse: "",
    classificacao: "",
    duracao: 0,
    genero: "",
    elenco: "",
    dataInicialExibicao: "",
    dataFinalExibicao: ""
  });

  useEffect(() => {
    if (id) {
      filmesService.obter(id).then(setData).catch(console.error);
    }
  }, [id]);

  function update(field: keyof Filme, value: any) {
    setData((prev) => ({ ...prev, [field]: value }));
  }

  async function submit(e: any) {
    e.preventDefault();
    
    // --- NOVAS VALIDAÇÕES DE DATA ---
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera hora para comparar apenas o dia

    const inicio = new Date(data.dataInicialExibicao);
    // Ajustamos o fuso horário para evitar erros de "dia anterior"
    const inicioFuso = new Date(inicio.getTime() + inicio.getTimezoneOffset() * 60000);

    const fim = new Date(data.dataFinalExibicao);
    const fimFuso = new Date(fim.getTime() + fim.getTimezoneOffset() * 60000);

    // 1. Não deixar cadastrar filme com estreia no passado (Se for regra estrita)
    // Se você quiser permitir cadastro de histórico antigo, remova este bloco IF.
    if (inicioFuso < hoje && !id) { // Só valida na criação (!id)
       alert("Erro: A Data Inicial não pode ser anterior ao dia de hoje!");
       return;
    }

    // 2. Data Final não pode ser antes da Inicial
    if (fimFuso < inicioFuso) {
      alert("Erro: A Data Final não pode ser antes da Data Inicial!");
      return;
    }
    // --------------------------------

    try {
      filmeSchema.parse(data);
      if (id) await filmesService.atualizar(id, data);
      else await filmesService.criar(data);

      alert("Filme salvo!");
      navigate("/filmes");
    } catch (err: any) {
      if(err.errors) alert(err.errors[0].message);
      else alert("Erro ao salvar filme.");
    }
  }

  return (
    <div className="col-md-8 mx-auto">
      <h2 className="text-center mb-4">{id ? "Editar Filme" : "Novo Filme"}</h2>

      <form onSubmit={submit}>
        <div className="row">
          <div className="col-md-6">
            <Input label="Título" value={data.titulo} onChange={(e) => update("titulo", e.target.value)} />
          </div>
          <div className="col-md-6">
            <Input label="Gênero" value={data.genero} onChange={(e) => update("genero", e.target.value)} />
          </div>
        </div>

        <Input label="Sinopse" value={data.sinopse} onChange={(e) => update("sinopse", e.target.value)} />
        <Input label="Elenco" value={data.elenco} onChange={(e) => update("elenco", e.target.value)} />

        <div className="row">
          <div className="col-md-4">
            <Input type="number" label="Duração (min)" value={data.duracao} onChange={(e) => update("duracao", Number(e.target.value))} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Classificação</label>
            <select className="form-select" value={data.classificacao} onChange={(e) => update("classificacao", e.target.value)}>
              <option value="">Selecione...</option>
              <option value="L">Livre</option>
              <option value="10">10 anos</option>
              <option value="12">12 anos</option>
              <option value="14">14 anos</option>
              <option value="16">16 anos</option>
              <option value="18">18 anos</option>
            </select>
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-6">
            <Input type="date" label="Início Exibição" value={data.dataInicialExibicao} onChange={(e) => update("dataInicialExibicao", e.target.value)} />
          </div>
          <div className="col-md-6">
            <Input type="date" label="Fim Exibição" value={data.dataFinalExibicao} onChange={(e) => update("dataFinalExibicao", e.target.value)} />
          </div>
        </div>

        <div className="text-center mt-4">
          <Button type="submit">Salvar Filme</Button>
        </div>
      </form>
    </div>
  );
}