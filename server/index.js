const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false
}))
const mongoose = require('mongoose');
const user = require('./models/user')
const fs = require('fs');
const cart = require('./models/cart')
const cookie = require('./models/cookie')
const {
    Webhook
} = require('discord-webhook-node');
var cors = require('cors');
app.use(cors());

let hook, uri, password; 

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('[server] connected to database'));


app.post('/api/additemtocart', async (req, res) => {

    /* 
        userID: number
        itemID: number
        quantity: number
    */

    console.log("[api] Add item to cart request received");
    console.dir(req.body);

    let userID = req.body.userID;
    let itemID = req.body.itemID;
    let quantity = req.body.quantity;

    console.log(userID)

    if ((await cart.findOne({
            userID: userID
        }) == null)) {
        let emptyCart = [];
        let newCartPayload = {
            userID: userID,
            cookies: emptyCart
        };  
        await cart.create(newCartPayload);
    }

    let newEntry = {
        cookieID: itemID,
        quantity: quantity
    };

    try {
        await cart.updateOne({
            userID: userID
        }, {
            $push: {
                cookies: newEntry
            }
        })
    } catch (err) {
        return res.send('error' + err);
    }

    res.send('success!');
})

app.post('/api/removeitemfromcart', async (req, res) => {

    /* 
        userID: number
        itemID: number
    */

    console.log("[api] remove item from cart request received ");
    console.dir(req.body);

    let userID = req.body.userID;
    let itemID = req.body.itemID;
    
    try {

        
        cart.updateOne(
          { userID: userID },
          { $pull: { cookies: { cookieID: itemID } } },
          (error, result) => {
            if (error) {
              console.error(error);
              // handle the error
            } else {
                console.log('deleted cookie from cart');
            }
          }
        );
        
    } catch (err) {
        return res.send('error' + err);
    }

    res.send('success!');
})




app.post('/api/registeruser', async (req, res) => {

    /* 
        no body
    */

    console.log("[api] Register user request received")
    
    let foundnewUserID = false,
        currID = 0;

    while (!foundnewUserID) {

        const userEntry = await user.findOne({
            userID: currID
        });

        if (userEntry !== null)
            currID++;
        else foundnewUserID = true;
    }

    const newUserPayload = {
        userID: currID
    }

    await user.create(newUserPayload);

    const newUserCartPayload = {
        userID: currID
    };

    await cart.create(newUserCartPayload);

    if (await user.findOne({
            userID: currID
        }) !== null)
        return res.send(`${currID}`);
    else return res.send('something went wrong');

})

app.post('/api/checkout', async (req, res) => {

    /* 
        userID: number
        address: String
    */

    console.log("[api] checkout request received");
    console.dir(req.body);


    let entry = await cart.findOne({
        userID: req.body.userID
    });

    let orderMessage = `New order ( to ${req.body.address} )! Order items: \n`;

    if (entry !== null) {

        for (let i = 0; i < entry.length; i++) {

            let currentEntry = entry.cookies[i];

            let cookieEntry = await cookie.findOne({
                cookieID: currentEntry.cookieID
            });

            let orderInfo = currentEntry.quantity + "" + cookieEntry.name + "\n";

            orderMessage = orderMessage + orderInfo;


            fs.appendFile('./sales.log', orderInfo, function(err) {
                if (err) throw err;
                console.log('[api: checkout] updated log');
            });


        }

        hook.send(orderMessage);

        cart.deleteOne({ userID: req.body.userID }).then(function(){
         }).catch(function(error){
            console.log(error); 
         });

    } else return res.send('no cart');



})

app.post('/api/getcart', async (req, res) => {


    /* 
        userID: number
    */

    console.log("[api] get cart request received");
    console.dir(req.body);


    let entry = await cart.findOne({
        userID: req.body.userID
    });

    if (entry !== null) {

        return res.send(JSON.stringify(entry));


    } else return res.send('no cart');


})


app.get('/api/cookieinfo/:id', async (req, res) => {

    /* 
       no body
    */

    let cookieIDStr = (req.params.id).toString();
    const modifiedCookieIDStr = cookieIDStr.replace(cookieIDStr[0], '');
    let requestedCookieID = Number(modifiedCookieIDStr);

    if ( isNaN(modifiedCookieIDStr) )
        return res.send("not a number");

    console.log(`[api] cookieinfo request received for ${modifiedCookieIDStr}`)

    if (await cookie.findOne({
            cookieID: requestedCookieID
        }) !== null) {


        let entry = await cookie.findOne({
            cookieID: requestedCookieID
        });


        let cookieid = entry.cookieID;
        let ingredients = entry.ingredients;
        let name = entry.name;
        let currentyPopular = entry.currentyPopular;
        let imagepath = entry.imagePath;
        let price = entry.price;

        let returnInfo = {
            "cookieID": cookieid,
            "ingredients": ingredients,
            "name": name,
            "currentlyPopular": currentyPopular,
            "imagepath": imagepath,
            "price": price
        }

        return res.send(JSON.stringify(returnInfo));

    } else return res.send("invalid id");

})

app.post('/api/log', (req, res) => {

    /* 
        password: string
    */


    console.log('[api] Log request received')
    console.dir(req.body);


    if (req.body.password === password)
        return res.send((fs.readFileSync('./sales.log')).toString());
    else return res.send("bad auth");

})

app.get('/api/getlastcookieindex', async (req, res) => {

    let cookieIndexes = [];

    for await (const currCookie of cookie.find()) {

        cookieIndexes.push(currCookie.cookieID)

        // sort array 

        let i, j = 0;

        while (i < cookieIndexes.length) {
            j = i + 1;
            while (j < cookieIndexes.length) {
                 
                if (cookieIndexes[j] < cookieIndexes[i]) {
                    var temp = cookieIndexes[i];
                    cookieIndexes[i] = cookieIndexes[j];
                    cookieIndexes[j] = temp;
                }
                j++;
            }
            i++;
        }

    }

    res.send(`${cookieIndexes[cookieIndexes.length - 1]}`);

})  

app.post('/api/addcookie', async (req, res) => {

    /* 
        cookieID: number
        ingredients: string
        name: string
        imagePath: string
        price: Number
        currentyPopular: boolean
    */

    console.log("[api] Add cookie request received");
    console.dir(req.body);

    await cookie.create(req.body);

    if (cookie.findOne({
            cookieID: req.body.cookieID
        }) !== null)
        return res.send('cookie made');
    else return res.send('something went wrong');
})



app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status);
    res.render('error');
});


app.listen(64135, () => {
    console.log('[server] backend running on port 64135!');
})
