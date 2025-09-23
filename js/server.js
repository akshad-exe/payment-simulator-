const http = require('http');
const url = require('url');
const fs = require('fs');

// Simple in-memory storage for transactions
let transactions = {};

// Function to generate a random transaction ID
function generateTransactionId() {
    return Math.random().toString(36).substring(2, 15).toUpperCase();
}

// Function to handle CORS headers
function setCORSHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Function to parse request body
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                resolve(body);
            }
        });
        req.on('error', reject);
    });
}

// Create server
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    console.log(`${method} ${path}`);

    // Handle CORS preflight requests
    if (method === 'OPTIONS') {
        setCORSHeaders(res);
        res.writeHead(200);
        res.end();
        return;
    }

    // Handle POST / - Create transaction
    if (method === 'POST' && path === '/') {
        setCORSHeaders(res);
        try {
            const body = await parseBody(req);
            
            // Create new transaction
            const transactionId = generateTransactionId();
            const transaction = {
                id: transactionId,
                amount: body.amount,
                sender_upi_id: body.sender_upi_id,
                receiver_upi_id: body.receiver_upi_id,
                sender_name: body.sender_name,
                receiver_name: body.receiver_name,
                sender_phone: body.sender_phone,
                receiver_phone: body.receiver_phone,
                status: 'pending',
                created_at: new Date().toISOString()
            };
            
            transactions[transactionId] = transaction;
            
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'success',
                message: 'Transaction created successfully',
                transaction_id: transactionId,
                data: transaction
            }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'error',
                message: 'Invalid request body'
            }));
        }
        return;
    }

    // Handle PUT /:id/status - Update transaction status
    if (method === 'PUT' && path.match(/^\/[A-Z0-9]+\/status$/)) {
        setCORSHeaders(res);
        try {
            const transactionId = path.split('/')[1];
            const body = await parseBody(req);
            
            // Check if transaction exists
            if (!transactions[transactionId]) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: 'error',
                    message: 'Transaction not found'
                }));
                return;
            }
            
            // Update transaction status
            transactions[transactionId].status = body.status;
            transactions[transactionId].updated_at = new Date().toISOString();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'success',
                message: 'Transaction status updated successfully',
                data: transactions[transactionId]
            }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'error',
                message: 'Invalid request body'
            }));
        }
        return;
    }

    // Handle GET /:id - Get transaction details
    if (method === 'GET' && path.match(/^\/[A-Z0-9]+$/)) {
        setCORSHeaders(res);
        const transactionId = path.substring(1);
        
        // Check if transaction exists
        if (!transactions[transactionId]) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'error',
                message: 'Transaction not found'
            }));
            return;
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'success',
            data: transactions[transactionId]
        }));
        return;
    }

    // Handle GET /api/success - Mock success API
    if (method === 'GET' && path === '/api/success') {
        setCORSHeaders(res);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: "success",
            message: "Payment Successful"
        }));
        return;
    }

    // Handle GET /api/failure - Mock failure API
    if (method === 'GET' && path === '/api/failure') {
        setCORSHeaders(res);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: "failed",
            message: "Payment Failed"
        }));
        return;
    }

    // Serve static files for all other requests
    const filePath = path === '/' ? '/index.html' : path;
    const absolutePath = __dirname + filePath;
    
    fs.readFile(absolutePath, (err, data) => {
        if (err) {
            setCORSHeaders(res);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'error',
                message: 'File not found'
            }));
        } else {
            setCORSHeaders(res);
            const ext = filePath.split('.').pop();
            const contentType = {
                'html': 'text/html',
                'css': 'text/css',
                'js': 'application/javascript',
                'json': 'application/json'
            }[ext] || 'text/plain';
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Payment simulation server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  POST / - Create transaction');
    console.log('  PUT /:id/status - Update transaction status');
    console.log('  GET /:id - Get transaction details');
    console.log('  GET /api/success - Mock success API');
    console.log('  GET /api/failure - Mock failure API');
});