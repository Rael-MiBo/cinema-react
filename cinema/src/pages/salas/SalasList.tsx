import { useEffect, useState } from "react";
import * as salasService from "../../services/salas";
import type { Sala } from "../../types";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { useNavigate } from "react-router-dom";

export default function SalasList() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const navigate = useNavigate();

  async function carregar() {
    setSalas(await salasService.listar());
  }

  useEffect(() => {
    carregar();
  }, []);

  async function remover(id: number) {
    if (confirm("Excluir sala?")) {
      await salasService.removerSala(id);
      carregar();
    }
  }

  return (
    <div>
      <h2 className="text-center mb-4">Salas</h2>

      <div className="text-center mb-3">
        <Button onClick={() => navigate("/salas/novo")}>Nova Sala</Button>
      </div>

      <div className="row">
        {salas.map((s) => (
          <div key={s.id} className="col-md-4 mb-3">
            <Card
              title={`Sala ${s.numero}`}
              footer={
                <div className="d-flex justify-content-between">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/salas/${s.id}`)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => remover(s.id!)}
                  >
                    Excluir
                  </Button>
                </div>
              }
            >
              <p><strong>Capacidade:</strong> {s.capacidade}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
