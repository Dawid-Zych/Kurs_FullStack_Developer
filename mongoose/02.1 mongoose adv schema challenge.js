/*
    1. Połącz się z bazą trainingdb z mongoose
    2. Stwórz schemat opisujący książkę z polami: title - String, published - Boolean,
       releaseDate - Date, author to obiekt z dwoma właściwościami typu String tzn name i surname,
       ratings - [ {rating, created - Date } ], editions - [String], created - Date, updated - Date
    3. Dodaj metodę getAverageRating() do modelu aby obliczyć średnią ocenę książki
    4. Napisz w modelu metodę getAuthor() która zwróci imię i nazwisko jako jeden łańcuch znaków
    5. Stwórz jedną instancję książki z modelem Book, jeśli książki o danyn tytule 
       nie ma w bazie to zapisz ją do mongodb. Pokaż średnią ocenę książki oraz jej autora
*/

import mongoose from "mongoose"; 
// Z nazwą bazy, będzie automatycznie utworzona
const url = "mongodb://127.0.0.1:27017/trainingdb";
mongoose.connect(url);


const bookSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: "String",
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 256
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
    author: {
        name: {
            type: "String",
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 32
        },
        surname: {
            type: "String",
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 32
        }
    },
    ratings: [
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
    editions: {
        type: [String]
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


bookSchema.methods.getAverageRating = function() {
    if (!this.ratings) return null;

    let ratingSum = 0;
    for (const r of this.ratings) ratingSum += r.rating;

    this.averageRating = (ratingSum / this.ratings.length).toFixed(2);
    return this.averageRating;
}

bookSchema.methods.getAuthor = function () {
    return this.author.name + " " + this.author.surname;
}

const Book = mongoose.model("Book", bookSchema);

const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    title: "JavaScript programming",
    published: true,
    releaseDate: new Date(2023, 2, 15),
    author: {
        name: "Ola",
        surname: "Kowalska"
    },
    ratings: [
        { rating: 9.3 },
        { rating: 9.2 },
        { rating: 8.3 },
        { rating: 7.9 }
    ],
    editions: ["ebook", "print"]
});

let bookFromDb = await Book.findOne({ title: "JavaScript programming" });

if (!bookFromDb) {
    bookFromDb = await book.save();
    if (bookFromDb) console.log("Book saved to db");
}

console.log( bookFromDb.getAverageRating() );
console.log( bookFromDb.getAuthor() );


await mongoose.disconnect();





















