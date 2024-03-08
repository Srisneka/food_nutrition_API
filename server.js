const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const Schema = mongoose.Schema;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/food-nutrition-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

const foodSchema = new Schema({
    food_item_name: { type: String, required: true },
    food_group: { type: String, required: true },
    description: String,
    ingredients: { type: [String], required: true },
    serving_size: { type: String, required: true },
    certifications: { type: [String], required: true },
    health_benefits: { type: [String], required: true },
    country_of_origin: { type: String, required: true },
    preparation_methods: { type: [String], required: true },
    dietary_restrictions: { type: [String], required: true },
    brand_or_manufacturer: { type: String, required: true },
    nutritional_information: {
        fat: { type: Number, required: true },
        fiber: { type: Number, required: true },
        protein: { type: Number, required: true },
        calories: { type: Number, required: true },
        carbohydrates: { type: Number, required: true }
    }
});

module.exports = mongoose.model('Food', foodSchema);

const Food = mongoose.model('Food', foodSchema);

app.post('/foods', async (req, res) => {
    try {
        const food = new Food(req.body);
        const newFood = await food.save();
        res.status(201).json(newFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.get('/foods', async (req, res) => {
    try {
        const foods = await Food.find();
        res.json(foods);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/foods/:id', async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.json(food);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/foods/:food_item_name', async (req, res) => {
    try {
        const food = await Food.findOne({ food_item_name: req.params.food_item_name });
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.json(food);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.put('/foods/:id', async (req, res) => {
    try {
        const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFood) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.json(updatedFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/foods/:food_item_name', async (req, res) => {
    try {
        const updatedFood = await Food.findOneAndUpdate(
            { food_item_name: req.params.food_item_name },
            req.body,
            { new: true }
        );
        if (!updatedFood) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.json(updatedFood);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


app.delete('/foods/:id', async (req, res) => {
    try {
        const deletedFood = await Food.findByIdAndDelete(req.params.id);
        if (!deletedFood) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.json({ message: 'Food item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete('/foods/:food_item_name', async (req, res) => {
    try {
        const deletedFood = await Food.findOneAndDelete({ food_item_name: req.params.food_item_name });
        if (!deletedFood) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.json({ message: 'Food item deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
