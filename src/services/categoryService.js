import Users from '../models/users';

export default class CategoryService {
  async getCategories(auth0Id) {
    try {
      if (!auth0Id) {
        const categories = await Users.find({ auth0_id: process.env.AUTH0_ADMIN_ID }).lean().select('categories');
        return categories[0].categories;
      } else {
        const categories = await Users.find({ auth0_id: auth0Id }).lean().select('categories');
        return categories[0].categories;
      }
    } catch (error) {
      throw error;
    }
  }
}
