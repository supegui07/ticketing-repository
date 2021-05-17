import express from "express";

const router = express.Router()

router.get('/api/users/signout', (req, res) => {
  req.session = null

  res.json({})
})

export { router as signoutRouter }
