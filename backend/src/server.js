const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const connectDB = require('./config/db');

const port = Number(process.env.PORT) || 5000;

connectDB();

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
