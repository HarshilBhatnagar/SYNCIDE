// src/components/Terminal.js
import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const CodeTerminal = ({ compileResult }) => {
  const terminalRef = useRef(null);
  const fitAddonRef = useRef(null);
  const terminalInstanceRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      const terminal = new Terminal();
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      terminal.open(terminalRef.current);
      fitAddon.fit();

      // Save references
      fitAddonRef.current = fitAddon;
      terminalInstanceRef.current = terminal;

      // Example: Print a welcome message
      terminal.writeln('Welcome to SYNCIDE Terminal!');

      // Cleanup
      return () => {
        terminal.dispose();
        fitAddon.dispose();
      };
    }
  }, []);

  // Handle window resize to fit terminal
  useEffect(() => {
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Display compile result
  useEffect(() => {
    if (terminalInstanceRef.current && compileResult) {
      terminalInstanceRef.current.writeln(`Compile result:${compileResult}`);
    }
  }, [compileResult]);

  return <div className="terminal" ref={terminalRef} style={{ height: '100%', width: '100%' }} />;
};

export default CodeTerminal;
