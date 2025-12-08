import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { salasService } from "../../services/salas";
import Input from "../../components/Input";
import Button from "../../components/Button";
import type { Sala } from "../../types";

export default function SalaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<Sala>({
    numero: 0,
    capacidade: 0,
  });

  useEffect(() => {
    if (id) {
      salasService.obter(id).then(setData).catch(console.error);
    }
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    try {
      if (id) await salasService.atualizar(id, data);
      else await salasService.criar(data);
      alert("Sala salva!");
      navigate("/salas");
    } catch (err) {
      alert("Erro ao salvar sala.");
    }
  }

  return (
    <div className="col-md-6 mx-auto">
      <h2 className="text-center mb-4">{id ? "Editar Sala" : "Nova Sala"}</h2>
      <form onSubmit={submit}>
        <Input 
          type="number" 
          label="Número da Sala" 
          value={data.numero} 
          onChange={(e) => setData({ ...data, numero: Number(e.target.value) })} 
        />
        <Input 
          type="number" 
          label="Capacidade" 
          value={data.capacidade} 
          onChange={(e) => setData({ ...data, capacidade: Number(e.target.value) })} 
        />
        <div className="text-center">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </div>
  );
}