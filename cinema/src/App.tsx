import { BrowserRouter } from "react-router-dom";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { Nav } from "./components/Nav";
import { AppRouters } from "./routes";

function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <AppRouters />
      </BrowserRouter>
      <Input
        id="teste"
        name="nome"
        placeholder="Digite algo"
        onChange={(e) => console.log(e.target.value)}
      />
      <Button
        label="Clique aqui"
        variant="primary"
        onClick={() => alert("teste")}
      />
    </>
  );
}

export default App;
