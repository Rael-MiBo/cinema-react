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

  const [data, setData] = useState<LancheCombo>({
    nome: "",
    descricao: "",
    valorUnitario: 0,
    qtUnidade: 0,
  });

  useEffect(() => {
    if (id) {
      lanchesService.obter(id).then(setData).catch(console.error);
    }
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    try {

      lancheSchema.parse(data);

      if (id) await lanchesService.atualizar(id, data);
      else await lanchesService.criar(data);

      alert("Lanche salvo!");
      navigate("/lanches");
    } catch (err: any) {
      if(err.errors) alert(err.errors[0].message);
      else alert("Erro ao salvar.");
    }
  }

  return (
    <div className="col-md-6 mx-auto">
      <h2 className="text-center mb-4">{id ? "Editar Lanche" : "Novo Lanche"}</h2>
      <form onSubmit={submit}>
        <Input
          label="Nome (ex: Pipoca Grande)"
          value={data.nome}
          onChange={(e) => setData({ ...data, nome: e.target.value })}
        />
        
        <Input
          label="Descrição"
          value={data.descricao}
          onChange={(e) => setData({ ...data, descricao: e.target.value })}
        />

        <div className="row">
          <div className="col-6">
            <Input
              type="number"
              label="Preço (R$)"
              value={data.valorUnitario}
              onChange={(e) => setData({ ...data, valorUnitario: Number(e.target.value) })}
            />
          </div>
          <div className="col-6">
            <Input
              type="number"
              label="Estoque"
              value={data.qtUnidade}
              onChange={(e) => setData({ ...data, qtUnidade: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="text-center mt-3">
          <Button type="submit">Salvar Lanche</Button>
        </div>
      </form>
    </div>
  );
}