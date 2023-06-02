// relacja many to many to np różne tagi które mogą być w wielu artykułach
// np jeden artykuł ma tagi: html, css i JavaScript
// drugi artykuł ma tag również JavaScript itd.
// Czyli ten sam tag należy do różnych artykułów, a sam artykuł może mieć wiele tagów

import mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/mongoosetest';
mongoose.connect();

const tagSchema = new mongoose.Schema({
	name: String,
	articles: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Article',
		},
	],
});
const Tag = mongoose.model('Tag', tagSchema);

const articleSchema = new mongoose.Schema({
	title: String,
	content: String,
	author: String,
	tags: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Tag',
		},
	],
});
const Article = mongoose.model('Article', articleSchema);

await Tag.deleteMany({});
await Article.deleteMany({});

async function createArticle(article) {
	return await Article.create(article);
}

async function createTag(tag) {
	return await Tag.create(tag);
}

// tworzy wzajemne powiązanie taga i article
async function addTagToArticle(article, tag) {
	const dbArt = await Article.findByIdAndUpdate(
		article._id,
		{ $push: { tags: tag._id } }, // wrzuca na koniec tablicy tags w artykule w bazie tag._id
		{ new: true } /* zwróci zaktualizowany rekord article z bazy */
	);

	const dbTag = await Tag.findByIdAndUpdate(tag._id, { $push: { articles: article._id } }, { new: true });
}

async function getArticleData(id) {
	return await Article.findById(id).populate('tags');
}

async function getTagData(id) {
	return await Tag.findById(id).populate('articles');
}

let art1 = await createArticle({
	title: 'Article #1',
	author: 'Ania',
	content: 'Content #1',
});

let tagHtml = await createTag({ name: 'Html' });
let tagCss = await createTag({ name: 'Css' });
let tagJavaScript = await createTag({ name: 'JavaScript' });

await addTagToArticle(art1, tagHtml);
await addTagToArticle(art1, tagCss);
await addTagToArticle(art1, tagJavaScript);

let art2 = await createArticle({
	title: 'Article #2',
	author: 'Ola',
	content: 'Content #2',
});

await addTagToArticle(art2, tagCss);

const articleDb = await getArticleData(art1._id);
console.log(articleDb);
//console.log("Article1.tags:\n", articleDb.tags); // tablica tagów

const tagDb = await getTagData(tagHtml._id);
console.log('tagHtml:\n', tagDb);
