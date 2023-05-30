/*  one_to_many_challenge.js
    12.1 Mongoose - relacja one to many   - zadanie     c30ch28m12.1  

    Zadanie z one to many
    1. Napisz schemat kupującego w sklepie czyli Buyer z polami name i surname jako String
    2. Utwórz schemat Cart z jednym polem buyer z relacją one to one jako embedded schema 
    3. Dodaj schemat opisujący produkt w sprzedaży z polami name, price i cart z relacją one to 
       many, czyli jeden cart ma wiele produktów w koszyku zakupów. Pamiętaj aby w właściwości 
       cart typ był określony jako ObjectId z referencją do Cart.
    4. Skasuj wszystkie produkty i koszyki w bazie, stwórz kupującego, następnie koszyk wraz
       z tym kupującym z użyciem metody create(), utwórz 3 produkty z create().
    5. Odczytaj produkty z bazy z wywołaniem populate dla cart, pokaż rezultat w konsoli. 
*/
import mongoose from "mongoose"; 

const url = "mongodb://127.0.0.1:27017/trainingdb";
mongoose.connect(url);


const buyerSchema = mongoose.Schema({
    name: String,
    surname: String
});
const Buyer = mongoose.model("Buyer", buyerSchema);

const cartSchema = mongoose.Schema({
    buyer: buyerSchema
});
const Cart = mongoose.model("Cart", cartSchema);

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    cart: {
        type: mongoose.Types.ObjectId,
        ref: "Cart"
    }
});
const Product = mongoose.model("Product", productSchema);

await Buyer.deleteMany({});
await Cart.deleteMany({});
await Product.deleteMany({});


const buyer1 = new Buyer({
    name: "Zuza", 
    surname: "Zuzińska"
});

const cart1 = await Cart.create({
    buyer: buyer1
});

const product1 = await Product.create({
    name: "Book #1",
    price: 50,
    cart: cart1
});

const product2 = await Product.create({
    name: "Telephone",
    price: 650,
    cart: cart1
});

const product3 = await Product.create({
    name: "Newspaper",
    price: 10,
    cart: cart1
});


const productDb = await Product.find({}).populate("cart");
console.log( JSON.stringify(productDb, null, 4) );




await mongoose.disconnect();










































