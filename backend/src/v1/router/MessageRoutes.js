var router = require("express").Router();
const {
  addMessage,
  ListMessage
} = require("../controller/UserMessage");
const {authMiddleware} = require("../Utils/Middleware")

router.post("/message/add",authMiddleware,addMessage);
router.get("/message/list/:id",authMiddleware,ListMessage);


module.exports = router;
