# NPCI Payment Simulator

A lightweight NPCI-like payment simulator built using HTML, CSS, JavaScript. This project mimics a simple Razorpay/NPCI checkout flow with integration to an external API.

## Features

- Complete payment flow simulation: Landing → Checkout → Payment → Transaction Result
- Integration with external API for transaction creation and status updates
- Responsive Razorpay-style UI with modern design elements
- Mock success/failure API endpoints
- User customizable details (name, phone, UPI ID)
- Adjustable payment amounts
- Comprehensive HTTP error handling and simulation
- Production-like error workflows

## Project Structure

```
├── index.html          # Landing page
├── checkout.html       # Checkout page with order details
├── payment.html        # Payment simulation page
├── transaction-success.html  # Success result page
├── transaction-failed.html   # Failure result page
├── error-testing.html  # Error simulation page
├── style.css           # Styles for all pages
├── script.js           # Client-side JavaScript with API integration
├── test-api.html       # API testing page
├── package.json        # Project metadata and scripts
└── api-simulation.json # Postman collection for API testing
```

## External API Endpoints

The frontend integrates with the following external API endpoints hosted at `https://payment-simulator-2.onrender.com/`:

1. **POST /** - Create a new transaction
   - Creates a new payment transaction with the provided details
   - Returns transaction ID and details

2. **PUT /:id/status** - Update transaction status
   - Updates the status of a transaction (success/failed)
   - Requires transaction ID in the URL

3. **GET /:id** - Get transaction details
   - Retrieves the details of a specific transaction

4. **GET /api/success** - Mock success API
   - Returns success response for payment simulation

5. **GET /api/failure** - Mock failure API
   - Returns failure response for payment simulation

## Getting Started

Since this is a frontend-only project, you can run it in any web server or directly open the HTML files in a browser.

### Option 1: Using a local web server
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run serve
   ```
   or
   ```bash
   npm start
   ```
3. Open your browser and navigate to `http://localhost:8080`

### Option 2: Direct browser access
1. Open `index.html` directly in your browser
2. Note: Some browsers may block API requests when using the `file://` protocol

## How to Use

1. Open the landing page
2. Click "Proceed to Checkout"
3. Review order details on the checkout page
4. Update payment amount if needed
5. Enter your personal details (name, phone, UPI ID)
6. Choose a payment method or scan QR code
7. On the payment page, select either "Simulate Success" or "Simulate Failure"
8. View the transaction result on the success or failure page

## Error Testing

The simulator includes comprehensive error handling that mimics real-world payment systems:
- Network errors
- Timeout errors
- HTTP status code errors (4xx, 5xx)
- API-specific error responses

To test error scenarios, use the "Error Testing" link on the checkout page.

## Testing APIs

You can test the API integration using the provided test page (`test-api.html`) or with curl:

### Create Transaction
```bash
curl -X POST https://payment-simulator-2.onrender.com/ \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25000.50,
    "sender_upi_id": "sender@upi",
    "receiver_upi_id": "mule@upi",
    "sender_name": "John Doe",
    "receiver_name": "Mule Account",
    "sender_phone": "+919876543210",
    "receiver_phone": "+919876543211"
  }'
```

### Update Transaction Status
```bash
curl -X PUT https://payment-simulator-2.onrender.com/TRANSACTION_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "success"}'
```

## Customization

You can customize the payment flow by modifying:
- `style.css` for visual changes
- `script.js` for client-side behavior and API integration

## Deployment

### Vercel Deployment

This project is ready to be deployed on Vercel. Follow these steps:

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com/) and sign up or log in
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project settings:
   - Framework Preset: Other
   - Root Directory: Leave empty
   - Build Command: `echo 'No build step required'`
   - Output Directory: Leave empty
6. Click "Deploy"
7. Your site will be live within minutes!

The `vercel.json` file in the project includes necessary rewrite rules and CORS headers for proper functionality.

## Available Scripts

- `npm start` - Start the development server
- `npm run serve` - Serve the static files locally
- `npm run build` - Build command for deployment (no build step required)
- `npm run test` - Run tests (no tests configured)
- `npm run deploy` - Deployment readiness check

## License

This project is open source and available under the MIT License.