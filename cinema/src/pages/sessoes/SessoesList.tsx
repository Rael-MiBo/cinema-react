import { useEffect, useState } from "react";
import { sessoesService } from "../../services/sessoes";
import { filmesService } from "../../services/filmes";
import { salasService } from "../../services/salas";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import type { Sessao, Filme, Sala } from "../../types";

export default function SessoesList() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

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

  function getNomeFilme(id: any) {
    const filme = filmes.find(f => String(f.id) === String(id));
    return filme ? filme.titulo : "Filme não encontrado";
  }

  function getNumSala(id: any) {
    const sala = salas.find(s => String(s.id) === String(id));
    return sala ? `Sala ${sala.numero}` : "Sala N/A";
  }

  async function remover(id: any) {
    if (confirm("Excluir sessão?")) {
      await sessoesService.remover(id);
      carregar();
    }
  }

  return (
    <div>
      <h2 className="text-center mb-4">Sessões Disponíveis</h2>
      <div className="text-center mb-3">
        <Button onClick={() => navigate("/sessoes/novo")}>Nova Sessão</Button>
      </div>

      <div className="row">
        {sessoes.map((s) => (
          <div key={s.id} className="col-md-4 mb-3">
            <Card
              title={getNomeFilme(s.filmeId)}
              footer={
                <div className="d-flex justify-content-between">
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/sessoes/${s.id}`)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remover(s.id)}>
                    Excluir
                  </Button>
                </div>
              }
            >
              <p><strong>Local:</strong> {getNumSala(s.salaId)}</p>
              <p><strong>Horário:</strong> {new Date(s.horarioExibicao).toLocaleString()}</p>
              
              {/* Note: Botão de Vender Ingresso vai virar "Novo Pedido" depois */}
              <Button className="mt-2 w-100" onClick={() => navigate(`/venda/${s.id}`)}>
                Vender Ingresso + Lanche
              </Button>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}