import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Services
import { sessoesService } from "../../services/sessoes";
import { filmesService } from "../../services/filmes";
import { salasService } from "../../services/salas";
import { lanchesService } from "../../services/lanches";
import { pedidosService } from "../../services/pedidos";

// Components & Types
import Button from "../../components/Button";
import Input from "../../components/Input";
import Card from "../../components/Card";
import type { Sessao, Filme, Sala, LancheCombo } from "../../types";
import { pedidoSchema } from "../../schemas/pedidoSchema";

export default function VendaForm() {
  const { sessaoId } = useParams();
  const navigate = useNavigate();

  // Estados dos Dados
  const [sessao, setSessao] = useState<Sessao | null>(null);
  const [filme, setFilme] = useState<Filme | null>(null);
  const [sala, setSala] = useState<Sala | null>(null);
  const [listaLanches, setListaLanches] = useState<LancheCombo[]>([]);

  // Estados do Formulário
  const [qtInteira, setQtInteira] = useState(0);
  const [qtMeia, setQtMeia] = useState(0);
  const [carrinhoLanches, setCarrinhoLanches] = useState<{ lanche: LancheCombo; qt: number }[]>([]);

  // Estado temporário lanche
  const [lancheSelecionadoId, setLancheSelecionadoId] = useState<string>("");
  const [qtLancheTemp, setQtLancheTemp] = useState(1);

  // --- CORREÇÃO AQUI: LER O PREÇO DINAMICAMENTE ---
  // Se a sessão existe e tem preço, usa ele. Se não, usa 0.
  const valorIngresso = sessao?.valorIngresso ? Number(sessao.valorIngresso) : 0;

  useEffect(() => {
    (async () => {
      try {
        if (!sessaoId) return;
        // Carrega a sessão
        const s = await sessoesService.obter(sessaoId);
        
        // Carrega o resto baseado na sessão
        const f = await filmesService.obter(s.filmeId);
        const sl = await salasService.obter(s.salaId);
        const lanches = await lanchesService.listar();

        setSessao(s);
        setFilme(f);
        setSala(sl);
        setListaLanches(lanches);
      } catch (error) {
        alert("Erro ao carregar dados.");
        navigate("/sessoes");
      }
    })();
  }, [sessaoId]);

  function adicionarLanche() {
    if (!lancheSelecionadoId) return;
    const lancheReal = listaLanches.find(l => String(l.id) === String(lancheSelecionadoId));
    if (!lancheReal) return;

    setCarrinhoLanches((prev) => [...prev, { lanche: lancheReal, qt: qtLancheTemp }]);
    setLancheSelecionadoId("");
    setQtLancheTemp(1);
  }

  function removerLanche(index: number) {
    setCarrinhoLanches(prev => prev.filter((_, i) => i !== index));
  }

  // --- CÁLCULO TOTAL USANDO A VARIÁVEL DINÂMICA ---
  function calcularTotal() {
    const totalIngressos = (qtInteira * valorIngresso) + (qtMeia * (valorIngresso / 2));
    const totalLanches = carrinhoLanches.reduce((acc, item) => acc + (item.lanche.valorUnitario * item.qt), 0);
    return totalIngressos + totalLanches;
  }

  async function finalizarVenda() {
    const total = calcularTotal();

    const novoPedido = {
      sessaoId: sessaoId!,
      qtInteira,
      qtMeia,
      lanches: carrinhoLanches.map(item => ({
        lancheId: item.lanche.id!,
        quantidade: item.qt,
        valorPago: item.lanche.valorUnitario
      })),
      valorTotal: total,
      dataPedido: new Date().toISOString()
    };

    try {
      pedidoSchema.parse(novoPedido);
      await pedidosService.criar(novoPedido);
      alert(`Venda realizada!\nTotal: R$ ${total.toFixed(2)}`);
      navigate("/sessoes");
    } catch (err: any) {
      if(err.errors) alert(err.errors[0].message);
      else alert("Erro ao finalizar venda.");
    }
  }

  if (!sessao || !filme || !sala) return <div className="text-center mt-5">Carregando dados...</div>;

  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <Card title="Dados da Sessão">
          <h3>{filme.titulo}</h3>
          <p><strong>Sala:</strong> {sala.numero}</p>
          <p><strong>Horário:</strong> {new Date(sessao.horarioExibicao).toLocaleString()}</p>
          <hr />
          
          <h5 className="mb-3">Ingressos</h5>
          {/* Se o valor for 0, avisa que precisa configurar a sessão */}
          {valorIngresso === 0 && (
            <div className="alert alert-warning">
              Atenção: Esta sessão está com preço R$ 0,00. Edite a sessão para corrigir.
            </div>
          )}

          <div className="row">
            <div className="col-6">
              <Input 
                type="number" 
                // MOSTRA O PREÇO NO LABEL
                label={`Inteira (R$ ${valorIngresso.toFixed(2)})`}
                value={qtInteira}
                onChange={e => setQtInteira(Math.max(0, Number(e.target.value)))}
              />
            </div>
            <div className="col-6">
              <Input 
                type="number" 
                // MOSTRA O PREÇO NO LABEL
                label={`Meia (R$ ${(valorIngresso / 2).toFixed(2)})`}
                value={qtMeia}
                onChange={e => setQtMeia(Math.max(0, Number(e.target.value)))}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="col-md-6">
        <Card title="Bombonière (Lanches)">
          <div className="d-flex gap-2 align-items-end mb-3">
            <div className="flex-grow-1">
              <label className="form-label">Lanche</label>
              <select 
                className="form-select" 
                value={lancheSelecionadoId}
                onChange={e => setLancheSelecionadoId(e.target.value)}
              >
                <option value="">Selecione...</option>
                {listaLanches.map(l => (
                  <option key={String(l.id)} value={String(l.id)}>
                    {l.nome} - R$ {Number(l.valorUnitario).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div style={{width: "80px"}}>
              <label className="form-label">Qtd</label>
              <input 
                type="number" className="form-control" value={qtLancheTemp}
                onChange={e => setQtLancheTemp(Number(e.target.value))}
              />
            </div>
            <Button onClick={adicionarLanche}>+</Button>
          </div>

          {carrinhoLanches.length > 0 && (
            <table className="table table-sm table-striped">
              <thead><tr><th>Item</th><th>Qtd</th><th>Total</th><th></th></tr></thead>
              <tbody>
                {carrinhoLanches.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.lanche.nome}</td>
                    <td>{item.qt}</td>
                    <td>R$ {(item.qt * item.lanche.valorUnitario).toFixed(2)}</td>
                    <td><button className="btn btn-sm btn-outline-danger" onClick={() => removerLanche(idx)}>X</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <div className="card mt-3 bg-light">
          <div className="card-body text-center">
            <h2 className="text-primary">Total: R$ {calcularTotal().toFixed(2)}</h2>
            <Button className="w-100 mt-2" onClick={finalizarVenda}>FINALIZAR</Button>
          </div>
        </div>
      </div>
    </div>
  );
}