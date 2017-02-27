import {EditorState} from 'prosemirror-state'
import {MenuBarEditorView} from 'prosemirror-menu'
import {schema} from 'prosemirror-schema-basic'
import {exampleSetup, buildMenuItems} from 'prosemirror-example-setup/dist/index'
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

  instantiate(content = '', plugins = []) {

    let demoSchema = this.getBaseSchema()

    const selection = {/*
      attrs: {type: {default: "brontosaurus"}},
      draggable: true,
      toDOM: node => ["img", {"dino-type": node.attrs.type,
                              src: "/img/dino/" + node.attrs.type + ".png",
                              title: node.attrs.type,
                              class: "dinosaur"}],
      parseDOM: [{
        tag: "img[dino-type]",
        getAttrs: dom => {
          let type = dom.getAttribute("dino-type")
          if (dinos.indexOf(type) > -1) return {type}
        }
      }],

      inline: true,
      group: "inline"*/
    }

    demoSchema = new Schema({
      nodes: schema.nodeSpec.addBefore("image", "selection", selection),
      marks: schema.markSpec
    })

    const tmp = document.createElement('div')
    tmp.innerHTML = content
    content = DOMParser.fromSchema(demoSchema).parse(tmp)

/*
    let menu = buildMenuItems(demoSchema)
    menu.insertMenu.content = plugins.map(plugin => plugin.getMenuItem()).concat(menu.insertMenu.content)
*/
    let state = EditorState.create(
      {
        doc: content,
        plugins: exampleSetup({schema: demoSchema}).concat(plugins.map(plugin => plugin.getPlugin({schema: demoSchema}))),
        schema: demoSchema
      }
    )

    let menu = buildMenuItems(demoSchema)
    menu.insertMenu.content = plugins.map(plugin => plugin.getMenuItem()).concat(menu.insertMenu.content)
    console.log(menu)

    this.editor = new MenuBarEditorView(this.root, {state, menuContent: menu.fullMenu}).editor
  }

  getBaseSchema() {
    return new Schema({
      nodes: addListNodes(addTableNodes(schema.nodeSpec, 'block+', 'block'), 'paragraph block*', 'block'),
      marks: schema.markSpec
    })
  }

  getEditor() {
    return this.editor
  }
}
