import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { filmesService } from "../../services/filmes";
import { filmeSchema } from "../../schemas/filmeSchema";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";
import type { Filme } from "../../types";

export default function FilmeForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<Filme>({
    titulo: "", sinopse: "", classificacao: "", duracao: 0, genero: "",
    elenco: "", dataInicialExibicao: "", dataFinalExibicao: ""
  });

  useEffect(() => {
    if (id) filmesService.obter(id).then(setData).catch(console.error);
  }, [id]);

  function update(field: keyof Filme, value: any) {
    setData((d) => ({ ...d, [field]: value }));
  }

  async function submit(e: any) {
    e.preventDefault();
    try {
      filmeSchema.parse(data);
      if (id) await filmesService.atualizar(id, data);
      else await filmesService.criar(data);
      alert("Filme salvo!");
      navigate("/filmes");
    } catch (err: any) {
      if(err.errors) alert(err.errors[0].message); else alert("Erro ao salvar.");
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow border-0">
          <div className="card-header bg-primary text-white py-3">
            <h4 className="mb-0 fw-bold"><i className="bi bi-camera-reels me-2"></i>{id ? "Editar Filme" : "Novo Filme"}</h4>
          </div>
          
          <div className="card-body p-4">
            <form onSubmit={submit}>
              <div className="row">
                <div className="col-md-8">
                  <Input label="Título do Filme" value={data.titulo} onChange={(e) => update("titulo", e.target.value)} />
                </div>
                <div className="col-md-4">
                   <Input label="Gênero" value={data.genero} onChange={(e) => update("genero", e.target.value)} />
                </div>
              </div>

              <Input label="Sinopse" value={data.sinopse} onChange={(e) => update("sinopse", e.target.value)} />

              <div className="row">
                <div className="col-md-4">
                  <Input type="number" label="Duração (min)" value={data.duracao} onChange={(e) => update("duracao", Number(e.target.value))} />
                </div>
                <div className="col-md-4">
                  <Select 
                    label="Classificação"
                    value={data.classificacao}
                    onChange={(e) => update("classificacao", e.target.value)}
                    options={[
                        { value: "L", label: "Livre (L)" },
                        { value: "10", label: "10 anos" },
                        { value: "12", label: "12 anos" },
                        { value: "14", label: "14 anos" },
                        { value: "16", label: "16 anos" },
                        { value: "18", label: "18 anos" }
                    ]}
                  />
                </div>
              </div>

              <Input label="Elenco Principal" value={data.elenco} onChange={(e) => update("elenco", e.target.value)} />

              <div className="row">
                <div className="col-md-6">
                  <Input type="date" label="Início Exibição" value={data.dataInicialExibicao} onChange={(e) => update("dataInicialExibicao", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <Input type="date" label="Fim Exibição" value={data.dataFinalExibicao} onChange={(e) => update("dataFinalExibicao", e.target.value)} />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button type="button" variant="light" onClick={() => navigate("/filmes")}>Cancelar</Button>
                <Button type="submit" variant="primary"><i className="bi bi-save me-2"></i>Salvar Filme</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}