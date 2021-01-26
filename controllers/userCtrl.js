const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {
  register : async (req, res) => {
      try {
          const {name, email, password} = req.body
          const user = await User.findOne({email})
          if(user) return res.status(400).json({msg: "This Email already exist"})
          
          if(password.length < 6)
          return res.status(400).json({msg: "Password is at least 6 characters"})

          const passwordHash = await bcrypt.hash(password, 10)

          const newUser = new User({
              name, email, password: passwordHash
          })
          await newUser.save()
          // Db Ngado Token
          const accessToken = createAccessToken({id: newUser._id})
          const refreshToken = createRefreshToken({id: newUser._id})
          res.cookie('refreshtoken', refreshToken, {
              httpOnly: true,
              path: '/user/refresh_token'
          })
          res.json({accessToken})
          //res.json(newUser)
          //res.json({password, passwordHash})
          //res.json({msg: "Register Success"})
      } catch (error) {
          
      }
  },
  login: async (req, res) => {
      try {
          const {email, password} = req.body
          const user = await User.findOne({email})
          if(!user) return res.status(400).json({msg: "User Does Not exist "})
          
          const isMatch = await bcrypt.compare(password, user.password)
          if(!isMatch) return res.status(400).json({msg: "incorrect Password"})
          
          // Db Ngado Token
          const accessToken = createAccessToken({id: user._id})
          const refreshToken = createRefreshToken({id: user._id})
          
          res.cookie('refreshtoken', refreshToken, {
              httpOnly: true,
              path: '/user/refresh_token',
              maxAge: 7*24*60*60*1000 // 7d
          })
          res.json({accessToken})
          
          //res.json({msg: "Mar7baaaaa"})
      } catch (error) {
          
      }
  },
  logout: async (req, res) => {
      try {
          res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
          res.json({msg: "Logged Out"})
      } catch (error) {
          
      }
  },
  refreshToken: async (req, res) => {
      try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: "Please Login or Register"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
                if(err) return res.json({msg: "Please Login or Register"})

                const accesstoken = createAccessToken({id: user.id})

                res.json({accesstoken})
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
  },
  getUser: async (req, res) => {
      const user = await User.findById(req.user.id).select('-password')
      if(!user) return res.status(400).json({msg: "User Does Not exist"})

      res.json(user)
  },
  addCart: async (req, res) => {
      try {
          const user = await User.findById(req.user.id)
          if(!user) return res.status(400).json({msg: "User does not exist."})

          await Users.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            })

            return res.json({msg: "Added to cart"})

      } catch (error) {
          
      }
  },
   history: async(req, res) =>{
        try {
            const history = await Payments.find({user_id: req.user.id})

            res.json(history)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    } 
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}


module.exports = userCtrl