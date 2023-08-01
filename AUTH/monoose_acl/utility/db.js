import mongoose from 'mongoose';

const url = 'mongodb://127.0.0.1:27017/monooseauth';

try {
	mongoose.connect(url);
} catch (error) {
	console.error(error);
}

export { mongoose };
