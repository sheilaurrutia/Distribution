
const {EditorState, Plugin, TextSelection} = require("prosemirror-state")
const {Decoration, DecorationSet} = require("prosemirror-view")
const {MenuBarEditorView, MenuItem} = require("prosemirror-menu")
const {DOMParser} = require("prosemirror-model")
const {schema} = require("prosemirror-schema-basic")
const {exampleSetup, buildMenuItems} = require("prosemirror-example-setup")
const crel = require("crel")
const {InputRule, inputRules} = require("prosemirror-inputrules")
const {insertPoint} = require("prosemirror-transform")

//I'm an almighty wizzard
export class HighlithPlugin {
  constructor(el = 'span', className = 'well', onEvent = {id: '#', event: 'click'}, selections = []) {
    this.el = el
    this.className = className
    this.decoForProb = this.decoForProb.bind(this)
    this.onEvent = onEvent
    this.selections = selections
  }

  getPlugin (options) {
    return new Plugin({
      state: {
        init: () => ({prob: null, deco: DecorationSet.empty}),
        apply: (tr, prev, state) => {
          console.log(tr, prev, state)
          /*
          let show = tr.getMeta(showProbPlugin)
          if (show !== undefined)
            return {prob: show, deco: show ? this.decoForProb(state.doc, show) : DecorationSet.empty}
          if (tr.docChanged)
            return {prob: prev.prob, deco: prev.deco.map(tr.mapping, tr.doc)}
          return prev*/
        }
      },

      props: {
        floatingMenu: true,
        menuContent: buildMenuItems(options.schema).fullMenu/*,
        decorations(state) {
          return this.getState(state).deco
        }*/
      }
    })
  }

  getMenuItem() {
    return new MenuItem({
      title: "Insert selection",
      label: "Insert selection",
      select(state) {
        //return insertPoint(state.doc, state.selection.from, dinoType) != null
      },
      run(state, dispatch) {alert('run for your lives !!!!') }
    })
  }

  decoForProb(doc, prob) {
    let decos = [Decoration.widget(prob.from, crel(this.el, {class: this.class}))]

    return DecorationSet.create(doc, decos)
  }
}
