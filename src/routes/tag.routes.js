import {Router} from 'express'
const router = Router()

import * as tagCtrl from '../controllers/tag.controller'

router.post('/', tagCtrl.createTag)

export default router