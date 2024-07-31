// src/components/Editor.js
import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000');

const CodeEditor = ({ onCompileResult }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const handleCodeChange = (newCode) => {
      console.log('Code change received from server:', newCode);
      const model = editorRef.current.getModel();
      if (model && model.getValue() !== newCode) {
        model.setValue(newCode);
      }
    };

    socket.on('code-change', handleCodeChange);

    return () => {
      socket.off('code-change', handleCodeChange);
    };
  }, []);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      const code = editor.getValue();
      console.log('Code change emitted to server:', code);
      socket.emit('code-change', code);
    });
  };

  const handleCompile = async () => {
    const code = editorRef.current.getValue();
    try {
      const response = await axios.post('http://localhost:4000/compile', {
        code,
        language: 71, // Correct ID for Python 3
      });
      console.log('Compile result:', response.data);
      socket.emit('compile-result', response.data); // Emit the compile result
      onCompileResult(response.data.stdout || response.data.stderr);
    } catch (error) {
      console.error('Error during compilation:', error);
      onCompileResult('Error during compilation.');
    }
  };

  return (
    <div className="editor">
      <Editor
        height="70vh"
        defaultLanguage="python"
        defaultValue="# Start coding"
        onMount={handleEditorDidMount}
        theme="vs-dark" // Set the editor theme to vs-dark
      />
      <button onClick={handleCompile} className="button">
        Compile
      </button>
    </div>
  );
};

export default CodeEditor;
