'use strict'

import {Component}      from 'react'
import {Link}           from 'react-router'
import DocumentTitle    from 'react-document-title'
import marked           from 'marked'

import docs             from '../../docs.json'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

class CommonPage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      currentPage: null,
      nextPage: null,
      imageLoading: false
    }

    this.initHighlighting = this.initHighlighting.bind(this)
    this.getPageName = this.getPageName.bind(this)
    this.setPage = this.setPage.bind(this)
    this.filterMarkup = this.filterMarkup.bind(this)
    this.onImageLoad = this.onImageLoad.bind(this)
  }

  initHighlighting() {
    const blocks = document.querySelectorAll('pre code')
    Array.prototype.forEach.call(blocks, hljs.highlightBlock)
  }

  componentWillMount() {
    this.setPage(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      imageLoading: true
    })
    if (this.props !== nextProps) {
      this.setPage(nextProps)
    }
  }

  componentDidUpdate() {
    this.initHighlighting()
  }

  getPageName(props) {
    let pageName = '404'
    if (props.route.path === '/about') {
      pageName = 'about'
    } else if (props.routeParams.hasOwnProperty('docSection')) {
      if (docs.hasOwnProperty(props.routeParams.docSection)) {
        pageName = props.routeParams.docSection
      }
    }
    return pageName
  }

  filterMarkup(markup) {
    return markup.replace('<a href="', '<a target="_blank" href="')
  }

  setPage(props) {
    let pageName = this.getPageName(props)
    let currentPage = Object.assign({}, docs[pageName], {
      pageName: pageName,
      markup: marked(docs[pageName].markdown)
    })

    let nextPage = null
    if (currentPage.hasOwnProperty('next')) {
      nextPage = Object.assign({}, docs[currentPage.next], {
        pageName: currentPage.next
      })
    }

    this.setState({
      currentPage: currentPage,
      nextPage: nextPage
    })
  }

  onImageLoad() {
    this.setState({
      imageLoading: false
    })
  }

  render() {
    const currentPage = this.state.currentPage,
          title = currentPage ? currentPage.title : 'Docs'
    const pathPrefix = '/' + location.pathname.split('/')[1]
    const githubFileUrlRoot = 'https://github.com/blockstack/blockstack-site/blob/master/app/docs'

    return (
      <DocumentTitle title={title}>
        <div>
          <div className="m-b-3 docs-header-image-wrapper">
            
          </div>
          <section className="m-b-5 m-t-5">
            <div className="container p-b-5 col-centered blog-post">
              <div className="container">
                <h1>{currentPage.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: currentPage.markup }}>
                </div>
                <div className="m-t-4">
                  <Link to={githubFileUrlRoot + pathPrefix + '/' + currentPage.pageName + '.md'}
                    role="button" target="_blank"
                    className="btn btn-sm btn-outline-primary m-b-2">
                    Edit this post on GitHub
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DocumentTitle>
    )
  }
}

export default CommonPage