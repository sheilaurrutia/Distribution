import React, { Component, PropTypes as T } from 'react'
import { DragLayer } from 'react-dnd'

const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  color: 'black'
}

function getItemStyles(props) {
  const { currentOffset } = props
  if (!currentOffset) {
    return {
      display: 'none'
    }
  }

  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  return {
    transform: transform,
    WebkitTransform: transform,
    backgroundColor: '#aaa',
    textAlign: 'center',
    width: '100px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    borderRadius: '5px'
  }
}

class CustomDragLayerComponent extends Component{
  renderItem(type, item) {
    switch (type) {
      case 'ITEM':
        return (
        item.item.data ?
          <div dangerouslySetInnerHTML={{__html: item.item.data}}></div>
          :
          <div>DRAGGING</div>
      )
      case 'THUMBNAIL':
        return (
        <div>{item.title}</div>
      )
      case 'ORDERING_ITEM':
        return (
          item.data ?
          <div dangerouslySetInnerHTML={{__html: item.data}}></div>
          :
          <div>DRAGGING</div>
      )
      case 'STEP_ITEM':
        return(
          item.title ?
            <div>{item.title}</div>
            :
            <div>DRAGGING</div>
        )
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props
    if (!isDragging) {
      return null
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    )
  }
}

CustomDragLayerComponent.propTypes = {
  item: T.object,
  itemType: T.string,
  currentOffset: T.shape({
    x: T.number.isRequired,
    y: T.number.isRequired
  }),
  isDragging: T.bool.isRequired
}

function collect(monitor) {
  return {
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }
}

const CustomDragLayer = DragLayer(collect)(CustomDragLayerComponent)

export {CustomDragLayer}
