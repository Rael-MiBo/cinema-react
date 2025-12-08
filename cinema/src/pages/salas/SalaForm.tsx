import { useEffect, useState } from "react";
import type { Sala } from "../../types";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { salaSchema } from "../../schemas/salaSchema";
import * as salasService from "../../services/salas";
import { useNavigate, useParams } from "react-router-dom";

export default function SalaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<Sala>({
    numero: 0,
    capacidade: 0,
  });

  function update(field: keyof Sala, value: any) {
    setData((d) => ({ ...d, [field]: value }));
  }

  async function carregar() {
    if (id) {
      setData(await salasService.obter(Number(id)));
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    try {
      salaSchema.parse(data);
      if (id) await salasService.atualizar(Number(id), data);
      else await salasService.criar(data);

      alert("Sala salva!");
      navigate("/salas");
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  }

  return (
    <div className="col-md-6 mx-auto">
      <h2 className="text-center mb-4">{id ? "Editar Sala" : "Nova Sala"}</h2>

      <form onSubmit={submit}>
        <Input
          type="number"
          label="Número da sala"
          value={data.numero}
          onChange={(e) => update("numero", Number(e.target.value))}
        />

        <Input
          type="number"
          label="Capacidade"
          value={data.capacidade}
          onChange={(e) => update("capacidade", Number(e.target.value))}
        />

        <div className="text-center">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </div>
  );
}
