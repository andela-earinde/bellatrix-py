var ipc = window.require('ipc');

var React = require('react');

//initialize context menu
require('./context_menu').contextMenu();

var GeneralActions = require('./actions/GeneralActions');
var AppStore = require('./stores/AppStore');

var TextEditorContainer = require('./components/TextEditorContainer');
var PythonContainer = require('./components/PythonContainer');
var TerminalContainer = require('./components/TerminalContainer');
var MarkdownContainer = require('./components/MarkdownContainer');

require('../css/style.css');

var Bellatrix = React.createClass({

  getInitialState: function() {
    return  {
      theme: 'twilight',
      language: 'javascript',
      editorText: ''
    }
  },

  changeLanguage: function(language) {
    GeneralActions.loadSavedEditorText(language);
    this.setState({
      language: language
    });
  },

  changeEditorTheme: function(theme) {
    this.setState({
      theme: theme
    });
  },

  componentWillMount: function() {
    /*
    * Register event to change theme and language
    * When component is mounted.
    */
    var self = this;
    ipc.on('change-theme', function(theme) {
      self.changeEditorTheme(theme);
      GeneralActions.saveCurrentState(self.state);
    });

    ipc.on('change-language', function(language) {
      self.changeLanguage(language);
      GeneralActions.saveCurrentState(self.state);
    });

    // Register method for loading saved state
    AppStore.addLoadSavedStateListener(this.loadSavedState);
  },

  componentDidMount: function() {
    // trigger action to load the saved state
    GeneralActions.loadSavedState()
  },

  getEditorText: function(text) {
    this.setState({
      editorText: text
    });
  },

  loadSavedState: function(state) {
    var self = this;
    /**
    * The python repl takes a lot of time to load, so a timeout
    * is set before the state is changed.
    * TODO: Find a better approach for this issue.
    */
    if (state.language === "python") {
      setTimeout(function(){
        self.setState(state)
      }, 500);
    }
    else {
      this.setState(state);
    }
  },

  render: function() {
    var display;
    // If language is markdown display markdown container
    // else display editor
    if (this.state.language === 'markdown') {
      display = (
        <MarkdownContainer
          editorText={this.state.editorText}/>
      );
    }
    else if (this.state.language === 'python') {
      display = (
        <PythonContainer
          editorText={this.state.editorText}
          language={this.state.language}/>
      );
    }
    else {
      display = (
        <TerminalContainer
          language={this.state.language}
          editorText={this.state.editorText}/>
      );
    }
    return (
      <div className="mdl-grid mdl-grid--no-spacing editor-container">
        <div className="mdl-cell mdl-cell--6-col text-editor">
          <TextEditorContainer
            theme={this.state.theme}
            language={this.state.language}
            getEditorText={this.getEditorText}/>
        </div>
        <div className="mdl-cell mdl-cell--6-col terminal">
          {display}
        </div>
      </div>
    );
  }

});

React.render(<Bellatrix />, document.getElementById('bellatrix'));
