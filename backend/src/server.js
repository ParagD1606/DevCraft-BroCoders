const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
