import React from 'react'

const Ratings = ({ size, ratings }) => [
  <p className={`mb-1`}>
    <i className='material-icons' style={{ fontSize: getSize(size), color: getColor(1, ratings) }}>star</i>
    <i className='material-icons' style={{ fontSize: getSize(size), color: getColor(2, ratings) }}>star</i>
    <i className='material-icons' style={{ fontSize: getSize(size), color: getColor(3, ratings) }}>star</i>
    <i className='material-icons' style={{ fontSize: getSize(size), color: getColor(4, ratings) }}>star</i>
    <i className='material-icons' style={{ fontSize: getSize(size), color: getColor(5, ratings) }}>star</i>
  </p>
]

const getSize = size =>
    size === 'small'
    ? '1rem'
    : '2rem'

const getColor = (key, ratings) => {
  if(ratings >= key){
    return '#ffbf00'
  }
  else {
    return '#a2a2a2'
  }
}



export default Ratings
