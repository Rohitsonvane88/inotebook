const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router();
const User = require('../models/User')
const {body, validationResult} = require('express-validator');
var jwt = require('jsonwebtoken')
const JWT_SECRET = "Harryisagoodb$oy"
var fetchUser = require('../middleware/fetchUser')

// Create a user using: POST "/api/auth/createUser". Doesn't require Auth

router.post('/createUser', [
     body('name', 'Enter a valid name').isLength({min: 3}),
     body('email', 'Enter a valid email').isEmail(),
     body('password', 'Password must be atleast 5 characters').isLength({min: 5})
] , async (req, res) => {
     let success = false;
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          success = false
          return res.status(400).json({success, errors: errors.array() });
     }

     try {

          let user = await User.findOne({email: req.body.email});
          if(user) {
               return res.status(400).json({success, error: "Sorry a user with this email already exists"})
          }
          const salt = await bcrypt.genSalt(10)
          secPass = await bcrypt.hash(req.body.password, salt)

          user = await User.create({
               name: req.body.name,
               password: secPass,
               email: req.body.email
          })
          const data = {
               user: {
                    id: user.id
               }
          }
          const authtoken = jwt.sign(data, JWT_SECRET)
          
          // res.json({"Nice": "nice"})
          success = true
          res.json({success, authtoken});

          // .then(user => res.json(user))
          // .catch(err => {console.log(err)
          // res.json({error: "Please enter a unique value for email", message: err.message})})
     } catch (error){
          success = false
          console.log(error.message);
          res.status(500).send(success, "Internal Server Error")
     }
     })
     
// Authenticate a User using: POST "/api/auth/login", No login required

router.post('/login', [
     body('email', 'Enter a valid email').isEmail(),
     body('password', 'Password can not be blank').exists()
] , async (req, res) => {
     let success = false;
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
     }

     const {email, password} = req.body;
     try {
          let user = await User.findOne({email})
          if(!user) {
               success = false
               return res.status(400).json({success, error: "Please try to login with correct credentials"})
          }
          const passwordCompare = await bcrypt.compare(password, user.password);
          if(!passwordCompare){
               success = false
               return res.status(400).json({success, error: "Please try to login with correct credentials"})
          }
          const data = {
               user: {
                    id: user.id
               }
          }
          const authtoken = jwt.sign(data, JWT_SECRET)
          success = true
          res.json({success, authtoken})

     } catch (error) {
          console.log(error.message);
          res.status(500).send("Internal Server Error")
     }
})

// ROUTE 3: get loggedin User details using: POST "/api/auth/getuser", login required

router.post('/getuser', fetchUser,async (req, res) => {
     try {
          userId = req.user.id;
          const user = await User.findById(userId).select("-password")
          res.send(user)
     } catch (error) {
          console.log(error.message);
          res.status(500).send("Internal Server Error")
     }
}
)
module.exports = router