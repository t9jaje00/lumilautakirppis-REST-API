const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const passport = require('passport');


const posts = []



  //Selaa kaikki myynti-ilmoitukset-------------------------------------------------------
  router.get('/posts', (req, res) => {
    console.log('Kaikki myynti-ilmoitukset')
    res.json(posts)
  })
  
  
  //yksittäinen myynti-ilmoitus GET-------------------------------------------------------
  router.get('/posts/:postId', (req, res) => {
  
    console.log(`Yksittäinen myynti-ilmoitus IDllä: ${req.params.postId}`)
    
    let foundIndex = posts.findIndex(p => p.postId == req.params.postId);
  
    if(foundIndex === -1) {
      res.sendStatus(404)
    } else {
      res.json(posts[foundIndex])
    }
  
  })
  
  //yksittäinen myynti-ilmoitus DELETE-------------------------------------------------------
  router.delete('/posts/:postId', passport.authenticate('jwt', {session: false}),  (req, res) => {
  
    let foundIndex = posts.findIndex(p => p.postId == req.params.postId);
  
    if(foundIndex === -1) {
      res.sendStatus(404)
    } else {
      posts.splice(foundIndex, 1);
      res.sendStatus(202);
    }
  })
  
  //yksittäinen myynti-ilmoitus POST-------------------------------------------------------
  router.post('/posts', passport.authenticate('jwt', {session: false}), (req, res) => {
    console.log(req.body)
  
    posts.push({
      postId: uuidv4(),
      description: req.body.description,
      category: req.body.category,
      location: req.body.location,
      images: req.body.images,
      askingPrice: req.body.askingPrice,
      dateOfPosting: req.body.dateOfPosting,
      deliveryType: req.body.deliveryType,
      sellerInfo: req.body.sellerInfo
    })
  
    res.sendStatus(201)
  })
  
  //yksittäinen myynti-ilmoitus PUT-------------------------------------------------------
  router.put('/posts/:postId', passport.authenticate('jwt', {session: false}),  (req, res) => {
  
    let foundPost = posts.find(p => p.postId == req.params.postId);
  
    if(foundPost) {

      foundPost.description = req.body.description,
      foundPost.category = req.body.category,
      foundPost.location = req.body.location,
      foundPost.images = req.body.images,
      foundPost.askingPrice = req.body.askingPrice,
      foundPost.dateOfPosting = req.body.dateOfPosting,
      foundPost.deliveryType = req.body.deliveryType,
      foundPost.sellerInfo = req.body.sellerInfo

     res.sendStatus(202);
    } else {
      res.sendStatus(404);
    }
  })

  //haku aihio-------------------------------------------------------
  router.get('/search', (req, res) => {

    console.log(req.query)

    const result = posts.filter(item => {
      if((item.category == req.query.category) ||
        (item.location.city == req.query.location) ||
        (item.dateOfPosting == req.query.dateOfPosting)) 
        {return true}
    })
    res.json(result)

    if (!result){
      res.sendStatus(404)
    }
  })

module.exports = router