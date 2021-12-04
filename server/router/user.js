const router = require("express").Router()
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const User = require("../models/user")

router.post("/register",
[
  check("username")
  .isLength({min:8})
  .withMessage("must be at least 8 chars long")
  .matches(/^[A-z]+$/)
  .withMessage("must be letters, numbers are not allowed"),
  check("email")
  .isEmail()
  .normalizeEmail()
  .withMessage("invalid email"),
  check("password")
  .isLength({min:8})
  .withMessage("must be at least 8 chars long")
  .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
  .withMessage("invalid password")
],
async (req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({
      errors,
      message:"validation error"
    })
  }

  const {username,email,password,role} = req.body

  try {

    const user = new User({username, email, password, role})

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password,salt)

    await user.save()

    const payload = {
      user:{
        id:user.id,
        username:user.username,
        email:user.email,
        role:user.role
      }
    }
    
    jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:10000},(err,token)=>{
      if(err){
        console.log(err)
        return res.status(500).json({
          err
        })
      }
      console.log("token",token)
      res.status(200).json({
        token
      })
    })

  } catch (error) {
    res.status(500).json({error})
  }
})

router.post("/login",
[
  check("email")
  .isEmail()
  .normalizeEmail()
  .withMessage("invalid email"),
  check("password")
  .isLength({min:8})
  .withMessage("must be at least 8 chars long")
  .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/)
  .withMessage("invalid password")
],
async (req,res)=>{

  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({
      errors,
      message:"validation error"
    })
  }
  
  const {email,password}=req.body

  try {
    
    let user = await User.findOne({email})
    if(!user) return res.status(400).send("User is not exist")

    const isMatched = await bcrypt.compare(password,user.password)
    if(!isMatched) return res.status(400).send("Incorrect password")

    const payload = {
      user:{
        id:user.id,
        username:user.username,
        email:user.email,
        role:user.role
      }
    }

    jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn:10000},(err,token)=>{
      if(err){
        console.log(err)
        return res.status(500).json({
          err
        })
      }
      res.status(200).json({token})
    })

  } catch (error) {
    res.status(500).json({error})
  }
})

module.exports = router