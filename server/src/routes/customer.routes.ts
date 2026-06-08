

import { 
    getAllCustomersHandler,
    getCustomerByIdHandler,
    createCustomerHandler,
    updateCustomerHandler,
    deleteCustomerHandler
} from "../controllers/customer.controller";
import { Router } from 'express';
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router()

router.use(authMiddleware)

router.get('/', getAllCustomersHandler)         // GET      /api/customers
router.get('/:id', getCustomerByIdHandler)      // GET      /api/customers/id
router.post('/', createCustomerHandler)         // POST     /api/customers 
router.patch('/:id', updateCustomerHandler)     // PATCH    /api/customers/id
router.delete('/:id', deleteCustomerHandler)    // DELETE   /api/customers/id