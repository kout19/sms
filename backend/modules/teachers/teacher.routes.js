const express =require("express");
const authenticate =require("../../middlewares/authenticate");
const {PERMISSIONS} =require("@packages/shared");
const controller =require("./teacher.controller");
const authorize =require("../../middlewares/authorize");
const tenantScope= require("../../middlewares/tenantScope");

const router =express.Router();

router.use(authenticate, tenantScope);

router.get("/",authorize(PERMISSIONS.MANAGE_TEACHERS),controller.list);
router.get("/:id",authorize(PERMISSIONS.MANAGE_TEACHERS),controller.getOne);
router.post("/",authorize(PERMISSIONS.MANAGE_TEACHERS),controller.create);
router.post("/:id",authorize(PERMISSIONS.MANAGE_TEACHERS),controller.update);
router.post("/:id/delete",authorize(PERMISSIONS.MANAGE_TEACHERS),controller.remove);
router.post("/:id/status",authorize(PERMISSIONS.MANAGE_TEACHERS),controller.toggleStatus);


module.exports=router;