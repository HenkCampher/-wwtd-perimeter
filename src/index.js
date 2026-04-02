import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Share from './Share';
import Stats from './Stats';
import Landing from './Landing';

const path = window.location.pathname;
const isShare = path.startsWith('/share/');
const isStats = path === '/stats';
const isLanding = window.location.hostname === 'whatwouldtequilado.com' || window.location.hostname === 'www.whatwouldtequilado.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(isShare ? <Share /> : isStats ? <Stats /> : isLanding ? <Landing /> : <App />);
