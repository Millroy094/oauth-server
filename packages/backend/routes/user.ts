import { Router } from "express";
import { UserController } from "../controllers/index.ts";
import { authenticate } from "../middleware/index.ts";

const router = Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/logout", UserController.logout);
router.get("/is-authenticated", authenticate, UserController.isAuthenticated);
router.get("/profile-details", authenticate, UserController.getProfileDetails);

router.put(
  "/profile-details",
  authenticate,
  UserController.updateProfileDetails
);

router.get("/sessions", authenticate, UserController.getSessions);

router.delete("/sessions", authenticate, UserController.deleteAllSessions);

router.delete(
  "/sessions/:sessionId",
  authenticate,
  UserController.deleteSession
);

router.get("/mfa-settings", authenticate, UserController.getMFASettings);
router.post("/mfa-setup", authenticate, UserController.setupMFA);
router.post("/mfa-verify", authenticate, UserController.verifyMFA);
router.post("/mfa-reset", authenticate, UserController.resetMFA);
router.post(
  "/mfa-change-preference",
  authenticate,
  UserController.changeMFAPreference
);
router.get(
  "/generate-recovery-codes",
  authenticate,
  UserController.generateRecoveryCodes
);

router.post("/send-otp", UserController.sendOtp);
router.post("/change-password", UserController.changePassword);

router.get("/get-login-configuration", UserController.getLoginConfiguration);

export default router;
