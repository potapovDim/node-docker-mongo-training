import React from 'react'
import 'whatwg-fetch'

export const fetchy = (uri, options) => {
  const query = {
    method: options.method,
    headers: {
      'Content-Type': options.contentType
    }
  }

  options.data && (
    query.body = (options.contentType === 'application/json')
      ? JSON.stringify(options.data)
      : options.data
  )
  if (fetchy.baseUrl) {
    return fetch(fetchy.baseUrl + uri, query).then(res => console.log(res))
  }
  return fetch(uri, query).then(res => console.log(res))
}

fetchy.post = (uri, data) =>
  fetchy(uri, {data, contentType: 'application/json', method: 'POST'})


export class Main extends React.Component{
  state = {
    comment: ''
  }
  postComment = () => {
    console.log('here !!!!!!!!!!!!!!!')
    fetchy.post('http://localhost:3000/publish', JSON.stringify(this.state.comment))
  }

  render () {
    const comments = this.props.comments.map(comment=>{
      <li>comment</li>
    })
    console.log('render')
    return (<div>INITIAL
      <button onClick={this.postComment}>Add comment</button>
        <input style={{width:'100px', height:'20px'}} onChange={ev => {
          this.setState({comment:event.target.value})
        }} placeholder="comment"></input>
        <ul>{
        comments
        }</ul>
      </div>)
  }
}