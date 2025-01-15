var router = require("express").Router();
const {AddUserConnect,UserConnectList}=require("../controller/UserConnect");
const {authMiddleware} = require("../Utils/Middleware")

router.get("/user/connect/:id", authMiddleware,AddUserConnect)
router.get("/user/connectlist", authMiddleware,UserConnectList)

module.exports = router;