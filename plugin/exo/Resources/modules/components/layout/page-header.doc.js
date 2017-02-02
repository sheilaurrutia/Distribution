import React from 'react'
import PageHeader from './page-header.jsx'
import PageActions from './page-actions.jsx'

export default class extends React.Component {
  static displayName = 'PageHeader'

  static styleguide = {
    category: 'Page',
    index: '1.1',
    title: 'Page header',
    description: 'A component that renders a header for a page.',
    code: `
<PageHeader
  title="An awesome title"
  subtitle="and it's little bro subtitle"
>
  <PageActions actions={[{
    label: 'An action',
    primary: true,
    handleAction: () => alert('This is an action')
  }]} />
</PageHeader>
    `,
    props: {
      title: 'An awesome title'
    }
  }

  static propTypes = {
    /**
     * The page title.
     */
    title: React.PropTypes.node.isRequired,
    /**
     * An optional subtitle.
     */
    subtitle: React.PropTypes.string,
    /**
     * Some custom child components.
     */
    children: React.PropTypes.node
  }

  static defaultProps = {
    subtitle: null,
    children: []
  }

  render() {
    return (
      <PageHeader
        title="An awesome title"
        subtitle="and it's little bro subtitle"
      >
        <PageActions actions={[{
          label: 'An action',
          primary: true,
          handleAction: () => alert('This is an action')
        }]} />
      </PageHeader>
    )
  }
}
