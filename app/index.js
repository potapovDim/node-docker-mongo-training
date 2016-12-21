import React from 'react';
import {render} from 'react-dom';
import {MoveExample} from './move'


const KEY = {
  LEFT:  37,
  RIGHT: 39,
  UP: 38,
  A: 65,
  D: 68,
  W: 87,
  SPACE: 32
};




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


render(<MoveExample />, document.getElementById('app'));
