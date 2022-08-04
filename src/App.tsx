import { ChangeEvent, KeyboardEvent, useState } from 'react'
import { run as bfRun } from './brainfuck/mod';
import './App.css'

const randomGen = function *() { for (;;) yield (Math.random() * 2 | 0) + 48; }();
const initialCode = `This is a Brainfuck runtime
Here is hello world
+++++++++[>++++++++>+++++++++++>+++++<<<-]>.>++.+++++++..+++.>-.
------------.<++++++++.--------.+++.------.--------.>+.

>++++++++++..>

You can get random characters of '0' or '1'
++++++++[>++++++++<-]>[<,.>-]

In Brainfuck write DDSK program (https://twitter.com/Sheeeeepla/status/1554028833942441984) here

shortcut:
  Ctrl+Shift+Enter: run the code
`

function App() {
  const [code, setCode] = useState(initialCode);
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
      <textarea spellCheck="false" className="code" value={code} onChange={onCodeChange} onKeyDown={cse}/>
      <div className="output">
        <nav><button className="run" onClick={run}>Run</button></nav>
        <pre>{ output }</pre>
      </div>
    </div>
  )
}

export default App
