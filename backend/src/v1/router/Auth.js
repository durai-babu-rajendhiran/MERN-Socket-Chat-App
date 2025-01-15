var router = require("express").Router();
const {Login,Register,UserList,UserGet}=require("../controller/AuthController");
const {authMiddleware} = require("../Utils/Middleware")

router.post("/user/login", Login)
router.post("/user/register", Register)
router.get("/user/list", authMiddleware, UserList)
router.get("/user/get", authMiddleware, UserGet)

module.exports = router;