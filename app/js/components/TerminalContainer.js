var React = require('react');

var languageSpec = require('../lang_config/language').languageSpec;

// Note: jqconsole and jsrepl loaded in
// the index.html
var jqconsole,
    jsrepl;

require('../../css/terminal.css');

var TerminalContainer = React.createClass({

  getInitialState: function() {
    return {
      showSpinner: true
    }
  },

  componentWillReceiveProps: function(nextProps) {
    // Check whether the language prop has changed
    // to load the new language
    if (this.props.language !== nextProps.language) {
      $('#console').empty();
      this.toggleSpinner()
      this.loadLanguage(nextProps.language);
    }

    // Retrieve code in editor
    if (nextProps.editorText) {
      this.evaluateCode(nextProps.editorText)
    }
  },

  componentWillMount: function() {

    var inputCallback = function(callback) {
      jqconsole.Input(function(result) {
          callback(result);
      });
    };

    var outputCallback = function(string) {
      jqconsole.Write(string.trimRight() + '\n', 'jqconsole-output');
    };

    var resultCallback = function(string) {
      if (string) {
        jqconsole.Write("=>" + string + '\n', 'jqconsole-output');
      }
    };

    var errorCallback = function(string) {
      jqconsole.Write(string + '\n', 'jqconsole-error');
    };

    var progressCallback = function(m, n) {

    };

    var timeoutCallback = function() {
      this.loadLanguage(this.props.language);
      return true
    };

    jsrepl = new JSREPL({
      input: inputCallback,
      output: outputCallback,
      result: resultCallback,
      error: errorCallback,
      progress: progressCallback,
      timeout: {
        time: 12000,
        callback: timeoutCallback
      }
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

  componentDidMount: function() {
    this.loadLanguage(this.props.language);
  },

  startPrompt: function() {
    // Start the prompt with history enabled.
    var self = this;
    jqconsole.Prompt(true, function (input) {
      // Output input with the class jqconsole-output.
      jsrepl.eval(input)
      // Restart the prompt.
      self.startPrompt();
    }, jsrepl.checkLineEnd, true);
  },

  loadLanguage: function(language) {
    var self = this;
    jsrepl.loadLanguage(language, function () {
      self.toggleSpinner()
      jqconsole = $('#console').jqconsole(languageSpec(language) + '\n', '>>>', '...');
      self.registerShortcuts();
      self.startPrompt();
    });
  },

  evaluateCode: function(code) {
    jqconsole.AbortPrompt();
    jsrepl.eval(code);
    this.startPrompt();
  },

  clearTerminal: function() {
    jqconsole.Clear();
  },

  toggleSpinner: function() {
    if (this.state.showSpinner) {
      this.setState({
        showSpinner: false
      });
      return;
    }
    this.setState({
        showSpinner: true
    });
  },

  render: function() {
    var showSpinner = this.state.showSpinner ? '' : 'none'

    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
        <header className="mdl-layout__header terminal-header">
          <div className="mdl-layout__header-row">
            <button className="mdl-button mdl-js-button terminal-editor-button" onClick={this.clearTerminal}>
              clear
            </button>
          </div>
        </header>
        <div className={"load7"} style={{display: showSpinner}}>
          <div className="loader">Loading...</div>
        </div>
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

module.exports = TerminalContainer;
