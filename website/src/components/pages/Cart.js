import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backend_host from '../../backend-host';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Cart() {


  const [cartData, setCartData] = useState([])
  const [address, setAddress] = useState()

  function removeCartItem( cookieID ) {
  

    const resp = axios.post(`${backend_host}api/removeitemfromcart`, {
      userID: parseInt(window.localStorage.getItem('userid')),
      itemID: cookieID
    }).catch(function (error) {
      console.log(error);
      })

  }

  function completeCheckout() {
    localStorage.setItem("address", address);
    window.location.href='/receipt';
  }

  useEffect(() => { 

    async function getCartData () {
      
      await sleep(2000);

      const resp = await axios.post(`${backend_host}api/getcart`, {
        userID: parseInt(window.localStorage.getItem('userid'))
      })
      .catch(function (error) {
       console.log(error);
       })
       
      let data = resp.data.cookies;
      let returnArray = [];
      let tmpArr = [];

      for ( let i = 0; i < data.length; i++ )
      {

        const cookieData = await axios.get(`${backend_host}api/cookieinfo/:${data[i].cookieID}`, {
        })
        .catch(function (error) {
          console.log(error);
        })



         let parsedCookieData = cookieData.data;

        tmpArr = [parsedCookieData.name, parsedCookieData.price, data[i].quantity, parsedCookieData.imagepath, parsedCookieData.cookieID];

        returnArray.push(tmpArr);

        tmpArr = [];
        
      }

      await setCartData(returnArray);

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
      

    
    <div className="product-wrapper">
      
    <input
        type="text"
        id="price"
        name="price"
        value={address}
        placeholder="Enter Address"
        onChange={(event) =>
          setAddress(event.target.value)
        }
        style={{
          position: "absolute",
          top: "8%",
          right: "15%",
          height: "6vh"}} />

    <button onClick={() => completeCheckout()} style={{
                position: "absolute",
                top: "8%",
                right: "10%",
                height: "6vh"}}>
                  Check Out </button> 


     {(cartData).map( (cartEntry) => 
    <div className="details" >
      <div className="cookiePageImage"> 
        <img src={`${window.location.protocol}//${window.location.host}/${cartEntry[3]}`} alt="cookie image" />
      </div>
      <div className="box">
        <div className="row"> 
          <h2>{cartEntry[0]}</h2>
          <span>${cartEntry[1] * cartEntry[2]} (${cartEntry[1]} each)</span>
        </div>
        <p> Quantity: {cartEntry[2]} </p>
          
        <button onClick={() => { removeCartItem(cartEntry[4]) }} style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "5vh",}}>
            Remove item(s) from cart</button> 

        <br / >     <br / >     <br / >     <br / >
          
      </div>
    </div>

      )}
    </div>
    </div>
    );
}

export default Cart;

