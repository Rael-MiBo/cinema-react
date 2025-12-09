import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { lanchesService } from "../../services/lanches";
import { lancheSchema } from "../../schemas/lancheSchema";
import Input from "../../components/Input";
import Button from "../../components/Button";
import type { LancheCombo } from "../../types";

export default function LancheForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<LancheCombo>({ nome: "", descricao: "", valorUnitario: 0, qtUnidade: 0 });

  useEffect(() => {
    if (id) lanchesService.obter(id).then(setData).catch(console.error);
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    try {
      lancheSchema.parse(data);
      if (id) await lanchesService.atualizar(id, data);
      else await lanchesService.criar(data);
      alert("Item salvo!");
      navigate("/lanches");
    } catch (err: any) {
      if(err.errors) alert(err.errors[0].message); else alert("Erro ao salvar.");
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-lg">
          <div className="card-body p-4">
            
            <div className="text-center mb-4">
               <i className="bi bi-basket2-fill display-1 text-danger"></i>
               <h3 className="mt-2 fw-bold">{id ? "Editar Item" : "Novo Item da Lanches"}</h3>
            </div>

            <form onSubmit={submit}>
              <div className="mb-3">
                 <Input label="Nome do Produto" value={data.nome} onChange={(e) => setData({ ...data, nome: e.target.value })} placeholder="Ex: Combo Pipoca + Refri" />
              </div>
              
              <div className="mb-3">
                 <Input label="Descrição Curta" value={data.descricao} onChange={(e) => setData({ ...data, descricao: e.target.value })} />
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <Input type="number" label="Preço (R$)" value={data.valorUnitario} onChange={(e) => setData({ ...data, valorUnitario: Number(e.target.value) })} />
                </div>
                <div className="col-6">
                  <Input type="number" label="Estoque Inicial" value={data.qtUnidade} onChange={(e) => setData({ ...data, qtUnidade: Number(e.target.value) })} />
                </div>
              </div>

              <div className="d-grid gap-2 mt-4">
                <Button type="submit" variant="primary" size="lg">Salvar Produto</Button>
                <Button type="button" variant="link" className="text-decoration-none text-muted" onClick={() => navigate("/lanches")}>Cancelar</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}