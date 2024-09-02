import { Router } from "express";
import { UserController } from "../controllers";
import { authenicate } from "../middleware";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/logout", UserController.logout);
router.get("/is-authenticated", authenicate, UserController.isAuthenticated);
router.get("/profile-details", authenicate, UserController.getProfileDetails);

router.put(
  "/profile-details",
  authenicate,
  UserController.updateProfileDetails
);

router.get("/sessions", authenicate, UserController.getSessions);

router.delete("/sessions", authenicate, UserController.deleteAllSessions);

router.delete(
  "/sessions/:sessionId",
  authenicate,
  UserController.deleteSession
);

router.get("/mfa", authenicate, UserController.getMFASettings);

export default router;
