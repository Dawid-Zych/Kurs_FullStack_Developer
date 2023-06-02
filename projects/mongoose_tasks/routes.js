import * as url from 'url';
import * as Task from './model/task.model.js';
import { TasksController } from './controllers/task.controller.js';
import { serveStaticFile, serveJsonObj, getPostData } from './util/serverHelper.js';
import * as HtmlRenderer from './util/htmlRenderer.js';

const tasksController = new TasksController();

export async function handleRequest(req, res) {
	let path = url.parse(req.url).pathname;
	console.log('req.url: ', req.url);
	console.log('path: ', path);

	if (req.url === '/' && req.method === 'GET') {
		const tasks = await Task.getAll();
		const props = {
			title: 'Lista zadań',
			heading: 'Lista Zadań',
			tasksHtml: HtmlRenderer.tasksListHtml(tasks),
		};

		HtmlRenderer.render('./static/index.html', res, props);
		res.end();
	} else if (req.url === '/api/task' && req.method === 'GET') {
		const tasksData = await tasksController.getAll();
		serveJsonObj(res, tasksData);
	} else if (req.url.match(/\/api\/task\/([a-z0-9]+)/) && req.method === 'GET') {
		const id = req.url.split('/')[3];
		const taskData = await tasksController.getById(id);
		serveJsonObj(res, taskData);
	} else {
		serveStaticFile(req, res);
	}
}
