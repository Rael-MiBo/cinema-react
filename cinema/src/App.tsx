import { Button } from "./components/Button"

function App() {

  return (
    <>
      <Button label = "Clique aqui" variant="primary" onClick={() => alert('teste')}/>
    </>
  )
}

export default App