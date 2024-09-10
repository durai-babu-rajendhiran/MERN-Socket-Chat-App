var router = require("express").Router();
const {AddUserConnect,
    UserConnectList}=require("../controller/UserConnect");

router.post("/userconnect/add", AddUserConnect)
router.get("/userConnectlist/:id", UserConnectList)

module.exports = router;