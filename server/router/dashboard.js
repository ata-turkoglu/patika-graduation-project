const router = require("express").Router()
const { response } = require("express");
const client = require("../db");

//Get all data
router.get("/factories", async(req,res)=>{
  var responseData={
    columns:[],
    rows:[]
  }
  try {
    let result = await client.query("SELECT a.attname, pg_catalog.format_type(a.atttypid, a.atttypmod) FROM pg_catalog.pg_attribute a WHERE a.attnum > 0 AND NOT a.attisdropped AND a.attrelid = ( SELECT c.oid FROM pg_catalog.pg_class c LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE c.relname ~ '^(factories)$' AND pg_catalog.pg_table_is_visible(c.oid) );")
    responseData.columns = JSON.parse(JSON.stringify(result.rows))
  } catch (error) {
    console.error(error)
    res.status(500).json({error, message:'could not get factories'})
  }
  try {
    let result = await client.query("SELECT * FROM factories columns")
    responseData.rows = JSON.parse(JSON.stringify(result.rows))
  } catch (error) {
    console.error(error)
    res.status(500).json({error, message:'could not get factories rows'})
  }
  res.status(200).json(responseData)
})

//Add new row
router.post("/factories", async(req,res)=>{
  let keys = Object.keys(req.body)
  console.log(keys)
  let values = Object.values(req.body)
  console.log(values)
  
  let queryKeys=""
  for (let index = 0; index < keys.length; index++) {
    if(index==keys.length-1){
      queryKeys+=`$${index+1}`
    }else{
      queryKeys+=`$${index+1}, `
    }
  }

  try {
    let result = await client.query(`INSERT INTO factories (${keys.join(", ")}) VALUES(${queryKeys}) RETURNING *`,values)
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({error, message:'could not add row to factories'})
  }
})

//Delete row
router.delete("/factories", async(req,res)=>{
  try {
    await client.query(`DELETE FROM factories WHERE id = ${req.body.id}`)
    res.status(200).json(req.body.id)
  } catch (error) {
    console.error(error)
    res.status(500).json({error, message:'could not delete row from factories'})
  }
})

//Update row
router.patch("/factories/updaterow",async(req,res)=>{
  let keys = Object.keys(req.body)
  let values = Object.values(req.body)
  let query=""

  for (let i=0; i<keys.length; i++){
    if(i==keys.length-1){
      query+=`${keys[i]}=$${i+1}`
    }else{
      query+=`${keys[i]}=$${i+1}, `
    }
  }

  try {
    let result = await client.query(`UPDATE factories SET ${query} WHERE id=$1 RETURNING *`, values)
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({error, message:'could not update row from factories'})
  }  
})

//Add new column
router.post("/factories/addnewcolumn",async(req,res)=>{
  let column = req.body
  let query = `ALTER TABLE factories ADD COLUMN ${column.name} ${column.type}`
  try {
    let result = await client.query(query)
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({error, message:'could not add column to factories'})
  }
})

//Delete column
router.delete("/factories/deletecolumn",async(req,res)=>{
  let column = req.body.column
  let query = `ALTER TABLE factories DROP COLUMN ${column}`
  try {
    let result = await client.query(query)
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({error, message:'could not add column to factories'})
  }
})

module.exports=router