import { useEffect, useState } from "react";
import { lanchesService } from "../../services/lanches";
import type { LancheCombo } from "../../types";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";

export default function LanchesList() {
  const [lanches, setLanches] = useState<LancheCombo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const dados = await lanchesService.listar();
    setLanches(dados);
  }

  async function remover(id: string | number) {
    if (confirm("Excluir este item?")) {
      await lanchesService.remover(id);
      carregar();
    }
  }

  return (
    <div>
      <h2 className="text-center mb-4">Bombonière</h2>
      <div className="text-center mb-3">
        <Button onClick={() => navigate("/lanches/novo")}>Novo Lanche</Button>
      </div>

      <div className="row">
        {lanches.map((l) => (
          <div key={l.id} className="col-md-4 mb-3">
            <Card
              title={l.nome}
              footer={
                <div className="d-flex justify-content-between">
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/lanches/${l.id}`)}>Editar</Button>
                  <Button size="sm" variant="danger" onClick={() => remover(l.id!)}>Excluir</Button>
                </div>
              }
            >
              <p>R$ {Number(l.valorUnitario).toFixed(2)}</p>
              <p className="text-muted">{l.qtUnidade} un. em estoque</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}