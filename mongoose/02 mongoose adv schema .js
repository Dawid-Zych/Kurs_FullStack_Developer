import mongoose from "mongoose";

// Z nazwą bazy, będzie automatycznie utworzona
const url = "mongodb://127.0.0.1:27017/mongoosetest";
mongoose.connect(url, function (err) {
    if (err) throw err;
    console.log("Connected to db");
});


const gameSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 128
    },
    published: {
        type: Boolean,
        required: true,
        default: false
    },
    releaseDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    ratings: [ // tablica elementów - ocen gry
        {
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 10
            },
            created: {
                type: Date,
                default: Date.now
            }
        }
    ],
    platforms: {
        type: [String] // ["PC", "PSX"]
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

gameSchema.methods.getAverageRating = function () {
    if (!this.ratings) return null;

    let ratingsSum = 0;
    for (const r of this.ratings) ratingsSum += r.rating;

    this.averageRating = (ratingsSum / this.ratings.length).toFixed(2);
    return this.averageRating;
};

const Game = mongoose.model("Game", gameSchema);

const driver = new Game({
    _id: new mongoose.Types.ObjectId(),
    title: "Driver",
    published: true,
    releaseDate: new Date(1999, 5, 25),
    ratings: [
        { rating: 8.5 },
        { rating: 9.2 },
        { rating: 8.7 }
    ],
    platforms: ["PSX", "PC", "iOS", "Mac"]
});


let driverFromDb = await Game.findOne({ title: "Driver" });
if (!driverFromDb) {
    driverFromDb = await driver.save();
    if (driverFromDb) console.log("New game saved to db");
}

console.log( driverFromDb.getAverageRating() ); // 8.80





