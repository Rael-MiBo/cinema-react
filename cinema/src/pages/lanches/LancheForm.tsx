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
        <div className="card shadow border-0">
          <div className="card-header bg-warning text-dark py-3">
            <h4 className="mb-0 fw-bold"><i className="bi bi-cup-straw me-2"></i>{id ? "Editar Item" : "Novo Item"}</h4>
          </div>
          <div className="card-body p-4">
            <form onSubmit={submit}>
              <Input label="Nome do Produto" value={data.nome} onChange={(e) => setData({ ...data, nome: e.target.value })} />
              <Input label="Descrição" value={data.descricao} onChange={(e) => setData({ ...data, descricao: e.target.value })} />

              <div className="row">
                <div className="col-6">
                  <Input type="number" label="Preço Unitário (R$)" value={data.valorUnitario} onChange={(e) => setData({ ...data, valorUnitario: Number(e.target.value) })} />
                </div>
                <div className="col-6">
                  <Input type="number" label="Estoque (Unidades)" value={data.qtUnidade} onChange={(e) => setData({ ...data, qtUnidade: Number(e.target.value) })} />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button type="button" variant="light" onClick={() => navigate("/lanches")}>Cancelar</Button>
                <Button type="submit" variant="warning"><i className="bi bi-save me-2"></i>Salvar Item</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}