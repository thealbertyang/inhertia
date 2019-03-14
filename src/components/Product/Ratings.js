import React from 'react'

const Ratings = ({ size, rating }) => [
  <p className={`mb-1`}>
    <i className='material-icons' style={{ fontSize: getSize(size), color: '#ffbf00' }}>star</i>
    <i className='material-icons' style={{ fontSize: getSize(size), color: '#ffbf00' }}>star</i>
    <i className='material-icons' style={{ fontSize: getSize(size), color: '#ffbf00' }}>star</i>
    <i className='material-icons' style={{ fontSize: getSize(size), color: '#ffbf00' }}>star</i>
    <i className='material-icons' style={{ fontSize: getSize(size), color: '#ffbf00' }}>star</i>
  </p>
]

const getSize = size =>
    size === 'small'
    ? '1rem'
    : '2rem'

const getRating = rating =>
    size === 'small'
    ? '1rem'
    : '2rem'



export default Ratings
