import React, {Component, PropTypes as T} from 'react'
import classes from 'classnames'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import {tex, t} from './../../utils/translate'
import {makeDraggable, makeDroppable} from './../../utils/dragAndDrop'
import shuffle from 'lodash/shuffle'
import _ from 'lodash';

let DropBox = props => {
  return props.connectDropTarget (
     <div className={classes(
       'pair-item-drop-container',
       {'on-hover': props.isOver}
     )}>
       {tex('set_drop_item')}
     </div>
   )
}

DropBox.propTypes = {
  connectDropTarget: T.func.isRequired,
  isOver: T.bool.isRequired,
  onDrop: T.func.isRequired,
  canDrop: T.bool.isRequired,
  object: T.object.isRequired
}

DropBox = makeDroppable(DropBox, 'ITEM')

const PairRow = props =>
  <div className="pair-row">
    <span className="pair-drop-box-left">
      <DropBox object={{x: props.rowId, y: 0}} onDrop={props.onDrop} />
    </span>
    <span className="pair-drop-box-right">
      <DropBox object={{x: props.rowId, y: 1}} onDrop={props.onDrop} />
    </span>
  </div>

const PairRowList = props =>
  <ul>
    {_.times(props.rows, i =>
      <li key={i}>
        <PairRow key={i} rowId={i} onDrop={props.onItemDrop}/>
      </li>
    )}
  </ul>


PairRowList.propTypes = {
  rows: T.number.isRequired,
  //sets: T.arrayOf(T.object).isRequired,
  //answers: T.arrayOf(T.object).isRequired,
  //onAssociationItemRemove: T.func.isRequired,
  onItemDrop: T.func.isRequired
}

let Item = props => {
  return props.connectDragPreview (
    <div className="item">
      <div className="item-content" dangerouslySetInnerHTML={{__html: props.item.data}} />
      <div className="right-controls">
        {props.connectDragSource(
          <div>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`item-${props.item.id}-drag`}>{t('move')}</Tooltip>
              }>
              <span
                draggable="true"
                className={classes(
                  'tooltiped-button',
                  'btn',
                  'fa',
                  'fa-bars',
                  'drag-handle'
                )}
              />
            </OverlayTrigger>
          </div>
        )}
      </div>
    </div>
  )
}

Item.propTypes = {
  connectDragSource: T.func.isRequired,
  connectDragPreview: T.func.isRequired,
  item: T.object.isRequired
}

Item = makeDraggable(Item, 'ITEM')

const ItemList = props =>
  <ul>
    { props.items.map((item) =>
      <li key={item.id}>
        <Item item={item}/>
      </li>
    )}
  </ul>


ItemList.propTypes = {
  items:  T.arrayOf(T.object).isRequired
}

class PairPlayer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      items: this.randomize(props.item.items, props.item.random)
    }
  }

  randomize(items, random) {
    return random ? shuffle(items) : items
  }

  /**
   * handle item drop
   * @var {source} dropped item (item)
   * @var {target} target item (set)
   */
  handleItemDrop(source, target) {
    console.log(source)
    console.log(target)
    //if(undefined === this.props.answer.find(el => el.setId === target.object.id && el.itemId === source.item.id)){
    //  // do something to add to solution
    //  this.props.onChange(
    //      [{itemId: source.item.id, setId: target.object.id, _itemData: source.item.data}].concat(this.props.answer)
    //   )
    //}
  }

  render() {
    return (
      <div className="pair-question-player">
        <div className="items-col">
            <ItemList items={this.state.items} />
        </div>
        <div className="pair-rows-col">
            <PairRowList rows={this.props.item.rows}
                         onItemDrop={(source, target) => this.handleItemDrop(source, target)}
            />
        </div>
      </div>
    )
  }
}

PairPlayer.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    items: T.arrayOf(T.object).isRequired,
    random: T.bool.isRequired,
    rows: T.number.isRequired
  }).isRequired,
  answer: T.arrayOf(T.string),
  onChange: T.func.isRequired
}

PairPlayer.defaultProps = {
  answer: []
}

export {PairPlayer}