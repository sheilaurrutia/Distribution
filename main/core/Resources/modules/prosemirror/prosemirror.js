import {EditorState} from 'prosemirror-state'
import {MenuBarEditorView} from 'prosemirror-menu'
import {schema as baseSchema} from 'prosemirror-schema-basic'
import {exampleSetup} from 'prosemirror-example-setup/dist/index'
import {DOMParser, Schema} from 'prosemirror-model'
import {addListNodes} from 'prosemirror-schema-list'
import {addTableNodes} from 'prosemirror-schema-table'

import 'prosemirror-menu/style/menu.css'
import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-example-setup/style/style.css'

export class Editor {
  constructor(root) {
    this.root = root
    this.editor = null
  }

  instantiate(content = '') {
    const demoSchema = new Schema({
      nodes: addListNodes(addTableNodes(baseSchema.nodeSpec, 'block+', 'block'), 'paragraph block*', 'block'),
      marks: baseSchema.markSpec
    })

    const tmp = document.createElement('div')
    tmp.innerHTML = content
    content = DOMParser.fromSchema(demoSchema).parse(tmp)

    let state = EditorState.create(
      {
        doc: content,
        plugins: exampleSetup({schema: demoSchema}),
        schema: demoSchema
      }
    )

    return new MenuBarEditorView(this.root, {state})
  }
}
