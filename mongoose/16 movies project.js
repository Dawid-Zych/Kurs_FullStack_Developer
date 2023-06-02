import mongoose from 'mongoose';
const url = 'mongodb://127.0.0.1:27017/movie';

mongoose.connect(url);
console.log('polączono z mongodb');
await mongoose.disconnect();
