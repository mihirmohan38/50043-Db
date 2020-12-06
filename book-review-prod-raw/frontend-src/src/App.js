import React from 'react';
import Main from './components/main'
import './App.scss';
import Header from './components/header';

function App() {
  return (
    <div className="container-fluid">
      <Header />
      <Main />
    </div>
  );
}

export default App;
