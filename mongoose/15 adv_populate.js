// 15 Mongoose - rozbudowany populate do pobrania dodatkowych danych     c30ch28m15
// adv_populate.js

import mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/mongoosetest';
mongoose.connect(url);

const authorSchema = new mongoose.Schema({
	name: String,
	email: String,
	pages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Page',
		},
	],
});
const Author = mongoose.model('Author', authorSchema);

const pageSchema = mongoose.Schema({
	title: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Author',
	},
	body: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
		},
	],
});
const Page = mongoose.model('Page', pageSchema);

const commentSchema = mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Author',
	},
	page: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Page',
	},
	body: String,
});
const Comment = mongoose.model('Comment', commentSchema);

await Author.deleteMany({});
await Page.deleteMany({});
await Comment.deleteMany({});

async function createAuthor(author) {
	return await Author.create(author);
}

async function addPageToAuthor(page, author) {
	const dbAuthor = await Author.findByIdAndUpdate(author._id, { $push: { pages: page._id } }, { new: true });
	return dbAuthor;
}

async function createPage(page, author) {
	page.author = { _id: author._id };
	const pageDb = await Page.create(page);
	await addPageToAuthor(pageDb, author);
	return pageDb;
}

async function addCommentToPage(comment, page) {
	const dbPage = await Page.findByIdAndUpdate(page._id, { $push: { comments: comment._id } }, { new: true });
	return dbPage;
}

async function createComment(page, author, comment) {
	comment.page = { _id: page._id };
	comment.author = { _id: author._id };
	const commentDb = await Comment.create(comment);
	addCommentToPage(commentDb, page);
	return commentDb;
}

const author1 = await createAuthor({
	name: 'Ania',
	email: 'ania@example.com',
});

const author2 = await createAuthor({
	name: 'Ola',
	email: 'ola@example.com',
});

const page1 = await createPage(
	{
		title: 'Page #1',
		body: 'Page #1 content',
	},
	author1
);

const comment1 = await createComment(page1, author1, { body: 'Comment #1 by author1' });
const comment2 = await createComment(page1, author1, { body: 'Comment #2 by author1' });
const comment3 = await createComment(page1, author2, { body: 'Comment #3 by author2' });

const authorData = await Author.find({}).populate({
	path: 'pages',
	populate: {
		path: 'comments',
	},
});

console.log(JSON.stringify(authorData, null, 4));

const pageData = await Page.find({}).populate({
	path: 'comments',
	populate: {
		path: 'author',
	},
});

console.log(JSON.stringify(pageData, null, 4));

const pageData2 = await Page.find({}).populate([
	{
		path: 'comments', // pobranie komentarzy
		populate: {
			path: 'author', // pobranie autora komentarza
		},
	},
	{
		path: 'author', // pobranie autor strony
	},
]);

console.log(JSON.stringify(pageData2, null, 4));

await mongoose.disconnect();
