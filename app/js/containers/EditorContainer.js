import React from 'react'
import ReactDOM from 'react-dom'

import TextEditorContainer from './TextEditorContainer'
import PythonContainer from './PythonContainer'
import TerminalContainer from './TerminalContainer'
import MarkdownContainer from './MarkdownContainer'

import DraggableDiv from '../components/DraggableDiv'

import '../../css/style.css'

class EditorContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    }
  }

  componentDidMount() {
    this.terminalDomNode = ReactDOM.findDOMNode(this.refs.terminal)
    this.editorDomNode = ReactDOM.findDOMNode(this.refs.editor)
  }

  render() {
    let display;
    // If language is markdown display markdown container
    // else display editor
    if (this.props.language === 'markdown') {
      display = (
        <MarkdownContainer
          editorText={this.props.editorText}/>
      );
    } else if (this.props.language === 'python') {
      display = (
        <PythonContainer
            language={this.props.language}
            editorText={this.props.editorText}/>
      );
    } else {
        display = (
          <TerminalContainer
            language={this.props.language}
            editorText={this.props.editorText}/>
        );
    }

    return (
      <div className="mdl-grid mdl-grid--no-spacing editor-container">
        <div ref="editor" className="mdl-cell mdl-cell--6-col text-editor">
          <TextEditorContainer
            theme={this.props.theme}
            language={this.props.language}
            getEditorText={this.props.getEditorText}/>
        </div>
        <DraggableDiv />
        <div ref="terminal" className="mdl-cell mdl-cell--6-col terminal">
          {display}
        </div>
      </div>
    );
  }
}

export default EditorContainer
