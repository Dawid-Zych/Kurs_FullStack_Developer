import mongoose from 'mongoose';
const url = 'mongodb://127.0.0.1:27017/mongoproject';

mongoose
	.connect(url)
	.then(() => console.log('Pomyślnie połączono z bazą danych'))
	.catch(err => {
		console.error(err, '\n Błąd połączenia z bazą danych');
	});

const taskSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: {
		type: String,
		required: true,
		trim: true,
		minLength: 1,
		maxLength: 256,
	},
	description: {
		type: String,
		required: false,
		trim: true,
		minLength: 1,
		maxLength: 10240,
	},
	status: {
		type: String,
		required: true,
		enum: ['Not started', 'In progress', 'On hold', 'Completed'],
		default: 'Not started',
	},
	created: {
		type: Date,
		default: Date.now,
	},
});

const Task = mongoose.model('Task', taskSchema);

function makeTask(title, description) {
	return new Task({
		_id: new mongoose.Types.ObjectId(),
		title,
		description,
	});
}

const tasksArr = [
	makeTask('Task #1', 'Something to do #1'),
	makeTask('Task #2', 'Something to do #2'),
	makeTask('Task #3', 'Something to do #3'),
	makeTask('Task #4', 'Something to do #4'),
	makeTask('Task #5', 'Something to do #5'),
];
try {
	const tasksDb = await Task.find();
	console.log('Num tasks in db:', tasksDb.length);
	if (tasksDb.length === 0) {
		const newTask = await Task.insertMany(tasksArr);
		if (newTask.length > 0) {
			console.log(`Pobraliśmy nowe zadania w liczbie ${newTask.length}!`);
		} else {
			console.log('\nNie udało się pobrać nowych zadań!');
		}
	}
} catch (error) {
	console.log('Error: ', error.message);
}

export async function getAll() {
	return await Task.find();
}

export async function getById(_id) {
	return await Task.findById({ _id });
}
export async function deleteById(_id) {
	return await Task.findByIdAndDelete({ _id });
}
