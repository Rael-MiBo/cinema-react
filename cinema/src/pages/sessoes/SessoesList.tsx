import React, { useEffect, useState } from "react";
import * as sessoesService from "../../services/sessoes";
import * as filmesService from "../../services/filmes";
import * as salasService from "../../services/salas";

import Button from "../../components/Button";
import Card from "../../components/Card";

import { Sessao, Filme, Sala } from "../../types";
import { useNavigate } from "react-router-dom";

export default function SessoesList() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  const navigate = useNavigate();

  async function carregar() {
    setSessoes(await sessoesService.listar());
    setFilmes(await filmesService.listar());
    setSalas(await salasService.listar());
  }

  useEffect(() => {
    carregar();
  }, []);

  function filmeDe(id: number) {
    return filmes.find((f) => f.id === id)?.titulo ?? "Desconhecido";
  }

  function salaDe(id: number) {
    return salas.find((s) => s.id === id)?.numero ?? "??";
  }

  async function remover(id: number) {
    if (confirm("Excluir sessão?")) {
      await sessoesService.remover(id);
      carregar();
    }
  }

  return (
    <div>
      <h2 className="text-center mb-4">Sessões</h2>

      <div className="text-center mb-3">
        <Button onClick={() => navigate("/sessoes/novo")}>Nova Sessão</Button>
      </div>

      <div className="row">
        {sessoes.map((s) => (
          <div key={s.id} className="col-md-4 mb-3">
            <Card
              title={filmeDe(s.filmeId)}
              footer={
                <div className="d-flex justify-content-between">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/sessoes/${s.id}`)}
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
              <p><strong>Sala:</strong> {salaDe(s.salaId)}</p>
              <p>
                <strong>Horário:</strong>{" "}
                {new Date(s.horarioExibicao).toLocaleString()}
              </p>

              <Button
                size="sm"
                className="mt-2"
                onClick={() => navigate(`/ingressos/vender/${s.id}`)}
              >
                Vender Ingresso
              </Button>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
