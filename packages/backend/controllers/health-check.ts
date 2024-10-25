import {Request, Response} from 'express'
import User from '../models/User.ts'
import OIDCStore from '../models/OIDCStore.ts'
import  Client  from '../models/Client.ts'
import OTP from '../models/OTP.ts'
import HTTP_STATUSES from '../constants/http-status.ts'

class HealthCheckController {
    public static async getStatus(req: Request, res: Response) {
        try {
            await User.scan().exec()
            await Client.scan().exec()
            await OIDCStore.scan().exec()
            await OTP.scan().exec()

            res.status(HTTP_STATUSES.ok).send({status: "healthy"})

        } catch (err) {
            console.log(err)
            res.status(HTTP_STATUSES.serverError).send({status: "unhealthy"})
        }
    }
}

export default HealthCheckController