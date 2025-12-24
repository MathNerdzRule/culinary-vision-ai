export const ourGroceriesService = {
  async addItem(itemName, listId = null) {
    try {
      const response = await fetch('/api/ourgroceries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addItem',
          itemName,
          listId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add item to OurGroceries');
      }

      return await response.json();
    } catch (error) {
      console.error('OurGroceries Client Error:', error);
      throw error;
    }
  },

  async getLists() {
    try {
      const response = await fetch('/api/ourgroceries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getList',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch OurGroceries lists');
      }

      const data = await response.json();
      return data.lists;
    } catch (error) {
      console.error('OurGroceries Client Error:', error);
      throw error;
    }
  }
};
