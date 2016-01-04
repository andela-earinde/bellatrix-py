var pythonRepl = window.require('pypyjs');

import React from 'react'

import TerminalComponent from '../components/TerminalComponent'


class PythonContainer extends React.Component {

  constructor(props) {
    super(props)
    this.jqconsole
    this.vm
  }

  componentWillReceiveProps(nextProps) {
    // Retrieve code in editor
    if(nextProps.editorText) {
      this.evaluateCode(nextProps.editorText)
    }
  }

  componentDidMount() {
    this.loadLanguage(this.props.language);
  }

  resultOutput(value) {
    this.jqconsole.Write(`=> ${value}`, 'jqconsole-output');
  }

  errorCallback(value) {
    this.jqconsole.Write(value, 'jqconsole-error');
  }

  loadLanguage(language) {
    const version = `Python 2.7.9 (default, Jul 03 2015, 17:08:29)\n[PyPy 2.6.0]\n`

    this.jqconsole = $('#console').jqconsole(version, '>>>', '...');

    this.registerShortcuts();

    this.startRepl()
  }

  startPrompt(ps1) {
    // The argument is ">>> " or "... " depending on REPL state.
    this.jqconsole.SetPromptLabel(ps1);
    // Return a promise if prompting for input asynchronously.
    return new Promise((resolve, reject) => {
      this.jqconsole.Prompt(true, (input) => {
        resolve(input);
      });
    });
  }

  startRepl() {
    this.vm = new pythonRepl()

    // Override default printing
    this.vm.stdout = this.resultOutput.bind(this);
    this.vm.stderr = this.errorCallback.bind(this);

    this.vm.ready().then(() => {
      return this.vm.repl(this.startPrompt.bind(this));
    }).then(null, (err) => {
      this.jqconsole.Write(`ERROR: ${err} - Reload the repl`, 'jqconsole-error');
    });
  }

  registerShortcuts() {
    // Ctrl+A: Move terminal to the start.
    this.jqconsole.RegisterShortcut('A', () => this.MoveToStart())

    // Ctrl+E: Move terminal to the end.
    this.jqconsole.RegisterShortcut('E', () => this.MoveToEnd())

    // Ctrl+K: Clear terminal.
    this.jqconsole.RegisterShortcut('K', () => this.Clear())
  }

  evaluateCode(code) {
    this.jqconsole.AbortPrompt();
    this.vm.exec(code).then(() => {
      this.startRepl()
    },(err) => {
      this.vm.stderr(err.trace);
      this.startRepl()
    });
  }

  clearTerminal() {
    this.jqconsole.Clear();
  }

  render() {
    return (
      <TerminalComponent
        clearTerminal={this.clearTerminal.bind(this)}/>
    )
  }
}

export default PythonContainer
