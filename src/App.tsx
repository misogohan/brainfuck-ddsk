import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { run as bfRun } from './brainfuck/mod';
import './App.css'

const randomGen = function *() { for (;;) yield (Math.random() * 2 | 0) + 48; }();

function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');

  const onCodeChange = (ev: ChangeEvent<HTMLTextAreaElement>) => {
    setCode(ev.target.value);
  };

  const run = () => setOutput(bfRun(code, randomGen));
  const cse = (ev: KeyboardEvent) => {
    if (ev.ctrlKey && ev.shiftKey && ev.code === "Enter") run();
  };

  return (
    <div className="App">
      <h1>DDSK in Brainfuck!</h1>
      <textarea className="code" value={code} onChange={onCodeChange} onKeyDown={cse}/>
      <div className="output">
        <nav><button className="run" onClick={run}>Run</button></nav>
        <code>{ output }</code>
      </div>
    </div>
  )
}

export default App
