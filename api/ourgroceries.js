export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, itemName, listId } = req.body;
  const email = process.env.OUR_GROCERIES_EMAIL;
  const password = process.env.OUR_GROCERIES_PASSWORD;

  if (!email || !password) {
    return res.status(500).json({ error: 'OurGroceries credentials not configured in environment variables' });
  }

  try {
    // 1. Sign in to get the cookie
    const signInBody = new URLSearchParams({
      emailAddress: email,
      password: password,
      action: 'sign-in'
    });

    const signInRes = await fetch('https://www.ourgroceries.com/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: signInBody.toString(),
      redirect: 'manual'
    });

    const setCookie = signInRes.headers.get('set-cookie');
    if (!setCookie) {
      return res.status(401).json({ error: 'Failed to sign in to OurGroceries' });
    }

    const authCookie = setCookie.split(';')[0];

    // 2. Get Overview to find teamId and listId if not provided
    const overviewRes = await fetch('https://www.ourgroceries.com/your-lists/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authCookie
      },
      body: JSON.stringify({ command: 'getOverview' })
    });

    const overview = await overviewRes.json();
    const teamId = overview.teamId;

    if (action === 'getList') {
      return res.status(200).json({ lists: overview.shoppingLists, teamId });
    }

    if (action === 'addItem') {
      // Find the first list if listId not provided
      const targetListId = listId || (overview.shoppingLists && overview.shoppingLists[0]?.id);
      
      if (!targetListId) {
        return res.status(400).json({ error: 'No shopping list found' });
      }

      const addItemRes = await fetch('https://www.ourgroceries.com/your-lists/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': authCookie
        },
        body: JSON.stringify({
          command: 'insertItem',
          teamId: teamId,
          listId: targetListId,
          value: itemName,
          categoryId: 'uncategorized'
        })
      });

      const result = await addItemRes.json();
      return res.status(200).json(result);
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (error) {
    console.error('OurGroceries API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
