var ipc = window.require('ipc');

import React from 'react'

//initialize context menu
import { contextMenu } from './context_menu'

import GeneralActions from './actions/GeneralActions'
import AppStore from './stores/AppStore'

import TextEditorContainer from './containers/TextEditorContainer'
import PythonContainer from './containers/PythonContainer'
import TerminalContainer from './containers/TerminalContainer'
import MarkdownContainer from './containers/MarkdownContainer'

import '../css/style.css'

class Bellatrix extends React.Component {

  constructor() {
    super();
    this.state = {
      theme: 'twilight',
      language: 'javascript',
      editorText: ''
    }
  }

  changeLanguage(language) {
    GeneralActions.loadSavedEditorText(language);
    this.setState({
      language: language
    });
  }

  changeEditorTheme(theme) {
    this.setState({
      theme: theme
    });
  }

  componentWillMount() {
    /*
    * Register event to change theme and language
    * When component is mounted.
    */

    //initialize context menu
    contextMenu()

    ipc.on('change-theme', (theme) => {
      this.changeEditorTheme(theme);
      GeneralActions.saveCurrentState(this.state);
    });

    ipc.on('change-language', (language) => {
      this.changeLanguage(language);
      GeneralActions.saveCurrentState(this.state);
    });

    // Register method for loading saved state
    AppStore.addLoadSavedStateListener(this.loadSavedState.bind(this));
  }

  componentDidMount() {
    // trigger action to load the saved state
    GeneralActions.loadSavedState()
  }

  getEditorText(text) {
    this.setState({
      editorText: text
    });
  }

  loadSavedState(state) {
    /**
    * The python repl takes a lot of time to load, so a timeout
    * is set before the state is changed.
    * TODO: Find a better approach for this issue.
    */
    if (state.language === "python") {
      setTimeout(() => {
        this.setState(state)
      }, 500);
    }
    else {
      this.setState(state);
    }
  }

  render() {
    var display;
    // If language is markdown display markdown container
    // else display editor
    if (this.state.language === 'markdown') {
      display = (
        <MarkdownContainer
          editorText={this.state.editorText}/>
      );
    } else if (this.state.language === 'python') {
      display = (
        <PythonContainer
          editorText={this.state.editorText}
          language={this.state.language}/>
      );
    } else {
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

}

React.render(<Bellatrix />, document.getElementById('bellatrix'));
