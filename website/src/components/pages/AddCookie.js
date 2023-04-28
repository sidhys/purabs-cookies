import { useState } from 'react';
import axios from 'axios';
import backend_host from '../../backend-host';

 /* 
        cookieID: number
        ingredients: string
        name: string
        imagePath: string
        price: Number
        currentyPopular: boolean
    */


export default function AddCookie() {
  const [cookieId, setCookieId] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [name, setName] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [price, setPrice] = useState('');
  const [currentyPopular, setCurrentyPopular] = useState('');
  let currentlyPopularBool = false;
  if (currentyPopular == "true")
      currentlyPopularBool = true;
  let parsedCookieId = parseInt(cookieId);
  let parsedPrice = parseInt(price);

  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

        axios.post(`${backend_host}api/addcookie`, {
          cookieID: parsedCookieId,
          ingredients: ingredients,
          name: name,
          imagePath: imagePath,
          price: parsedPrice,
          currentyPopular: currentlyPopularBool
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
        id="cookieId"
        name="cookieId"
        value={cookieId}
        placeholder="cookieId"
        onChange={(event) =>
          setCookieId(event.target.value)
        }
      />

      <br />
      <br />
    
      <input
        type="text"
        id="ingredients"
        name="ingredients"
        value={ingredients}
        placeholder="ingredients"
        onChange={(event) =>
          setIngredients(event.target.value)
        }
      />

      <br />
      <br />
      <input
        type="text"
        id="name"
        name="name"
        value={name}
        placeholder="name"
        onChange={(event) =>
          setName(event.target.value)
        }
      />

      <br />
      <br />
    
      <input
        type="text"
        id="price"
        name="price"
        value={price}
        placeholder="price"
        onChange={(event) =>
          setPrice(event.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        id="imagePath"
        name="imagePath"
        value={imagePath}
        placeholder="imagePath"
        onChange={(event) =>
          setImagePath(event.target.value)
        }
      />

      <br />
      <br />
    
      <input
        type="text"
        id="currentyPopular"
        name="currentyPopular"
        value={currentyPopular}
        placeholder="currentyPopular"
        onChange={(event) =>
          setCurrentyPopular(event.target.value)
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