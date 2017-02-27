export class CursorSelection {
  constructor(root) {
    this.root = root
  }

  getOffsets() {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)

    //loop in order to get the real first offset element
    console.log(this.root)
    console.log(range)
  }
}
