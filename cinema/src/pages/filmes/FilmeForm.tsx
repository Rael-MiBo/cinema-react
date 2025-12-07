import React, { useEffect, useState } from "react";
import { Filme } from "../../types";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { filmeSchema } from "../../schemas/filmeSchema";
import * as filmesService from "../../services/filmes";
import { useNavigate, useParams } from "react-router-dom";

export default function FilmeForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<Filme>({
    titulo: "",
    sinopse: "",
    classificacao: "",
    duracao: 0,
    genero: "",
  });

  function update(field: keyof Filme, value: any) {
    setData((d) => ({ ...d, [field]: value }));
  }

  async function carregar() {
    if (id) {
      const filme = await filmesService.buscar(Number(id));
      setData(filme);
    }
  }

  useEffect(() => {
    carregar();
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    try {
      filmeSchema.parse(data);
      if (id) await filmesService.atualizar(Number(id), data);
      else await filmesService.criar(data);

      alert("Filme salvo!");
      navigate("/filmes");
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  }

  return (
    <div className="col-md-6 mx-auto">
      <h2 className="text-center mb-4">{id ? "Editar Filme" : "Novo Filme"}</h2>

      <form onSubmit={submit}>
        <Input
          label="Título"
          value={data.titulo}
          onChange={(e) => update("titulo", e.target.value)}
        />

        <Input
          label="Sinopse"
          value={data.sinopse}
          onChange={(e) => update("sinopse", e.target.value)}
        />

        <Input
          label="Classificação"
          value={data.classificacao}
          onChange={(e) => update("classificacao", e.target.value)}
        />

        <Input
          type="number"
          label="Duração (minutos)"
          value={data.duracao}
          onChange={(e) => update("duracao", Number(e.target.value))}
        />

        <Input
          label="Gênero"
          value={data.genero}
          onChange={(e) => update("genero", e.target.value)}
        />

        <div className="text-center">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </div>
  );
}
