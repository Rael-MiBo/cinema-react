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
      <div className="col-lg-8">
        <div className="card shadow-lg">
          <div className="card-body p-5">
            
            <h2 className="mb-4 fw-bold text-danger">
              <i className="bi bi-film me-2"></i>
              {id ? "Editar Filme" : "Adicionar ao Catálogo"}
            </h2>
            
            <form onSubmit={submit}>
              <div className="row g-3">
                <div className="col-md-8">
                  <Input label="Título Original" value={data.titulo} onChange={(e) => update("titulo", e.target.value)} />
                </div>
                <div className="col-md-4">
                   <Input label="Gênero" value={data.genero} onChange={(e) => update("genero", e.target.value)} />
                </div>
              </div>

              <div className="mt-3">
                 <Input label="Sinopse" value={data.sinopse} onChange={(e) => update("sinopse", e.target.value)} />
              </div>

              <div className="row g-3 mt-1">
                <div className="col-md-4">
                  <Input type="number" label="Duração (min)" value={data.duracao} onChange={(e) => update("duracao", Number(e.target.value))} />
                </div>
                <div className="col-md-4">
                  <Select 
                    label="Classificação"
                    value={data.classificacao}
                    onChange={(e) => update("classificacao", e.target.value)}
                    options={[
                        { value: "L", label: "Livre" },
                        { value: "10", label: "10 anos" },
                        { value: "12", label: "12 anos" },
                        { value: "14", label: "14 anos" },
                        { value: "16", label: "16 anos" },
                        { value: "18", label: "18 anos" }
                    ]}
                  />
                </div>
                 <div className="col-md-4">
                    <Input label="Elenco Principal" value={data.elenco} onChange={(e) => update("elenco", e.target.value)} />
                 </div>
              </div>

              <div className="row g-3 mt-1">
                <div className="col-md-6">
                  <Input type="date" label="Estreia (Início)" value={data.dataInicialExibicao} onChange={(e) => update("dataInicialExibicao", e.target.value)} />
                </div>
                <div className="col-md-6">
                  <Input type="date" label="Saída de Cartaz (Fim)" value={data.dataFinalExibicao} onChange={(e) => update("dataFinalExibicao", e.target.value)} />
                </div>
              </div>

              <hr className="border-secondary my-4" />

              <div className="d-flex justify-content-end gap-2">
                <Button type="button" variant="outline-secondary" onClick={() => navigate("/filmes")}>Cancelar</Button>
                <Button type="submit" variant="primary" size="lg"><i className="bi bi-check-lg me-2"></i>Salvar Filme</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}