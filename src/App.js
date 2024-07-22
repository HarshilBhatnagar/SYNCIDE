// src/App.js
import React, { useState } from 'react';
import CodeEditor from './components/Editor';
import CodeTerminal from './components/Terminal';
import './App.css';

const App = () => {
  const [compileResult, setCompileResult] = useState('');

  const handleCompileResult = (result) => {
    setCompileResult(result);
  };

  return (
    <div className="App">
      <div className="editor">
        <CodeEditor onCompileResult={handleCompileResult} />
      </div>
      <div className="terminal">
        <CodeTerminal compileResult={compileResult} />
      </div>
    </div>
  );
};

export default App;
