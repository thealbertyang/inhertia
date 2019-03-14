import React from 'react'
import * as _ from 'lodash'

const Avatar = ({ src, size, className }) =>
  <img src={getSrc(src)} className={`rounded-circle avatar ${className}`} alt="..." style={{ width: getSize(size), height: getSize(size) }}/>

const getSrc = src =>
  typeof src !== 'undefined' && !_.isEmpty(src)
  ? src
  : '/img/admin/avatar.jpg'

const getSize = size => {
    switch(size){
      case 'small':
        return '2rem'
        break
      case 'medium':
        return '3rem'
        break
      case 'large':
        return '4rem'
        break
      default:
        return '2rem'
        break
    }
}


export default Avatar
