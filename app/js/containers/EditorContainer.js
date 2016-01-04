import React from 'react'
import ReactDOM from 'react-dom'

import Draggable from 'react-draggable'

import PythonContainer from './PythonContainer'
import TerminalContainer from './TerminalContainer'
import TextEditorContainer from './TextEditorContainer'
import MarkdownContainer from './MarkdownContainer'

import '../../css/style.css'

class EditorContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0
    }
    this.handleDrag = this.handleDrag.bind(this)
  }

  componentDidMount() {
    this.terminalDomNode = ReactDOM.findDOMNode(this.refs.terminal)
    this.editorDomNode = ReactDOM.findDOMNode(this.refs.editor)
  }

  handleDrag(event, ui) {
    this.terminalDomNode.style.width = `${this.terminalDomNode.offsetWidth - ui.deltaX}px`
    this.editorDomNode.style.width = `${this.editorDomNode.offsetWidth + ui.deltaX}px`
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
          editorText={this.props.editorText}
          language={this.props.language}/>
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
        <Draggable
          onDrag={this.handleDrag}
          axis="x">
          <div className="draggable-div"></div>
        </Draggable>
        <div ref="terminal" className="mdl-cell mdl-cell--6-col terminal">
          {display}
        </div>
      </div>
    )
  }
}

export default EditorContainer
