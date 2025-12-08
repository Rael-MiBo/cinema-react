import { useEffect, useState } from "react";
import { salasService } from "../../services/salas";
import type { Sala } from "../../types";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { useNavigate } from "react-router-dom";

export default function SalasList() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const dados = await salasService.listar();
      setSalas(dados);
    } catch (error) {
      console.error("Erro ao carregar salas", error);
    }
  }

  async function remover(id: string | number) {
    // Aviso de cascata para o usuário saber o que está fazendo
    if (confirm("ATENÇÃO: Excluir esta sala vai apagar todas as sessões agendadas nela.\nDeseja continuar?")) {
      await salasService.remover(id);
      carregar();
    }
  }

  return (
    <div>
      <h2 className="text-center mb-4">Salas do Cinema</h2>

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
              <p className="fs-5">
                <strong>Capacidade:</strong> {s.capacidade} assentos
              </p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}