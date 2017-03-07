import React, {PropTypes as T} from 'react'

export const SelectionPaper = (props) => {
  return <div>paper</div>
}

SelectionPaper.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired,
    description: T.string.isRequired,
    solutions: T.arrayOf(T.object)
  }).isRequired,
  answer: T.array.isRequired
}

SelectionPaper.defaultProps = {
  answer: []
}
