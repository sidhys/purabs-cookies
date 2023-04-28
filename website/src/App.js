import React, { useState, useEffect } from "react";
import Navbar from './components/Navbar';
import './App.css';
import Home from './components/pages/Home';
import { Link, useNavigate  , BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Menu from './components/pages/Menu';
import Log from './components/pages/Log';
import AddCookie from './components/pages/AddCookie'
import Favicon from 'react-favicon'
import axios from 'axios';
import Cart from './components/pages/Cart'
import Receipt from './components/pages/Receipt'
import backend_host from "./backend-host";

function PageNotFound() {
  return (
    <div>
      <h1 style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "75vh",
      }}> 404: PAGE NOT FOUND! </h1>
    </div>
  );
}



const CookiePage = ({match}) => {

  const {
    params: { cookieID },
  } = match;
  
  const [isLoading, setIsLoading] = useState(true);
  const [cookiePageData, setCookiePageData] = useState();

  const [quantity, setQuantity] = useState(0);


  function returnToCart() {

    window.location.href='/cart';
  }

  async function addToCart( cookieID ) {

    const _userid = localStorage.getItem('userid');
    const userid = parseInt(_userid);

    const resp =  await axios.post(`${backend_host}api/additemtocart`, {
      userID: userid,
      itemID: parseInt(cookieID), 
      quantity: quantity
    })

    .catch(function (error) {
      console.log(error);
    })
   
    await returnToCart();
  }


  useEffect(() => {

    async function getData() {  


    const resp = await axios.get(`${backend_host}api/cookieinfo/:${cookieID}`, {
    })
  
    .catch(function (error) {
      console.log(error);
    })

    let parsed = resp.data;

    setCookiePageData(parsed);

    await setIsLoading(false);

    }

    getData();

  }, [cookieID]);

  return (
    <>
      {!(isLoading) && (
        <>
    
  
    <div className="product-wrapper">
      <div className="details" >
        <div className="cookiePageImage"> 
          <img src={`${window.location.protocol}//${window.location.host}/${cookiePageData.imagepath}`} alt="cookie image" />
        </div>
        <div className="box">
          <div className="row"> 
            <h2>{cookiePageData.name}</h2>
            <span>${cookiePageData.price}</span>
          </div>
          <p>Ingredients: {cookiePageData.ingredients}</p>
          <p>Made fresh after order.</p>
          <p> <br /> Quantity: {quantity} <br />  </p>
          
          <button onClick={() => setQuantity(quantity + 1) } style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "5vh",}}>
            +1</button> 
          <button onClick={() => { if (quantity > 0) setQuantity(quantity - 1)}  } style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "5vh",}}>
            -1</button>

            <br />

  <button onClick={() => {if ( quantity > 0 ) addToCart (cookiePageData.cookieID); else console.log("Ignoring cart request due to quantity being 0.")} } style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "5vh",}}>
            Add cookie(s) to cart</button>

            
          <Link to="/menu" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "75vh",}}>
        
          View the rest of our menu</Link>

        </div>
      </div>
      </div>
    

    
        </>
      )}
    </>


  );

}


function App() {
  return (
    <>
     <Favicon url='./favicon.ico' />
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/menu' component={Menu} />
          <Route path='/log' component={Log} />          
          <Route path='/add-cookie' component={AddCookie} />  
          <Route path='/receipt' component={Receipt} />  
          <Route path='/cart' component={Cart} />  
        <Route path="/cookies/:cookieID" component={CookiePage} />
		     <Route path="/*" component={PageNotFound} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
