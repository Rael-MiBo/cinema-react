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
        <div className="card shadow border-0">
          <div className="card-header bg-success text-white py-3">
            <h4 className="mb-0 fw-bold"><i className="bi bi-grid-3x3-gap-fill me-2"></i>{id ? "Editar Sala" : "Nova Sala"}</h4>
          </div>
          <div className="card-body p-4">
            <form onSubmit={submit}>
              
              <Input 
                type="number" 
                label="Número da Sala" 
                value={data.numero} 
                onChange={e => setData({...data, numero: Number(e.target.value)})} 
              />

              <Input 
                type="number" 
                label="Capacidade Máxima" 
                value={data.capacidade} 
                onChange={e => setData({...data, capacidade: Number(e.target.value)})} 
              />
              <div className="form-text mb-3">Isso definirá o mapa de assentos.</div>

              <div className="d-grid gap-2">
                <Button type="submit" variant="success"><i className="bi bi-check-lg me-2"></i>Salvar Dados</Button>
                <Button type="button" variant="outline-secondary" onClick={() => navigate("/salas")}>Cancelar</Button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}