import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('External working');
});

export default router;
