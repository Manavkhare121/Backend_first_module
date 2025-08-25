import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    // middlewares (fields is like a array)
    { name: "avatar",
        maxcount:1, // how much field you should required
     },
    {
        name:"coverimage",
        maxcount:1,
    },
  ]),
  registerUser
);
export default router;
