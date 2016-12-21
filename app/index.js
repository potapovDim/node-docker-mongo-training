import React from 'react';
import { render } from 'react-dom';


class Counter extends React.Component{
  state = {
    count :1
  }
  render () {
    return (
      <div>
      HELLOOOO!!!!!!!!!!!!
      <button onClick={()=>this.setState({count:this.state.count+1})}>test</button>
      <h1>{this.state.count}</h1>
       <canvas ref="canvas"
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio}
        />
      </div>
    )
  }
}


render(<Counter />, document.getElementById('app'));
