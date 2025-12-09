import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { sessoesService } from "../../services/sessoes";
import { filmesService } from "../../services/filmes";
import { salasService } from "../../services/salas";
import { lanchesService } from "../../services/lanches";
import { pedidosService } from "../../services/pedidos";

import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
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
          className={`btn ${cor} m-1 fw-bold`}
          style={{ width: "45px", height: "40px" }}
          onClick={() => toggleAssento(idAssento)}
          disabled={isOcupado}
        >
          {isOcupado ? <i className="bi bi-person-fill"></i> : idAssento}
        </button>
      );

      if (numero === cadeirasPorLinha)
        assentosRender.push(<br key={`br-${i}`} />);
    }
    return (
      <div className="text-center p-4 border rounded bg-dark mb-3">
        <div className="mb-3 text-muted">
          <i className="bi bi-display fs-1 d-block text-secondary opacity-50"></i>
          <small>TELA</small>
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
        `Selecione ${totalIngressos} assentos no mapa (você marcou ${assentosSelecionados.length}).`
      );
      return;
    }

    for (const item of carrinhoLanches) {
      if (item.qt > item.lanche.qtUnidade) {
        alert(
          `O item "${item.lanche.nome}" só tem ${item.lanche.qtUnidade} un. em estoque.`
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

      if (sessao) {
        await sessoesService.atualizar(sessaoId!, {
          ...sessao,
          lugaresOcupados: [...ocupados, ...assentosSelecionados],
        });
      }

      for (const item of carrinhoLanches) {
        await lanchesService.atualizar(item.lanche.id!, {
          ...item.lanche,
          qtUnidade: item.lanche.qtUnidade - item.qt,
        });
      }

      alert(`Venda Confirmada! Total: R$ ${total.toFixed(2)}`);
      navigate("/sessoes");
    } catch (err: any) {
      if (err.errors) alert(err.errors[0].message);
      else alert("Erro ao finalizar.");
    }
  }

  if (!sessao || !filme || !sala)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-danger"></div>
      </div>
    );

  return (
    <div className="row">
      <div className="col-lg-7 mb-4">
        <div className="card shadow-lg h-100">
          <div className="card-body p-4">
            <h4 className="fw-bold mb-3">
              <i className="bi bi-grid-3x3-gap-fill me-2 text-primary"></i>
              Assentos
            </h4>

            {renderMapaAssentos()}

            <div className="mt-4 p-3 bg-dark bg-opacity-25 rounded border border-secondary">
              <h5 className="mb-3 text-white">
                <i className="bi bi-ticket-perforated me-2"></i>Ingressos
              </h5>
              <div className="row g-3">
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
          </div>
        </div>
      </div>

      <div className="col-lg-5 mb-4">
        <div className="card shadow-lg h-100">
          <div className="card-body p-4 d-flex flex-column">
            <div className="mb-4">
              <h3 className="fw-bold text-danger">{filme.titulo}</h3>
              <div className="text-muted small">
                <i className="bi bi-clock me-1"></i>
                {new Date(sessao.horarioExibicao).toLocaleString()}
                <span className="mx-2">|</span>
                Sala {sala.numero}
              </div>
            </div>

            <h5 className="fw-bold mb-3">
              <i className="bi bi-basket2 me-2 text-warning"></i>Lanches
            </h5>

            <div className="row g-2 mb-3">
              <div className="col-8">
                <Select
                  label="Escolha o Lanche"
                  containerClassName="mb-0"
                  value={lancheSelecionadoId}
                  onChange={(e) => setLancheSelecionadoId(e.target.value)}
                  options={[
                    { value: "", label: "Selecione..." },
                    ...listaLanches.map((l) => ({
                      value: String(l.id),
                      label: `${l.nome} (R$ ${Number(l.valorUnitario).toFixed(
                        2
                      )})`,
                    })),
                  ]}
                />
              </div>

              <div className="col-4">
                <label
                  className="form-label text-muted fw-bold"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Qtd
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    value={qtLancheTemp}
                    onChange={(e) => setQtLancheTemp(Number(e.target.value))}
                    style={{
                      backgroundColor: "#333",
                      color: "white",
                      border: "none",
                    }}
                  />
                  <button className="btn btn-warning" onClick={adicionarLanche}>
                    <i className="bi bi-plus-lg"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-grow-1">
              {carrinhoLanches.length > 0 ? (
                <ul className="list-group list-group-flush mb-3 rounded">
                  {carrinhoLanches.map((item, idx) => (
                    <li
                      key={idx}
                      className="list-group-item d-flex justify-content-between align-items-center bg-transparent text-white border-secondary"
                    >
                      <div>
                        <span className="fw-bold text-warning">{item.qt}x</span>{" "}
                        {item.lanche.nome}
                      </div>
                      <div>
                        <span className="me-3">
                          R$ {(item.qt * item.lanche.valorUnitario).toFixed(2)}
                        </span>
                        <i
                          className="bi bi-trash text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => removerLanche(idx)}
                        ></i>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center text-muted small py-4 border border-secondary border-dashed rounded mb-3">
                  Nenhum lanche adicionado
                </div>
              )}
            </div>

            <div className="mt-auto pt-3 border-top border-secondary">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fs-5 text-muted">Total a Pagar</span>
                <span className="fs-2 fw-bold text-success">
                  R$ {calcularTotal().toFixed(2)}
                </span>
              </div>
              <Button
                className="w-100 py-3 fs-5"
                onClick={finalizarVenda}
                variant="success"
              >
                <i className="bi bi-check-circle-fill me-2"></i>CONFIRMAR COMPRA
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
