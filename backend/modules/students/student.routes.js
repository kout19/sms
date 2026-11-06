const express = require("express");
const multer = require("multer");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");
const tenantScope = require("../../middlewares/tenantScope");
const { PERMISSIONS } = require("@packages/shared");
const AppError = require("../../utils/AppError");
const { MAX_IMPORT_BYTES } = require("./student.constants");
const controller = require("./student.controller");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMPORT_BYTES, files: 1 },
});

const readWorkbook = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (!error) return next();
    if (error.code === "LIMIT_FILE_SIZE") {
      return next(new AppError("The file exceeds the 2 MB limit.", 400));
    }
    return next(new AppError("The upload could not be read.", 400));
  });
};

router.use(authenticate, tenantScope);

router.get(
  "/classes",
  authorize(PERMISSIONS.VIEW_STUDENTS),
  controller.listClasses,
);
router.get(
  "/import/template",
  authorize(PERMISSIONS.MANAGE_STUDENTS),
  controller.template,
);
router.post(
  "/import/preview",
  authorize(PERMISSIONS.MANAGE_STUDENTS),
  readWorkbook,
  controller.previewImport,
);
router.post(
  "/import",
  authorize(PERMISSIONS.MANAGE_STUDENTS),
  readWorkbook,
  controller.commitImport,
);

router.get("/", authorize(PERMISSIONS.VIEW_STUDENTS), controller.list);
router.get("/:id", authorize(PERMISSIONS.VIEW_STUDENTS), controller.getOne);
router.post("/", authorize(PERMISSIONS.MANAGE_STUDENTS), controller.create);
router.patch("/:id", authorize(PERMISSIONS.MANAGE_STUDENTS), controller.update);
router.delete("/:id", authorize(PERMISSIONS.MANAGE_STUDENTS), controller.remove);
router.patch(
  "/:id/status",
  authorize(PERMISSIONS.MANAGE_STUDENTS),
  controller.toggleStatus,
);

module.exports = router;
