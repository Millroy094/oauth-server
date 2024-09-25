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

router.get("/mfa-settings", authenicate, UserController.getMFASettings);
router.post("/mfa-setup", authenicate, UserController.setupMFA);
router.post("/mfa-verify", authenicate, UserController.verifyMFA);
router.post("/mfa-reset", authenicate, UserController.resetMFA);
router.post(
  "/mfa-change-preference",
  authenicate,
  UserController.changeMFAPreference
);
router.get(
  "/generate-recovery-codes",
  authenicate,
  UserController.generateRecoveryCodes
);

router.post("/send-otp", UserController.sendOtp);
router.post("/change-password", UserController.changePassword);

router.get("/get-login-configuration", UserController.getLoginConfiguration);

export default router;
