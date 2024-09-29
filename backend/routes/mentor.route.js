import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { applyAsMentor, getMentors, deleteMentor, updateMentor, assignMentor, approveMentor } from '../controllers/mentor.controller.js';

const router = express.Router();

router.post('/apply',  applyAsMentor);
router.get('/getmentors', getMentors);
router.delete('/deletementor/:mentorId',  deleteMentor);
router.put('/updatementor/:mentorId',  updateMentor);
router.put('/assignmentor/:mentorId',  assignMentor);
router.put('/approvementor/:mentorId',  approveMentor);


export default router;