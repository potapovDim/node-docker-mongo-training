import React from 'react';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import {Main} from './'

export default (
  <Router history={browserHistory}>
      <Route path="/" component={Main}>
      </Route>
  </Router>
)




