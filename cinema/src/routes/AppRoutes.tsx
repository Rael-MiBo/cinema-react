import { BrowserRouter, Routes, Route } from "react-router-dom";

import FilmesList from "../pages/filmes/FilmesList";
import FilmeForm from "../pages/filmes/FilmeForm";

import SalasList from "../pages/salas/SalasList";
import SalaForm from "../pages/salas/SalaForm";

import SessoesList from "../pages/sessoes/SessoesList";
import SessaoForm from "../pages/sessoes/SessaoForm";

import IngressoForm from "../pages/ingressos/IngressoForm";

import Navbar from "../components/Nav/Navbar";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <div className="container mt-4">
        <Routes>
          {/* FILMES */}
          <Route path="/filmes" element={<FilmesList />} />
          <Route path="/filmes/novo" element={<FilmeForm />} />
          <Route path="/filmes/:id" element={<FilmeForm />} />

          {/* SALAS */}
          <Route path="/salas" element={<SalasList />} />
          <Route path="/salas/novo" element={<SalaForm />} />
          <Route path="/salas/:id" element={<SalaForm />} />

          {/* SESSÕES */}
          <Route path="/sessoes" element={<SessoesList />} />
          <Route path="/sessoes/novo" element={<SessaoForm />} />
          <Route path="/sessoes/:id" element={<SessaoForm />} />

          {/* INGRESSOS */}
          <Route path="/ingressos/vender/:id" element={<IngressoForm />} />

          {/* HOME */}
          <Route path="*" element={<FilmesList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
