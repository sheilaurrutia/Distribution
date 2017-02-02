import React from 'react'
import PageActions from './page-actions.jsx'

export default class extends React.Component {
  static displayName = 'PageActions'

  static styleguide = {
    category: 'Page',
    index: '1.2',
    title: 'Page actions',
    description: 'A component that renders actions for a page.',
    exampleComponent: PageActions,
    examples: [
      {
        tabTitle: 'Basic',
        props: {
          actions: [{
            label: 'An action',
            primary: true,
            handleAction: () => alert('This is an action')
          }, {
            label: 'Another action',
            primary: true,
            handleAction: () => alert('This is another action')
          }]
        },
        code: `
<PageActions
  actions={[
    {
      label: 'An action',
      primary: true,
      handleAction: () => alert('This is an action')
    }, {
      label: 'Another action',
      primary: true,
      handleAction: () => alert('This is another action')
    }
  ]}
/>
    `
      }, {
        tabTitle: 'More actions',
        props: {
          actions: [{
            label: 'An action',
            primary: true,
            handleAction: () => alert('This is an action')
          }, {
            label: 'Another action',
            handleAction: () => alert('This is another action')
          }, {
            label: 'And one more',
            handleAction: () => alert('This is an action too')
          }]
        }
      }, {
        tabTitle: 'Actions groups',
        props: {
          actions: [{
            label: 'An action',
            primary: true,
            handleAction: () => alert('This is an action')
          }, {
            label: 'Another action',
            primary: true,
            handleAction: () => alert('This is another action')
          }, {
            primary: true,
            divider: true
          }, {
            label: 'Other group action',
            primary: true,
            handleAction: () => alert('This is an action too')
          }]
        }
      }
    ]
  }

  static propTypes = {
    /**
     * The list of page actions
     */
    actions: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        icon: React.PropTypes.string,
        badge: React.PropTypes.node,
        label: React.PropTypes.string,
        primary: React.PropTypes.bool,
        divider: React.PropTypes.bool,
        handleAction: React.PropTypes.func
      })
    ).isRequired
  }
}
