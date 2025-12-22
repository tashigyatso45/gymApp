import { Button } from "./ui/button";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center gap-4">
      <Button>Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <h1>Hello</h1>
    </div>
  );
}

export default App;
