import { useEffect, useState } from "react";
import * as sessoesService from "../../services/sessoes";
import * as filmesService from "../../services/filmes";
import * as salasService from "../../services/salas";

import Button from "../../components/Button";
import Card from "../../components/Card";

import type { Sessao, Filme, Sala } from "../../types";
import { useNavigate } from "react-router-dom";

export default function SessoesList() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  const navigate = useNavigate();

async function carregar() {
  const [listaSessoes, listaFilmes, listaSalas] = await Promise.all([
    sessoesService.listar(),
    filmesService.listar(),
    salasService.listar()
  ]);

  setSessoes(listaSessoes);
  setFilmes(listaFilmes);
  setSalas(listaSalas);
}

useEffect(() => {
  carregar();
}, []);


  function filmeDe(id: number) {
  const filme = filmes.find((f) => String(f.id) === String(id));
  return filme ? filme.titulo : "Filme removido";
  
}

  function salaDe(id: number) {
    const sala = salas.find((s) => s.id === id);
    return sala ? sala.numero : "Sala removida";
  }


  

  async function remover(id: number) {
    if (confirm("Excluir sessão?")) {
      await sessoesService.removerSessao(id);
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
