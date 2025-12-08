import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { sessoesService } from "../../services/sessoes";
import { filmesService } from "../../services/filmes";
import { salasService } from "../../services/salas";
import { lanchesService } from "../../services/lanches";
import { pedidosService } from "../../services/pedidos";

import Button from "../../components/Button";
import Input from "../../components/Input";
import Card from "../../components/Card";
import type { Sessao, Filme, Sala, LancheCombo } from "../../types";
import { pedidoSchema } from "../../schemas/pedidoSchema";

export default function VendaForm() {
  const { sessaoId } = useParams();
  const navigate = useNavigate();

  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [filme, setFilme] = useState<Filme | null>(null);
  const [sala, setSala] = useState<Sala | null>(null);
  const [listaLanches, setListaLanches] = useState<LancheCombo[]>([]);

  const [qtInteira, setQtInteira] = useState(0);
  const [qtMeia, setQtMeia] = useState(0);
  const [carrinhoLanches, setCarrinhoLanches] = useState<
    { lanche: LancheCombo; qt: number }[]
  >([]);

  const [assentosSelecionados, setAssentosSelecionados] = useState<string[]>(
    []
  );
  const [ocupados, setOcupados] = useState<string[]>([]);

  const [lancheSelecionadoId, setLancheSelecionadoId] = useState<string>("");
  const [qtLancheTemp, setQtLancheTemp] = useState(1);

  const valorIngresso = sessao?.valorIngresso
    ? Number(sessao.valorIngresso)
    : 0;

  useEffect(() => {
    (async () => {
      try {
        if (!sessaoId) return;
        const s = await sessoesService.obter(sessaoId);
        const f = await filmesService.obter(s.filmeId);
        const sl = await salasService.obter(s.salaId);
        const lanches = await lanchesService.listar();

        setSessao(s);
        setFilme(f);
        setSala(sl);
        setListaLanches(lanches);
        setOcupados(s.lugaresOcupados || []);
      } catch (error) {
        alert("Erro ao carregar dados.");
        navigate("/sessoes");
      }
    })();
  }, [sessaoId]);

  function toggleAssento(assento: string) {
    if (ocupados.includes(assento)) return;
    if (assentosSelecionados.includes(assento)) {
      setAssentosSelecionados((prev) => prev.filter((a) => a !== assento));
    } else {
      setAssentosSelecionados((prev) => [...prev, assento]);
    }
  }

  function renderMapaAssentos() {
    if (!sala) return null;

    const cadeirasPorLinha = 8;
    const totalAssentos = sala.capacidade;
    const assentosRender = [];
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < totalAssentos; i++) {
      const linha = letras[Math.floor(i / cadeirasPorLinha)];
      const numero = (i % cadeirasPorLinha) + 1;
      const idAssento = `${linha}${numero}`;

      const isOcupado = ocupados.includes(idAssento);
      const isSelecionado = assentosSelecionados.includes(idAssento);

      let cor = "btn-outline-secondary";
      if (isOcupado) cor = "btn-danger disabled";
      else if (isSelecionado) cor = "btn-success";

      assentosRender.push(
        <button
          key={idAssento}
          className={`btn ${cor} m-1 btn-sm fw-bold`}
          style={{ width: "45px", height: "40px" }}
          onClick={() => toggleAssento(idAssento)}
          disabled={isOcupado}
          title={isOcupado ? "Ocupado" : "Livre"}
        >
          {isOcupado ? <i className="bi bi-person-fill"></i> : idAssento}
        </button>
      );

      if (numero === cadeirasPorLinha) {
        assentosRender.push(<br key={`br-${i}`} />);
      }
    }
    return (
      <div className="text-center p-3 border rounded bg-light">
        <div className="mb-4 text-muted">
          <i className="bi bi-display fs-1 d-block"></i>
          <small>TELA</small>
          <hr className="mx-auto" style={{ width: "50%" }} />
        </div>
        {assentosRender}
      </div>
    );
  }

  function adicionarLanche() {
    if (!lancheSelecionadoId) return;
    const lancheReal = listaLanches.find(
      (l) => String(l.id) === String(lancheSelecionadoId)
    );
    if (!lancheReal) return;
    setCarrinhoLanches((prev) => [
      ...prev,
      { lanche: lancheReal, qt: qtLancheTemp },
    ]);
    setLancheSelecionadoId("");
    setQtLancheTemp(1);
  }

  function removerLanche(index: number) {
    setCarrinhoLanches((prev) => prev.filter((_, i) => i !== index));
  }

  function calcularTotal() {
    const totalIngressos =
      qtInteira * valorIngresso + qtMeia * (valorIngresso / 2);
    const totalLanches = carrinhoLanches.reduce(
      (acc, item) => acc + item.lanche.valorUnitario * item.qt,
      0
    );
    return totalIngressos + totalLanches;
  }

  async function finalizarVenda() {
    const totalIngressos = qtInteira + qtMeia;

    if (totalIngressos === 0) {
      alert("Selecione pelo menos um ingresso.");
      return;
    }
    if (assentosSelecionados.length !== totalIngressos) {
      alert(
        `Erro: Você selecionou ${totalIngressos} ingressos, mas marcou ${assentosSelecionados.length} poltronas.`
      );
      return;
    }

    for (const item of carrinhoLanches) {
      if (item.qt > item.lanche.qtUnidade) {
        alert(
          `Erro: O lanche "${item.lanche.nome}" só tem ${item.lanche.qtUnidade} unidades em estoque.`
        );
        return;
      }
    }

    const total = calcularTotal();

    const novoPedido = {
      sessaoId: sessaoId!,
      qtInteira,
      qtMeia,
      lanches: carrinhoLanches.map((item) => ({
        lancheId: item.lanche.id!,
        quantidade: item.qt,
        valorPago: item.lanche.valorUnitario,
      })),
      valorTotal: total,
      dataPedido: new Date().toISOString(),
    };

    try {
      pedidoSchema.parse(novoPedido);

      await pedidosService.criar(novoPedido);

      const novosOcupados = [...ocupados, ...assentosSelecionados];
      if (sessao) {
        await sessoesService.atualizar(sessaoId!, {
          ...sessao,
          lugaresOcupados: novosOcupados,
        });
      }

      for (const item of carrinhoLanches) {
        const novaQtd = item.lanche.qtUnidade - item.qt;

        await lanchesService.atualizar(item.lanche.id!, {
          ...item.lanche,
          qtUnidade: novaQtd,
        });
      }

      alert(`Venda Confirmada!\nTotal: R$ ${total.toFixed(2)}`);
      navigate("/sessoes");
    } catch (err: any) {
      if (err.errors) alert(err.errors[0].message);
      else alert("Erro ao finalizar venda: " + err.message);
    }
  }

  if (!sessao || !filme || !sala)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <div className="row">
      <div className="col-md-7 mb-3">
        <Card
          title={
            <span>
              <i className="bi bi-grid-3x3-gap-fill me-2"></i>Seleção de
              Assentos
            </span>
          }
        >
          <div className="d-flex justify-content-center gap-3 mb-3">
            <span className="badge bg-secondary">
              <i className="bi bi-circle me-1"></i>Livre
            </span>
            <span className="badge bg-success">
              <i className="bi bi-check-circle me-1"></i>Selecionado
            </span>
            <span className="badge bg-danger">
              <i className="bi bi-x-circle me-1"></i>Ocupado
            </span>
          </div>

          {renderMapaAssentos()}

          <div className="mt-4 p-3 bg-white border rounded">
            <h5 className="mb-3">
              <i className="bi bi-ticket-perforated-fill me-2"></i>Ingressos
            </h5>
            <div className="row">
              <div className="col-6">
                <Input
                  type="number"
                  label={`Inteira (R$ ${valorIngresso.toFixed(2)})`}
                  value={qtInteira}
                  onChange={(e) =>
                    setQtInteira(Math.max(0, Number(e.target.value)))
                  }
                />
              </div>
              <div className="col-6">
                <Input
                  type="number"
                  label={`Meia (R$ ${(valorIngresso / 2).toFixed(2)})`}
                  value={qtMeia}
                  onChange={(e) =>
                    setQtMeia(Math.max(0, Number(e.target.value)))
                  }
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-md-5">
        <Card
          title={
            <span>
              <i className="bi bi-basket2-fill me-2"></i>Resumo & Lanches
            </span>
          }
        >
          <h4>{filme.titulo}</h4>
          <p className="text-muted">
            <i className="bi bi-clock me-1"></i>
            {new Date(sessao.horarioExibicao).toLocaleString()}
          </p>
          <hr />

          <div className="d-flex gap-2 align-items-end mb-3">
            <div className="flex-grow-1">
              <label className="form-label">Adicionar Lanche</label>
              <select
                className="form-select"
                value={lancheSelecionadoId}
                onChange={(e) => setLancheSelecionadoId(e.target.value)}
              >
                <option value="">Selecione...</option>
                {listaLanches.map((l) => (
                  <option key={String(l.id)} value={String(l.id)}>
                    {l.nome} - R$ {Number(l.valorUnitario).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ width: "70px" }}>
              <input
                type="number"
                className="form-control"
                value={qtLancheTemp}
                onChange={(e) => setQtLancheTemp(Number(e.target.value))}
              />
            </div>
            <Button
              onClick={adicionarLanche}
              variant="success"
              className="w-10"
            >
              <i className="bi bi-plus-lg fs-5"></i>
            </Button>
          </div>

          {carrinhoLanches.length > 0 ? (
            <ul className="list-group mb-3">
              {carrinhoLanches.map((item, idx) => (
                <li
                  key={idx}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <span className="fw-bold">{item.qt}x</span>{" "}
                    {item.lanche.nome}
                  </div>
                  <div>
                    <span className="me-3">
                      R$ {(item.qt * item.lanche.valorUnitario).toFixed(2)}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-danger border-0"
                      onClick={() => removerLanche(idx)}
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted mb-3 small">
              Nenhum lanche selecionado
            </div>
          )}

          <div className="alert alert-primary mt-3 text-center">
            <h3 className="fw-bold">
              <i className="bi bi-cart4 me-2"></i>R${" "}
              {calcularTotal().toFixed(2)}
            </h3>
            <Button className="w-100 mt-2 py-2 fs-5" onClick={finalizarVenda}>
              <i className="bi bi-check-lg me-2"></i>CONFIRMAR COMPRA
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
