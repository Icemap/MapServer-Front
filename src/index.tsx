import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Parent from './page/parent/Parent';
import 'leaflet/dist/leaflet.css';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Parent />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
