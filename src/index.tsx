// single-ts

if (process.env.NODE_ENV === 'development' && ENV_MOCK) {
  // require('../mock/example.js');
}

import React from 'react';
import {render} from 'react-dom';
import './index.less';

import Linked from './linked';

class App extends React.Component {
  render() {
    return (
      <div style={{padding: 20}}>
        <Linked />
      </div>
    )
  }
}

render(
  <App />,
  document.getElementById('root')
);
