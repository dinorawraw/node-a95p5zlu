migrate((db) => {
  // Create collections
  const collections = [
    {
      name: 'users',
      type: 'auth',
      schema: [
        {
          name: 'username',
          type: 'text',
          required: true,
          unique: true
        },
        {
          name: 'name',
          type: 'text',
          required: true
        },
        {
          name: 'role',
          type: 'select',
          options: {
            values: ['user', 'admin']
          },
          required: true,
          default: 'user'
        }
      ]
    },
    {
      name: 'news',
      type: 'base',
      schema: [
        {
          name: 'title',
          type: 'text',
          required: true
        },
        {
          name: 'content',
          type: 'text',
          required: true
        },
        {
          name: 'image',
          type: 'url'
        },
        {
          name: 'video',
          type: 'url'
        }
      ]
    },
    {
      name: 'calculations',
      type: 'base',
      schema: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          options: {
            collectionId: 'users'
          }
        },
        {
          name: 'name',
          type: 'text',
          required: true
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: {
            values: ['instagram', 'tiktok']
          }
        },
        {
          name: 'data',
          type: 'json',
          required: true
        }
      ]
    }
  ];

  collections.forEach(collection => {
    const col = new Collection(collection);
    db.collections.add(col);
  });

  return db;
}, (db) => {
  // Revert changes
  const collections = ['users', 'news', 'calculations'];
  collections.forEach(name => {
    const collection = db.collections.findOne(`name = "${name}"`);
    if (collection) {
      db.collections.delete(collection.id);
    }
  });
  return db;
});