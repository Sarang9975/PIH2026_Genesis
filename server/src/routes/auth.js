import { Router } from 'express';
const router = Router();
router.post('/login', (req, res) => res.json({ msg: "Login service starting..." }));
router.post('/register', (req, res) => res.json({ msg: "Registration service starting..." }));
export default router;
