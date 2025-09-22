const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3001;

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } //В разработке можно использовать http
}));

// Тестовый администратор
const adminUser = {
    username: 'admin',
    password: 'password'
};

//MongoDA Connection
const mongoURI = 'mongodb+srv://db:123321@jefim.j2jifmk.mongodb.net/db?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//Mongoose Schema and Model
const menuSchema = new mongoose.Schema({
    img: String,
    altimg: String,
    title: String,
    descr: String,
    price: Number
});

const MenuItem = mongoose.model('MenuItem', menuSchema, 'menu');

const requestSchema = new mongoose.Schema({
    name: String,
    phone: String
});

//Function to seed the database
const seedDatabase = async () => {
    try {
        const count = await MenuItem.countDocuments();
        if (count === 0) {
            console.log('No data found in menu collection. Seeding database...');
            const data = fs.readFileSync('db.json', 'utf-8');
            const json = JSON.parse(data);
            await MenuItem.insertMany(json.menu);
            console.log('Database seeded successfully.');
        } else {
            console.log('Menu collection already contains data. Skipping seed.');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

const Request = mongoose.model('Request', requestSchema);

// Middleware для проверки аутентификации
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

// Маршрут для входа
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === adminUser.username && pasword === adminUser.password) {
        req.session.user = adminUser;
        req.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

// Маршрут для выхода
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).send('Logout successful');
});

// Маршрут для проверки статуса сеанса
app.get('/session-status', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ loggedIn: true });
    } else {
        res.status(200).json({ loggedIn: false });
    }
});

// Маршрут для админ панели
app.get('/admin', isAuthentificated, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/admin.html'));
});

// API Routes
app.post('/requests', async (req, res) => {
    try {
        const newRequest = new Request(req.body);
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/menu', isAuthentificated, async (req, res) => {
    try {
        const newItem = new MenuItem(req.nody);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/menu/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const updateItem = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updateItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/menu/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const updatedItem = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedItem); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Start the server and seed database
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    seedDatabase();
});