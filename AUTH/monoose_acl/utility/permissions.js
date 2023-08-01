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

const permissions = {
	usersRoles: usersRoles,
	addRoleParents: function (targetRole, sourceRole) {
		const targetData = this.usersRoles.find(v => v.role === targetRole); //np obiekt z role admin
		const sourceData = this.usersRoles.find(v => v.role === sourceRole); //np obiekt z role user

		targetData.allows = targetData.allows.concat(sourceData.allows);
	},
};

permissions.addRoleParents('admin', 'user');
console.log(JSON.stringify(permissions.usersRoles, null, 4));
export { permissions };
