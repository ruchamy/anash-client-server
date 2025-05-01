require('dotenv').config();
const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const nodemailer = require('nodemailer');

const multer = require('multer');
const path = require('path');
const { start } = require('repl');

const app = express();
const PORT = 3000;
const CONTACTS_DATA_FILE = 'contacts.json';
const APPROVED_USERS_FILE = 'approvedUsers.json';
const MESSAGES_DATA_FILE = 'messages.json';
const ADS_DATA_FILE = 'ads.json';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
// אפשר לכל הדומיינים (למטרות פיתוח)
app.use(cors());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Helper function to read/write contacts JSON file 
const readContacts = () => {
  if (!fs.existsSync(CONTACTS_DATA_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(CONTACTS_DATA_FILE, 'utf-8'));
};

const writeContacts = (contacts) => {
  fs.writeFileSync(CONTACTS_DATA_FILE, JSON.stringify(contacts, null, 2));
};

//helper function to read/write approved users JSON file
const readApprovedUsers = () => {
  if (!fs.existsSync(APPROVED_USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(APPROVED_USERS_FILE, 'utf-8'));
};

const writeApprovedUsers = (users) => {
  fs.writeFileSync(APPROVED_USERS_FILE, JSON.stringify(users, null, 2));
};


// Helper function to read/write messages JSON file 
const readMessages = () => {
  if (!fs.existsSync(MESSAGES_DATA_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(MESSAGES_DATA_FILE, 'utf-8'));
};

const writeMessages = (messages) => {
  fs.writeFileSync(MESSAGES_DATA_FILE, JSON.stringify(messages, null, 2));
};

// Helper function to read/write ads JSON file
const readAds = () => {
  if (!fs.existsSync(ADS_DATA_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(ADS_DATA_FILE, 'utf-8'));
};
const writeAds = (ads) => {
  fs.writeFileSync(ADS_DATA_FILE, JSON.stringify(ads, null, 2));
}

// Configure the email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Replace with your SMTP server
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send an email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"קהיליין" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  }
  catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// CRUD Routes

// Get all contacts
app.get('/contacts', (req, res) => {
  const contacts = readContacts();
  res.json(contacts);
});

// Get a single contact by ID
app.get('/contacts/:id', (req, res) => {
  const contacts = readContacts();
  const contact = contacts.find((c) => c.id === req.params.id);
  if (!contact) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  res.json(contact);
});

// Create a new contact
app.post('/contacts', upload.single('profileImage'), (req, res) => {
  const contacts = readContacts();

  const newContact = {
    id: uuidv4(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    fathersName: req.body.fathersName,
    email: req.body.email,
    phone: req.body.phone,
    anotherPhone: req.body.anotherPhone,
    adress: {
      street: req.body.adress.street,
      hous: req.body.adress.hous,
      city: req.body.adress.city,
    },
    password: req.body.password,
    profileImage: req.file ? `/uploads/${req.file.filename}` : null,
  };
  console.log(newContact);

  contacts.push(newContact);
  writeContacts(contacts);

  // // Send an email to the new contact
  // sendEmail(newContact.email, 'Welcome to Our App', 'Thank you for joining our app!');  

  res.status(201).json(newContact);
});

// Update an existing contact
app.put('/contacts/:id', upload.single('profileImage'), (req, res) => {
  const contacts = readContacts();
  const contactIndex = contacts.findIndex((c) => c.id === req.params.id);
  if (contactIndex === -1) {
    return res.status(404).json({ message: 'Contact not found' });
  }
  //אם משתמש מעדכן תמונה, כדאי למחוק את התמונה הישנה מתיקיית ההעלאות:
  if (req.file && contacts[contactIndex].profileImage) {
    const oldPath = path.join(__dirname, contacts[contactIndex].profileImage);
    fs.unlinkSync(oldPath);
  }

  const updatedContact = {
    ...contacts[contactIndex],
    firstName: req.body.firstName || contacts[contactIndex].firstName,
    lastName: req.body.lastName || contacts[contactIndex].lastName,
    fathersName: req.body.fathersName || contacts[contactIndex].fathersName,
    email: req.body.email || contacts[contactIndex].email,
    phone: req.body.phone || contacts[contactIndex].phone,
    anotherPhone: req.body.anotherPhone || contacts[contactIndex].anotherPhone,
    adress: {
      street: req.body.adress?.street || contacts[contactIndex].adress.street,
      hous: req.body.adress?.hous || contacts[contactIndex].adress.hous,
      city: req.body.adress?.city || contacts[contactIndex].adress.city,
    },
    password: req.body.password || contacts[contactIndex].password,
    profileImage: req.file ? `/uploads/${req.file.filename}` : contacts[contactIndex].profileImage,

  };

  contacts[contactIndex] = updatedContact;
  writeContacts(contacts);
  res.json(updatedContact);
});

// Delete a contact
app.delete('/contacts/:id', (req, res) => {
  const contacts = readContacts();
  const contactIndex = contacts.findIndex((c) => c.id === req.params.id);
  if (contactIndex === -1) {
    return res.status(404).json({ message: 'Contact not found' });
  }

  const deletedContact = contacts.splice(contactIndex, 1)[0];
  if (deletedContact.profileImage) {
    fs.unlinkSync(path.join(__dirname, deletedContact.profileImage), err => {
      if (err)
        console.log('Failed to delete image:', err);
    });
  }
  // delete from aproved users if exists
  let approvedUsers = readApprovedUsers();
  approvedUsers = approvedUsers.filter(userId => userId !== deletedContact.id);
  writeApprovedUsers(approvedUsers);

  writeContacts(contacts);
  res.json(deletedContact);
});


// get all approved users
app.get('/approved-users', (req, res) => {
  const approvedUsers = readApprovedUsers();
  res.json(approvedUsers);
});

//approve a user
app.post('/approved-users', (req, res) => {
  const { id } = req.body;
  const approvedUsers = readApprovedUsers();

  if (!approvedUsers.includes(id)) {
    approvedUsers.push(id);
    writeApprovedUsers(approvedUsers);
  }

  res.json({ success: true, approvedUsers });
});

//unapprove a user
app.delete('/approved-users/:id', (req, res) => {
  const { id } = req.params;
  let approvedUsers = readApprovedUsers();
  approvedUsers = approvedUsers.filter(userId => userId !== id);
  writeApprovedUsers(approvedUsers);

  res.json({ success: true, approvedUsers });
});



// Admin login route
app.post('/admin-login', (req, res) => {
  const { password } = req.body;
  console.log("password: ", password);
  console.log("env: ", process.env.MANAGER_PASSWORD);
  if (password === process.env.MANAGER_PASSWORD) {
      res.json({ success: true, message: "Logged in as admin" });
  } else {
      res.status(401).json({ success: false, message: "Incorrect password" });
  }
});





//get all messages
app.get('/messages', (req, res) => {
  const messages = readMessages();
  res.json(messages);
});

//get a single message by ID
app.get('/messages/:id', (req, res) => {
  const messages = readMessages();
  const message = messages.find((m) => m.id === req.params.id);
  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }
  res.json(message);
});

//create a new message
app.post('/messages', upload.single('profileImage'), (req, res) => {
  const messages = readMessages();
  console.log("body: ", req.body);
  console.log("file: ", req.file);

  let content;
  try {
    content = JSON.parse(req.body.content); // הופך את המחרוזת לאובייקט
  } catch (error) {
    return res.status(400).json({ error: 'Invalid content format' });
  }
  const newMessage = {
    id: uuidv4(),
    userId: req.body.userId,
    status: 'unread',
    content,
  };

  if (content.subject === 'editProfile' && content.profileField === 'profilePicture') {
    newMessage.content.value = req.file ? `/uploads/${req.file.filename}` : null;
  }
  console.log("newMessage", newMessage);

  messages.push(newMessage);
  writeMessages(messages);
  res.status(201).json(newMessage);
});

//update a status of an existing message
app.put('/messages/:id', (req, res) => {
  console.log(req.body);

  const messages = readMessages();
  const messageIndex = messages.findIndex((m) => m.id === req.params.id);
  if (messageIndex === -1) {
    return res.status(404).json({ message: 'Message not found' });
  }
  const updatedMessage = {
    ...messages[messageIndex],
    status: req.body.status,
  };

  messages[messageIndex] = updatedMessage;
  writeMessages(messages);
  res.json(updatedMessage);
});

//delete a message
app.delete('/messages/:id', (req, res) => {
  const messages = readMessages();
  const messageIndex = messages.findIndex((m) => m.id === req.params.id);
  if (messageIndex === -1) {
    return res.status(404).json({ message: 'Message not found' });
  }
  const deletedMessage = messages.splice(messageIndex, 1)[0];
  if (deletedMessage.content.subject === 'editProfile' && deletedMessage.content.profileField === 'profilePicture') {
    fs.unlinkSync(path.join(__dirname, deletedMessage.content.value), err => {
      if (err)
        console.log('Failed to delete image:', err);
    });
  }
  writeMessages(messages);
  res.json(deletedMessage);
});


//get all ads
app.get('/ads', (req, res) => {
  const ads = readAds();
  res.json(ads);
});
//get a single ad by ID
app.get('/ads/:id', (req, res) => {
  const ads = readAds();
  const ad = ads.find((a) => a.id === req.params.id);
  if (!ad) {
    return res.status(404).json({ message: 'Ad not found' });
  }
  res.json(ad);
});

//create a new ad
app.post('/ads', upload.single('adImage'), (req, res) => {
  const ads = readAds();
  const newAd = {
    id: uuidv4(),
    status: req.body.status,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    link: req.body.Link,
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
  };
  ads.push(newAd);
  writeAds(ads);
  res.status(201).json(newAd);
});

//update an existing ad
app.put('/ads/:id', upload.single('adImage'), (req, res) => {
  const ads = readAds();
  const adIndex = ads.findIndex((a) => a.id === req.params.id);
  if (adIndex === -1) {
    return res.status(404).json({ message: 'Ad not found' });
  }
  //אם משתמש מעדכן תמונה, כדאי למחוק את התמונה הישנה מתיקיית ההעלאות:
  if (req.file && ads[adIndex].image) {
    const oldPath = path.join(__dirname, ads[adIndex].image);
    fs.unlinkSync(oldPath);
  }

  const updatedAd = {
    ...ads[adIndex],
    status: req.body.status || ads[adIndex].status,
    image: req.file ? `/uploads/${req.file.filename}` : ads[adIndex].image,
    link: req.body.Link || ads[adIndex].link,
    description: req.body.description || ads[adIndex].description,
    start_date: req.body.start_date || ads[adIndex].start_date,
    end_date: req.body.end_date || ads[adIndex].end_date,
  };

  ads[adIndex] = updatedAd;
  writeAds(ads);
  res.json(updatedAd);
});

//update an existing ad status
app.patch('/ads/:id/toggle', (req, res) => {
  const ads = readAds();
  const adIndex = ads.findIndex((a) => a.id === req.params.id);
  if (adIndex === -1) {
    return res.status(404).json({ message: 'Ad not found' });
  }
  const updatedAd = {
    ...ads[adIndex],
    status: ads[adIndex].status==="active" ? "inactive" : "active",
  };

  ads[adIndex] = updatedAd;
  writeAds(ads);
  res.json(updatedAd);
});

//delete an ad
app.delete('/ads/:id', (req, res) => {
  const ads =  readAds();
  const adIndex = ads.findIndex((a) => a.id === req.params.id);
  if (adIndex === -1) {
    return res.status(404).json({ message: 'Ad not found' , ads: ads, id: req.params.id});
  }
  const deletedAd = ads.splice(adIndex, 1)[0];
  if (deletedAd.image) {
    fs.unlinkSync(path.join(__dirname, deletedAd.image), err => {
      if (err)
        console.log('Failed to delete image:', err);
    });
  }
  writeAds(ads);
  res.json(deletedAd);
});

// Send an email
app.post('/send-email', async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'נא למלא את כל השדות' });
  }

  const emailResponse = await sendEmail(to, subject, message);
  if (emailResponse.success) {
    res.json({ success: true, message: 'האימייל נשלח בהצלחה!', messageId: emailResponse.messageId });
  } else {
    res.status(500).json({ success: false, error: emailResponse.error });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});














