import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Share from './Share';
import Stats from './Stats';

const path = window.location.pathname;
const isShare = path.startsWith('/share/');
const isStats = path === '/stats';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(isShare ? <Share /> : isStats ? <Stats /> : <App />);
