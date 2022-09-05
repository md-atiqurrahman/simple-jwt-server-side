const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());


const verityJWT = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message: 'unAuthorized access'})
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,decoded) =>{
        if(err){
            return res.status(403).send({message: 'forbidden access'})
        }
        req.decoded = decoded;
        next();
    })

}

app.post('/login', (req, res) => {
    const user = req.body;
    //Danger: Do not check password here for serious application.
    // Use proper process for hashing and checking.we should convert the password in  the hash/encrypted password and match with the encrypted password which is stored in database while creating user.
    //After completing all authentication related verification ,issue JWT token 
    if (user.email === 'user@gmail.com' && user.password === '123456') {

        const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        
        res.send(
            {
                accessToken: accessToken,
                success: true
            })
    }
    else {
        res.send({
            success: false
        })
    }
});

app.get('/orders',verityJWT, (req, res) =>{
    res.send([{id:1, name: 'sunglass'},{id: 2, name: 'moonglass'}])
})

app.get('/', (req, res) => {
    res.send('Simple JWT server is running')
});

app.listen(port, () => {
    console.log('Listening on port', port)
})