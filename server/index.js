require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//const authRouter = require('./routes/auth')
const taskRouter = require('./routes/tasks')

const app = express();
app.use(express.json());

app.use(cors({ 
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    exposedHeaders: ['Authorization']
 }));

const PORT = process.env.PORT;
const MONGO = process.env.MONGO_URI;

//connect
mongoose.connect(MONGO)
    .then(() => console.log('Mongo connected'))
    .catch(err => { console.error(err); process.exit(1); });

//Simple route
app.get('/', (req, res) => res.send('API running'));

app.use('/api/tasks', taskRouter);
//app.use('/api/auth', authRoutes);

// example task route (you'll replace with actual model later)
// app.get('/api/tasks', (req, res) => {
//     res.json([{ id: 1, title: 'Sample task', completed: false }]);
// });

app.listen(PORT, () => console.log(`Server running on ${PORT}`));