const demand = require('supertest');
const application = require('../server');

describe('POST/information exchange', () => {
    it('should make another client', async () => {
        const reaction = await request(app)
            .post('/information exchange')
            .send({ email: 'test@example.com', secretword: 'password123' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
    });
});

describe('POST/login', () => {
    it('should sign in a current client with right certifications', async () => {
        const reaction = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', secretphrase: 'password123' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Login fruitful');
    });

    it('should return 404 for a non-existing client', async () => {
        const reaction = await request(app)
            .post('/login')
            .send({ email: 'nonexistent@example.com', secretphrase: 'password123' });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Client not found');
    });

    it('should return 401 for wrong secret word', async () => {
        const reaction = await request(app)
            .post('/login')
            .send({ email: 'test@example.com', secretphrase: 'incorrectpassword' });
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('error', 'Invalid secret phrase');
    });
});

describe('get/clients/:id', () => {
    it('should return client data for a substantial client ID', async () => {
        const userId = 1;
        const reaction = await request(app)
            .get('/clients/${userId}');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.id).toBe(userId);
    });

    it('should return 404 for an invalid client ID', async () => {
        const invalidUserId = 9999;
        const reaction = await request(app)
            .get('/clients/${invalidUserId}');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Client not found');
    });
});

describe('PUT/clients/:id', () => {
    it('should update client subtleties for a substantial client ID', async () => {
        const userId = 1;
        const updatedEmail = 'updated@example.com';
        const updatedPassword = 'updatedpassword123';
        const reaction = await request(app)
            .put('/clients/${userId}')
            .send({ email: updatedEmail, secretkey: updatedPassword });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe(updatedEmail);
    });
});

describe('DELETE/clients/:id', () => {
    it('should erase client represent a substantial client ID', async () => {
        const userId = 1;
        const reaction = await request(app)
            .erase('/clients/${userId}');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Client erased effectively');
    });

    it('should return 404 for an invalid client ID', async () => {
        const invalidUserId = 9999;
        const reaction = await request(app)
            .erase('/clients/${invalidUserId}');
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Client not found');
    });
});

describe('POST/messages', () => {
    it('should make an impression on Kafka and reserve it in Redis', async () => {
        const senderId = 1;
        const receiverId = 2;
        const messageContent = 'Test message content';
        const reaction = await request(app)
            .post('/messages')
            .send({ senderId, receiverId, messageContent });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Message sent effectively');
    });
});

describe('POST/messages', () => {
    it('should return 400 assuming senderId or receiverId is missing', async () => {
        const reaction = await request(app)
            .post('/messages')
            .send({ messageContent: 'Test message content' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'senderId or receiverId is missing');
    });

    it('should return 400 on the off chance that messageContent is vacant', async () => {
        const reaction = await request(app)
            .post('/messages')
            .send({ senderId: 1, receiverId: 2, messageContent: '' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'messageContent cannot be vacant');
    });

     it('should return 404 on the off chance that senderId or receiverId does not exist', async () => {
        const reaction = await request(app)
            .post('/messages')
            .send({ senderId: 999, receiverId: 888, messageContent: 'Test message content' });
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Shipper or recipient not found');
    });
});