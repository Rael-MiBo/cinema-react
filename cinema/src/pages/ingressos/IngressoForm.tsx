// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import Input from "../../components/Input";
// import Select from "../../components/Select";
// import Button from "../../components/Button";
// import Card from "../../components/Card";

// import * as sessoesService from "../../services/sessoes";
// import * as filmesService from "../../services/filmes";
// import * as salasService from "../../services/salas";
// import * as ingressosService from "../../services/ingressos";

// import { ingressoSchema } from "../../schemas/ingressoSchema";

// export default function IngressoForm() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [sessao, setSessao] = useState<any>(null);
//   const [filme, setFilme] = useState<any>(null);
//   const [sala, setSala] = useState<any>(null);

//   const [tipo, setTipo] = useState<"inteira" | "meia">("inteira");
//   const [valorBase, setValorBase] = useState<number>(20);

//   function calcularValor(): number {
//     return tipo === "meia" ? valorBase / 2 : valorBase;
//   }

//   useEffect(() => {
//     (async () => {
//       try {
//         const sess = await sessoesService.obter(id ? Number(id) : 0); 
        
//         const filme = await filmesService.obter(sess.filmeId);
//         const sala = await salasService.obter(sess.salaId);

//         setSessao(sess);
//         setFilme(filme);
//         setSala(sala);
//       } catch (error) {
//         console.error("Erro ao carregar dados:", error);
//         alert("Erro ao carregar dados da venda.");
//       }
//     })();
//   }, [id]);

//   async function submit(e: any) {
//     e.preventDefault();

//     const body = {
//       sessaoId: Number(id),
//       tipo,
//       valor: calcularValor(),
//     };

//     try {
//       ingressoSchema.parse(body);
//       await ingressosService.criar(body);

//       alert("Ingresso vendido com sucesso!");
//       navigate("/sessoes");
//     } catch (err: any) {
//       alert("Erro: " + err.message);
//     }
//   }

//   if (!sessao || !filme || !sala) return <p>Carregando...</p>;

//   return (
//     <div className="col-md-6 mx-auto">
//       <Card title="Venda de Ingresso">
//         <p><strong>Filme:</strong> {filme.titulo}</p>
//         <p><strong>Sala:</strong> {sala.numero}</p>
//         <p><strong>Horário:</strong> {new Date(sessao.horarioExibicao).toLocaleString()}</p>

//         <form onSubmit={submit}>
//           <Select
//             label="Tipo"
//             value={tipo}
//             onChange={(e) => setTipo(e.target.value as any)}
//             options={[
//               { value: "inteira", label: `Inteira (R$ ${valorBase.toFixed(2)})` },
//               { value: "meia", label: `Meia (R$ ${(valorBase / 2).toFixed(2)})` },
//             ]}
//           />

//           <Input
//             type="number"
//             label="Valor Base (R$)"
//             value={valorBase}
//             onChange={(e) => setValorBase(Number(e.target.value))}
//           />

//           <p className="fs-4 mt-3 text-center">
//             <strong>Valor Final: R$ {calcularValor().toFixed(2)}</strong>
//           </p>

//           <div className="text-center">
//             <Button type="submit">Confirmar Venda</Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }
