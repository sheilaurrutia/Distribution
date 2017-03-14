let _url = new WeakMap()
let _$resource = new WeakMap()

export default class BibliographyController {



  constructor(url, $resource) {
    _url.set(this, url)
    _$resource.set(this, $resource)

    this.bookReference = {}
    this.searchResults = null
    this.searchFromApi = false
    this.enterDataManually = false
  }

  search() {
    this.searchFromApi = true
    this.searchResults = null

    const url = _url.get(this)('icap_bibliography_api_book_searchbook_search', {
      workspace: 2,
      query: this.bookReference.isbn || this.bookReference.title || this.bookReference.author,
      index: this.bookReference.isbn ? 'isbn' : this.bookReference.title ? 'title' : this.bookReference.author ? 'author' : ''
    })

    let Search = _$resource.get(this)(url)
    let search = Search.get(() => {
      this.searchResults = search.data
    })
  }

  enterData() {
    this.enterDataManually = true
  }

  selectBook(book) {
    this.bookReference = book
    this.searchFromApi = false
    this.enterDataManually = true
    this.searchResults = null
  }
  
  cancel() {
    this.searchFromApi = this.enterDataManually = false
  }

}

BibliographyController.$inject = [
  'url',
  '$resource'
]
