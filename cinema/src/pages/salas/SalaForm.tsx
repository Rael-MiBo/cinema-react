import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { salasService } from "../../services/salas";
import Input from "../../components/Input";
import Button from "../../components/Button";
import type { Sala } from "../../types";

export default function SalaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<Sala>({ numero: 0, capacidade: 0 });

  useEffect(() => {
    if (id) salasService.obter(id).then(setData).catch(console.error);
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    try {
      if (id) await salasService.atualizar(id, data);
      else await salasService.criar(data);
      alert("Sala salva!");
      navigate("/salas");
    } catch (err) { alert("Erro ao salvar."); }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow-lg">
          <div className="card-body p-5 text-center">
            
            <i className="bi bi-display display-1 text-secondary"></i>
            <h3 className="fw-bold my-3">{id ? "Configurar Sala" : "Nova Sala"}</h3>
            <p className="text-muted mb-4">Defina o número e a capacidade máxima de assentos.</p>

            <form onSubmit={submit} className="text-start">
              
              <div className="mb-3">
                 <Input type="number" label="Número da Sala" value={data.numero} onChange={e => setData({...data, numero: Number(e.target.value)})} />
              </div>

              <div className="mb-4">
                 <Input type="number" label="Capacidade (Lugares)" value={data.capacidade} onChange={e => setData({...data, capacidade: Number(e.target.value)})} />
              </div>

              <Button type="submit" variant="primary" className="w-100 mb-2">Salvar Configuração</Button>
              <Button type="button" variant="outline-secondary" className="w-100" onClick={() => navigate("/salas")}>Voltar</Button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}