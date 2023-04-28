import React, { useState, useEffect } from 'react';
import './Cards.css';
import CardItem from './CardItem';
import axios from 'axios';

import backend_host from '../backend-host';

async function getElements () {
 
  let returnArr = [];

  const response = await axios.get(`${backend_host}api/getlastcookieindex`, {
  })
  .catch(function (error) {
    console.log(error);
  })

  let elements = parseInt(response.data);

  for ( let i = 0; i < elements; i++ ) { 

    let tmpArr = [];

    const second_response = await axios.get(`${backend_host}api/cookieinfo/:${i + 1}`, {
    })
  
    .catch(function (error) {
      console.log(error);
    })

    let parsed = second_response.data;

    if (parsed.currentlyPopular) {

      tmpArr.push(parsed.imagepath); 
      tmpArr.push(parsed.name);
      tmpArr.push("cookies/" + parsed.cookieID); 
  
      returnArr.push(tmpArr);
      tmpArr = [];
    }
  
  }

  return await returnArr;

}


function PopularCards() {


  const [data, setData] = useState([]);

  useEffect(() => {

    async function updateDataState () {
      
    let _data = await getElements();
    
    setData(_data);

    }

  updateDataState();

  }, []);

  if (!data.length) {
    return (<div> <h1 style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "75vh",
      }}> Please wait for cookie metadata.. <br/> <br/> </h1> </div>) 

  }
    return (
    
      <div className='cards'>
          <h1> Popular Cookies </h1>
        <div className='cards__container'>
          <div className='cards__wrapper'>
              <ul className='cards__items' style={{ flexDirection: 'row' }}>

              
           {(data).map( (cookie) => <CardItem src={cookie[0]} text={cookie[1]} path={cookie[2]}/>) }
            </ul>
          </div>
        </div>
      </div>
    );

}


export default PopularCards;
  