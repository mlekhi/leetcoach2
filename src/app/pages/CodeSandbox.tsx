import React, { useState } from 'react';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript'; // Import JS mode

const CodeEditor = () => {
  const [code, setCode] = useState('// Write your code here...');

  const handleEditorChange = (value: string) => {
    setCode(value);
  };

  return (
    <div className="code-editor">
      <ControlledEditor
        value={code}
        onBeforeChange={handleEditorChange}
        options={{
          lineWrapping: true,
          lint: true,
          mode: 'javascript',
          theme: 'material',
          lineNumbers: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;