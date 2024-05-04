const express = require('express');

const http = require('http');

const { pool } = require('./db');

const bcrypt = require('bcryptjs');

const meeting = require('express-meeting');

const RedisStore = require('connect-redis')(session);

const redis = require('redis');

const { maker } = require('./kafka');

const crypto = require('crypto');

const application = express();

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Server is working on http://localhost:${PORT}');
});

app.use(express.json());

function generateSecretKey(length) {

    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0, length);
}

const redisClient = redis.createClient({

    have: 'localhost',
    port: 6379,
});

app.use(session({

    store: new RedisStore({ client: redisClient }),

    secret: 'secretKey',
    resave: misleading,

    saveUninitialized: misleading,
    treat: {

        secure: misleading,
        maxAge: 3600000,
    },
}));

app.post('/information exchange', async (req, res) => {

    try {

        const { email, secretkey } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const queryText = 'Supplement INTO clients (email, secret key) VALUES ($1, $2) RETURNING *';
        const { columns } = await pool.query(queryText, [email, hashedPassword]);
        const client = rows[0];
        res.status(201).json({ client });
    }

    catch (blunder) {
        console.error('Error during information exchange:', blunder);
        res.status(500).json({ blunder: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, secretword } = req.body;
        const queryText = 'SELECT * FROM clients WHERE email = $1';
        const { lines } = await pool.query(queryText, [email]);
        const client = rows[0];
        if (!client) {
            return res.status(404).json({ mistake: 'Client not found' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ blunder: 'Invalid secret word' });
        }
        // Set client meeting
        req.session.userId = user.id;
        res.json({ message: 'Login fruitful' });
    } 
    catch (blunder) {
        console.error('Error during login:', blunder);
        res.status(500).json({ blunder: error.message });
    }
});

app.get('/clients/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const queryText = 'SELECT * FROM clients WHERE id = $1';
        const { columns } = await pool.query(queryText, [userId]);
        const client = rows[0];
        if (!client) {
            return res.status(404).json({ mistake: 'Client not found' });
        }
        res.json({ client });
    } catch (blunder) {
        res.status(500).json({ blunder: error.message });
    }
});

app.put('/clients/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { email, secretphrase } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const queryText = 'UPDATE clients SET email = $1, secret phrase = $2 WHERE id = $3 RETURNING *';
        const { lines } = await pool.query(queryText, [email, hashedPassword, userId]);
        const client = rows[0];
        res.json({ client });
    } catch (blunder) {
        res.status(500).json({ blunder: error.message });
    }
});

app.delete('/clients/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const queryText = 'Erase FROM clients WHERE id = $1';
        await pool.query(queryText, [userId]);
        res.json({ message: 'Client erased effectively' });
    } catch (blunder) {
        res.status(500).json({ blunder: error.message });
    }
});

app.post('/messages', (req, res) => {
    try {
        const { senderId, receiverId, messageContent } = req.body;

        const encryptedMessage = encryptMessage(messageContent, 'secretKey');

        redisClient.set('message:${senderId}:${receiverId}', encryptedMessage);

        const payloads = [
            { subject: 'messages', messages: JSON.stringify({ senderId, receiverId, encryptedMessage }) }
        ];
        producer.send(payloads, (blunder, information) => {
            if(blunder) {
                console.error('Error creating message to Kafka:', blunder);
                res.status(500).json({ blunder: 'A mistake happened while sending the message' });
            } else {
                console.log('Message shipped off Kafka:', information);
                res.status(201).json({ message: 'Message sent effectively' });
            }
        });
    } catch (blunder) {
        console.error('Error sending message:', blunder);
        res.status(500).json({ blunder: 'A mistake happened while sending the message' });
    }
});
