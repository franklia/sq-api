import express from 'express';
import CategoryService from '../services/categoryService';

const categoryService = new CategoryService();

const router = express.Router();

// Get inbuilt system generated categories
router.get('/', async (req, res) => {
  try {
    const categories = await categoryService.getCategories(req.query.auth0Id);
    res.json(categories);
  } catch (err) {
    res.send({ error: err.message });
  }
});

export default router;
