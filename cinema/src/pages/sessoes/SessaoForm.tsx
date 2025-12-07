import React, { useEffect, useState } from "react";

import Input from "../../components/Input";
import Select from "../../components/Select";
import Button from "../../components/Button";

import * as sessoesService from "../../services/sessoes";
import * as filmesService from "../../services/filmes";
import * as salasService from "../../services/salas";

import { sessaoSchema } from "../../schemas/sessaoSchema";
import { Sessao, Filme, Sala } from "../../types";

import { useNavigate, useParams } from "react-router-dom";

export default function SessaoForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);

  const [data, setData] = useState<Sessao>({
    filmeId: 0,
    salaId: 0,
    horarioExibicao: "",
  });

  function update(field: keyof Sessao, value: any) {
    setData((d) => ({ ...d, [field]: value }));
  }

  async function carregar() {
    setFilmes(await filmesService.listar());
    setSalas(await salasService.listar());

    if (id) {
      const sessao = await sessoesService.buscar(Number(id));
      setData(sessao);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    try {
      sessaoSchema.parse(data);

      if (id) await sessoesService.atualizar(Number(id), data);
      else await sessoesService.criar(data);

      alert("Sessão salva!");
      navigate("/sessoes");
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  }

  return (
    <div className="col-md-6 mx-auto">
      <h2 className="text-center mb-4">{id ? "Editar Sessão" : "Nova Sessão"}</h2>

      <form onSubmit={submit}>
        <Select
          label="Filme"
          value={data.filmeId}
          onChange={(e) => update("filmeId", Number(e.target.value))}
          options={filmes.map((f) => ({ value: f.id!, label: f.titulo }))}
        />

        <Select
          label="Sala"
          value={data.salaId}
          onChange={(e) => update("salaId", Number(e.target.value))}
          options={salas.map((s) => ({ value: s.id!, label: `Sala ${s.numero}` }))}
        />

        <Input
          type="datetime-local"
          label="Horário"
          value={data.horarioExibicao}
          onChange={(e) => update("horarioExibicao", e.target.value)}
        />

        <div className="text-center">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </div>
  );
}
