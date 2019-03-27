import express from 'express'

import * as userRoutes from './userRoutes'
import * as customerRoutes from './customerRoutes'
import * as settingsRoutes from './settingsRoutes'
import * as productRoutes from './productRoutes'
import * as orderRoutes from './orderRoutes'
import * as reportsRoutes from './reportsRoutes'
import * as discountRoutes from './discountRoutes'
import * as instagramRoutes from './instagramRoutes'
import * as guestRoutes from './guestRoutes'

var router = express.Router();

router.use(userRoutes.default);
router.use(customerRoutes.default);
router.use(settingsRoutes.default);
router.use(productRoutes.default);
router.use(orderRoutes.default);
router.use(reportsRoutes.default);
router.use(discountRoutes.default);
router.use(instagramRoutes.default);
router.use(guestRoutes.default)

export default router
