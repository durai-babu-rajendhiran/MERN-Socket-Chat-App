var router = require("express").Router();
const {
  addMessage,
} = require("../controller/UserMessage");

router.post("/add-message", addMessage);


module.exports = router;
