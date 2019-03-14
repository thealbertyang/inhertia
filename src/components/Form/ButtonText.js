import React from 'react'

export default class Button extends React.Component {
  constructor(props){
    super(props)
  }

  getUrl = () => {
    return (
      typeof this.props.url !== undefined && this.props.url
      ? this.props.url
      : '#'
    )
  }

  render() {
		let { props } = this

    let url = this.getUrl(props.url)
    return [
      <a href={url} className={`btn btn-outline-primary d-flex align-items-center justify-content-center ${props.className}`}>
        {this.props.children}
      </a>
    ]
  }
}
