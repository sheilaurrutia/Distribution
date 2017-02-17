import {EditorState} from 'prosemirror-state'
import {MenuBarEditorView} from 'prosemirror-menu'
import {schema as baseSchema} from 'prosemirror-schema-basic'
import {exampleSetup} from 'prosemirror-example-setup/dist/index'
import {Schema} from 'prosemirror-model'
import {addListNodes} from 'prosemirror-schema-list'
import {addTableNodes} from 'prosemirror-schema-table'

import 'prosemirror-menu/style/menu.css'
import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-example-setup/style/style.css'

export class Editor {
  constructor(root) {
    this.root = root
  }

  instantiate() {
    const demoSchema = new Schema({
      nodes: addListNodes(addTableNodes(baseSchema.nodeSpec, 'block+', 'block'), 'paragraph block*', 'block'),
      marks: baseSchema.markSpec
    })


    let state = EditorState.create(
      {
        doc: '',
        plugins: exampleSetup({schema: demoSchema}),
        schema: demoSchema
      }
    )

    new MenuBarEditorView(this.root, {state})
  }
}
