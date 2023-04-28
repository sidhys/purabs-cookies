import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import backend_host from './backend-host';
import axios from 'axios';

console.log(`${backend_host}api/registeruser`)
if (localStorage.getItem("userid") === null) {
  axios.post(`${backend_host}api/registeruser`)
  .then(function (response) {
    localStorage.setItem("userid", response.data)
    console.log("Assigned user id: " +  response.data);
  })
  .catch(function (error) {
    console.log(error);
  })
}


ReactDOM.render(<App />, document.getElementById('root')); 