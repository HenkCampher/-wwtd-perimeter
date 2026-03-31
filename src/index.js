import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Share from './Share';

const isShare = window.location.pathname.startsWith('/share/');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(isShare ? <Share /> : <App />);
