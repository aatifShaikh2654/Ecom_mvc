const { app } = require('./app');
const db = require('./db/mongo');
const prisma = require('./db/prisma');
require('dotenv').config({ path: './.env' });

const PORT = process.env.PORT || 8000;


db();
app.listen(PORT, async () => {  
    console.log(`Server is listening on ${PORT}`)
})