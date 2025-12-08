import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Nav/Navbar";
import Home from "./pages/home/home";

import FilmesList from "./pages/filmes/FilmesList";
import FilmeForm from "./pages/filmes/FilmeForm";
import SalasList from "./pages/salas/SalasList";
import SalaForm from "./pages/salas/SalaForm";
import LanchesList from "./pages/lanches/lanchesList";
import LancheForm from "./pages/lanches/LancheForm";
import SessoesList from "./pages/sessoes/SessoesList";
import SessaoForm from "./pages/sessoes/SessaoForm";
import VendaForm from "./pages/venda/VendaForm";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/filmes" element={<FilmesList />} />
          <Route path="/filmes/novo" element={<FilmeForm />} />
          <Route path="/filmes/:id" element={<FilmeForm />} />

          <Route path="/salas" element={<SalasList />} />
          <Route path="/salas/novo" element={<SalaForm />} />
          <Route path="/salas/:id" element={<SalaForm />} />

          <Route path="/lanches" element={<LanchesList />} />
          <Route path="/lanches/novo" element={<LancheForm />} />
          <Route path="/lanches/:id" element={<LancheForm />} />

          <Route path="/sessoes" element={<SessoesList />} />
          <Route path="/sessoes/novo" element={<SessaoForm />} />
          <Route path="/sessoes/:id" element={<SessaoForm />} />
          <Route path="/venda/:sessaoId" element={<VendaForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}