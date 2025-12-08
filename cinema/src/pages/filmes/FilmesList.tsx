import { useEffect, useState } from "react";
import { filmesService } from "../../services/filmes";
import type { Filme } from "../../types";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { useNavigate } from "react-router-dom";

export default function FilmesList() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const dados = await filmesService.listar();
      setFilmes(dados);
    } catch (error) {
      console.error(error);
    }
  }

  async function remover(id: string | number) {
    if (confirm("Tem certeza que deseja excluir este filme e suas sessões?")) {
      await filmesService.remover(id);
      carregar();
    }
  }

  return (
    <div>
      <h2 className="text-center mb-4">Filmes em Cartaz</h2>

      <div className="text-center mb-3">
        <Button onClick={() => navigate("/filmes/novo")}>Novo Filme</Button>
      </div>

      <div className="row">
        {filmes.map((f) => (
          <div className="col-md-4 mb-3" key={f.id}>
            <Card
              title={f.titulo}
              footer={
                <div className="d-flex justify-content-between">
                  <Button size="sm" variant="secondary" onClick={() => navigate(`/filmes/${f.id}`)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => remover(f.id!)}>
                    Excluir
                  </Button>
                </div>
              }
            >
              <p><strong>Gênero:</strong> {f.genero}</p>
              <p><strong>Duração:</strong> {f.duracao} min</p>
              <p className="text-muted small">{f.sinopse}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}