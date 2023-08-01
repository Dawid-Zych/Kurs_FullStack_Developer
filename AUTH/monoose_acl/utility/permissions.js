const usersRoles = [
	{
		role: 'admin',
		allows: [
			{ resource: '/admin/users', permissions: '*' }, // * to wszystkie metody get, post
			{ resource: '/admin/users/add', permissions: '*' },
			{ resource: '/admin/users/edit', permissions: '*' },
			{ resource: '/admin/users/edit/:id', permissions: '*' },
		],
	},
	{
		role: 'user',
		allows: [{ resource: '/dashboard', permissions: ['post', 'get'] }],
	},
	{
		role: 'quest',
		allows: [],
	},
];

const permissions = {};

export { permissions };
