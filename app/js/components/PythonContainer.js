var pythonRepl = window.require('pypyjs');

var React = require('react');

require('../../css/terminal.css');

// Note this are initiated from the global
// window in index.html
var jqconsole;

var PythonContainer = React.createClass({

  componentWillReceiveProps: function(nextProps) {
    // Retrieve code in editor
    if(nextProps.editorText) {
      this.evaluateCode(nextProps.editorText)
    }
  },

  componentDidMount: function() {
    this.loadLanguage(this.props.language);
  },

  resultOutput: function(value) {
    jqconsole.Write(value, 'jqconsole-output');
  },

  errorCallback: function(value) {
    jqconsole.Write(value, 'jqconsole-error');
  },

  loadLanguage: function(language) {
    var self = this;
    // Override default printing
    pythonRepl.stdout = this.resultOutput;

    pythonRepl.stderr = this.errorCallback;

    jqconsole = $('#console').jqconsole('python \n', '>>>', '...');

    this.registerShortcuts();

    pythonRepl.ready().then(function() {
      return pythonRepl.repl(self.startPrompt);
    }).then(null, function(err) {
      jqconsole.Write('ERROR: ' + err + '- Reload the repl', 'jqconsole-error');
    });
  },

  startPrompt: function(ps1) {
    // The argument is ">>> " or "... " depending on REPL state.
    jqconsole.SetPromptLabel(ps1);
    // Return a promise if prompting for input asynchronously.
    return new Promise(function(resolve, reject) {
      jqconsole.Prompt(true, function (input) {
        resolve(input);
      });
    });
  },

  testCrap: function() {
    var self = this;
    var vm = new pythonRepl()

    vm.stdout = this.resultOutput;
    vm.stderr = this.errorCallback;

    vm.ready().then(function() {
      return vm.repl(self.startPrompt);
    }).then(null, function(err) {
      jqconsole.Write('ERROR: ' + err + '- Reload the repl', 'jqconsole-error');
    });
  },

  registerShortcuts: function() {
    // Ctrl+A: Move terminal to the start.
    jqconsole.RegisterShortcut('A', function() {
      this.MoveToStart();
    });

    // Ctrl+E: Move terminal to the end.
    jqconsole.RegisterShortcut('E', function() {
      this.MoveToEnd();
    });

    // Ctrl+K: Clear terminal.
    jqconsole.RegisterShortcut('K', function() {
      this.Clear();
    });
  },

  evaluateCode: function(code) {
    var self = this;
    jqconsole.AbortPrompt();
    pythonRepl.exec(code).then(function(){
      self.testCrap()
    },function(err) {
      pythonRepl.stderr(err.trace);
      self.testCrap()
    });
  },

  clearTerminal: function() {
    jqconsole.Clear();
  },

  render: function() {

    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header className="mdl-layout__header terminal-header">
          <div className="mdl-layout__header-row">
            <button className="mdl-button mdl-js-button terminal-editor-button" onClick={this.clearTerminal}>
              clear
            </button>
          </div>
        </header>
        <div id="console">
        </div>
        <footer className="mdl-mini-footer mdl-cell mdl-cell--12-col footer">
          <div className="mdl-mini-footer__left-section">
          </div>
        </footer>
      </div>
    )
  }
});

module.exports = PythonContainer;
