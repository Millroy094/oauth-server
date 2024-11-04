import { Router } from 'express'
import PasskeyController from '../controllers/passkey.ts'

const router = Router()

router.get('/get-passkeys', PasskeyController.getPasskeys)
router.delete('/delete-passkey', PasskeyController.deletePasskey)
router.post('/register', PasskeyController.registerPasskey)
router.post('/verify-registration', PasskeyController.verifyPasskeyRegistration)
router.post(
  '/check-passkey-already-exists',
  PasskeyController.checkPasskeyExists,
)

export default router
