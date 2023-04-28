import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_host from '../../backend-host';

function Receipt() {

    let address = window.localStorage.getItem('address')
    const [cartData, setCartData] = useState([])

    const [total, setTotal] = useState()
    
    
  useEffect(() => {

    async function getCartData () {

      const resp = await axios.post(`${backend_host}api/getcart`, {
        userID: parseInt(window.localStorage.getItem('userid'))
      })
      .catch(function (error) {
       console.log(error);
       })
       
      let data = resp.data.cookies;
      let returnArray = [];
      let tmpArr = [];
      let tmpTotal = 0;

      for ( let i = 0; i < data.length; i++ )
      {

        const cookieData = await axios.get(`${backend_host}api/cookieinfo/:${data[i].cookieID}`, {
        })
        .catch(function (error) {
          console.log(error);
        })

         let parsedCookieData = cookieData.data;

        tmpArr = [parsedCookieData.name, parsedCookieData.price, data[i].quantity, parsedCookieData.imagepath];
        tmpTotal = tmpTotal + (data[i].quantity * parsedCookieData.price);
        returnArray.push(tmpArr);

        tmpArr = [];
        
      }
      setTotal(tmpTotal);
      setCartData(returnArray);


      const checkoutResp = await axios.post(`${backend_host}api/checkout`, {
        userID: parseInt(window.localStorage.getItem('userid')),
        address: address
      })
      .catch(function (error) {
        console.log(error);
          })
      
    }

    getCartData();

  }, []);



  if (!cartData.length) {
    return (<div> <h1 style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "75vh",
      }}> Please wait for cart data.. < br />  (if this page doesn't load, you likely don't have any items in your cart.) <br/> <br/> </h1> </div>) 

  }


    return (
      <div>
        <h1> <br /> <br /> Thank you for your order to {address}! Expect delivery in a few days. (be ready to pay at delivery) <br /> <br /> Order list: </h1>

        {(cartData).map( (cartEntry) =>  <div> <h1> Cookie type: {cartEntry[0]} ({cartEntry[2]}) @ ${cartEntry[1]} each </h1> {} </div> )}



        <h2  style={{
          position: "absolute",
          top: "10%",
          right: "15%",
          height: "8vh"}}> Total order cost: ${total} </h2>
    </div>
    );
}

export default Receipt;

