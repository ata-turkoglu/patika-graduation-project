const router = require("express").Router()
const { response } = require("express");
const client = require("../db");

router.get("/factories", async(req,res)=>{
  client.query("SELECT * FROM factories", (err,result)=>{
    if(!err){
      res.status(200).json(JSON.parse(JSON.stringify(result.rows)))
    }else{
      console.error(err)
      res.status(500).json({err, message:'could not get factories'})
    }
  })
})


module.exports=router