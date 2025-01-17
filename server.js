const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize, connectDB } = require('./config/db'); // Import sequelize and connectDB correctly
const CaseDetails = require('./models/CaseDetails');
const Task = require('./models/Task');
const Document = require('./models/Document');
const Admin = require('./models/Admin'); // Make sure the path is correct
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('./models/User');

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();



const app = express();
const PORT = process.env.PORT || 5001;

// Ensure the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/uploads/*', (req, res) => {
  console.log('File requested:', req.path);
  res.send('File should be served');
});


// Setup file upload storage using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB file size
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
  },
});

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Connect to the Database
connectDB();

app.use('/api/users', require('./routes/userRoutes'));

// Define routes
app.use('/cases', require('./routes/caseRoutes'));

// POST - Create a new case
app.post('/cases', async (req, res) => {
  try {
    const caseDetails = await CaseDetails.create(req.body);
    res.status(201).json(caseDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get all cases
app.get('/cases', async (req, res) => {
  try {
    const cases = await CaseDetails.findAll();
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// GET - Fetch all users
app.get('/users', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();
    
    // Send the users data back in JSON format
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST - Create a new task
app.post('/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/documents', upload.single('file'), async (req, res) => {
  try {
    // Check if the file exists in the request
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Log the incoming request body
    console.log('Incoming request body:', req.body);

    // Create the document record in the database
    const document = await Document.create({
      name: req.body.documentName, // Assuming the name is 'documentName'
      path: `/uploads/${req.file.filename}`,
      clientname: req.body.clientname, // Assuming you're passing 'clientname'
      filetype: req.file.mimetype, // You can also include filetype
    });

    // Return success response
    res.status(201).json({
      message: 'File uploaded successfully',
      filePath: `/uploads/${req.file.filename}`,
      document,
    });
  } catch (error) {
    console.error('Error saving document to database:', error); // Log error details
    res.status(500).json({ error: error.message }); // Send back the error message to the client
  }
});
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Validate input data
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Respond with success
    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'An error occurred during registration.' });
  }
});


app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  console.log('Login request received:', req.body); // Log the received data for debugging

  try {
    // Search for the user by name
    const user = await User.findOne({ where: { name } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, name: user.name }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Admin Login request received:', req.body); // Log the received data for debugging

  try {
    // Search for the admin by email
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Admin login successful', token });
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});


// GET - Fetch all documents with proper URLs
app.get('/documents', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const documents = await Document.findAll({
      limit: parseInt(limit),
      offset: (page - 1) * limit,
    });

    const updatedDocuments = documents.map(doc => ({
      ...doc.toJSON(),
      path: `${req.protocol}://${req.get('host')}${doc.path}`,
    }));

    res.status(200).json(updatedDocuments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a case by ID
app.delete('/cases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCase = await CaseDetails.destroy({ where: { id } });

    if (!deletedCase) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.status(200).json({ message: 'Case deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params; // Extract user ID from the URL parameter

  try {
    const user = await User.findByPk(id); // Assuming Sequelize ORM is being used
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy(); // Delete the user from the database
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
