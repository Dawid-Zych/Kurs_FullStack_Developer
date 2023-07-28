/*    
    Sequelize - relacja many to many   
*/

import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('test_db', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	decimalNumbers: true,
});

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch(error => {
		console.error('Unable to connect to the database: ', error);
	});

const WebArticle = sequelize.define(
	'WebArticle',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			validate: { isInt: true },
		},
		title: {
			type: DataTypes.STRING(128),
			allowNull: false,
			validate: { len: [3, 128] },
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);

const Tag = sequelize.define(
	'Tag',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			validate: { isInt: true },
		},
		name: {
			type: DataTypes.STRING(64),
			allowNull: false,
			validate: { len: [2, 64] },
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		timestamps: false,
	}
);

const ArticleTag = sequelize.define(
	'ArticleTag',
	{},
	{
		timestamps: false,
	}
);

try {
	WebArticle.belongsToMany(Tag, {
		through: ArticleTag,
		foreignKey: 'fk_webarticle_id',
	});
	Tag.belongsToMany(WebArticle, {
		through: ArticleTag,
		foreignKey: 'fk_tag_id',
	});

	await WebArticle.sync();
	await Tag.sync();
	await ArticleTag.sync();

	const webArticle = await WebArticle.create({
		title: 'Article 001',
		content: 'Content...',
	});

	const tag1 = await Tag.create({
		name: 'Tag #1',
		description: 'tag1',
	});

	await webArticle.addTag(tag1);
	await tag1.addWebArticle(webArticle);

	const tag2 = await Tag.create({
		name: 'Tag #2',
		description: 'tag2',
	});

	await webArticle.addTag(tag2);
	await tag2.addWebArticle(webArticle);

	const webArticleDb = await WebArticle.findByPk(webArticle.dataValues.id, {
		include: [
			{
				model: Tag,
			},
		],
	});

	console.log(JSON.stringify(webArticleDb, null, 4));
} catch (err) {
	console.log(err);
}

await sequelize.close();
