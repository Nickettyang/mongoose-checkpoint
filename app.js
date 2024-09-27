// app.js
const mongoose = require("mongoose");

// Connect to the local MongoDB server
mongoose
  .connect("mongodb://localhost:27017/myLocalDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the Person schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: { type: [String] },
});

// Create the Person model
const Person = mongoose.model("Person", personSchema);

// Example function to perform database operations
async function run() {
  try {
    // Create and save a single person
    const person = new Person({
      name: "John Doe",
      age: 30,
      favoriteFoods: ["Pizza", "Burgers"],
    });
    await person.save();
    console.log("Saved person:", person);

    // Create multiple records
    const arrayOfPeople = [
      { name: "Mary", age: 25, favoriteFoods: ["Sushi", "Pasta"] },
      { name: "Mike", age: 35, favoriteFoods: ["Steak"] },
    ];
    await Person.create(arrayOfPeople);
    console.log("Saved multiple people.");

    // Find all people named 'John Doe'
    const johns = await Person.find({ name: "John Doe" });
    console.log("Found John(s):", johns);

    // Find one person who likes 'Pizza'
    const pizzaLover = await Person.findOne({ favoriteFoods: "Pizza" });
    console.log("Pizza lover:", pizzaLover);

    // Find a person by ID
    const foundPerson = await Person.findById(person._id);
    console.log("Found person by ID:", foundPerson);

    // Update person's favorite foods
    foundPerson.favoriteFoods.push("Hamburger");
    await foundPerson.save();
    console.log("Updated person:", foundPerson);

    // Update a person by name
    const updatedMary = await Person.findOneAndUpdate(
      { name: "Mary" },
      { age: 20 },
      { new: true }
    );
    console.log("Updated Mary:", updatedMary);

    // Delete a person by ID
    await Person.findByIdAndRemove(person._id);
    console.log("Deleted person with ID:", person._id);

    // Delete all people named 'Mary'
    await Person.deleteMany({ name: "Mary" });
    console.log("Deleted all people named Mary.");

    // Find people who like 'Burritos'
    const burritoLovers = await Person.find({ favoriteFoods: "Burritos" })
      .sort({ name: 1 })
      .limit(2)
      .select("-age")
      .exec();
    console.log("Burrito lovers:", burritoLovers);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
run();
