import { useState } from 'react';
import axios from 'axios';
import backend_host from '../../backend-host';

export default function Log() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

        axios.post(`${backend_host}api/log`, {
            password: password
        })
        .then(function (response) {
            setMessage(`${response.data}`)
        })
        .catch(function (error) {
          console.log(error);
        })
      
  };

  return (
    
    <form onSubmit={handleSubmit}>
      <br />
      <input
        type="text"
        id="password"
        name="password"
        value={password}
        placeholder="Password"
        onChange={(event) =>
          setPassword(event.target.value)
        }
      />

      <br />
      <br />

      <button type="submit">Submit</button>

      <br />
      <br />

      <h2>{message}</h2>
    </form>
  );
}