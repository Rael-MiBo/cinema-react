import { Button } from "./components/Button"
import { Input } from "./components/Input"

function App() {

  return (
    <>
      <Input id="teste" name="nome" placeholder="Digite algo" onChange = {(e) => console.log (e.target.value)} />
      <Button label = "Clique aqui" variant="primary" onClick={() => alert('teste')}/>
    </>
  )
}

export default App