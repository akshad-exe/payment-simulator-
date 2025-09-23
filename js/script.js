// Base API URL
const API_BASE_URL = 'https://payment-simulator-2.onrender.com';

// Function to navigate from landing page to checkout
function proceedToCheckout() {
    window.location.href = 'checkout.html';
}

// Function to navigate from checkout to payment simulation
function proceedToPayment() {
    window.location.href = 'payment.html';
}

// Function to simulate payment (success or failure) using the external API
function simulatePayment(isSuccess) {
    // Show processing indicator
    document.getElementById('processing').style.display = 'block';
    
    // Create transaction first
    const transactionData = {
        amount: 4560.00,
        sender_upi_id: "user@upi",
        receiver_upi_id: "merchant@upi",
        sender_name: "John Doe",
        receiver_name: "Merchant Account",
        sender_phone: "+919876543210",
        receiver_phone: "+919876543211"
    };
    
    // Use fetch with error handling
    fetch(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Transaction created:', data);
        if (data.id) {
            // Update transaction status based on isSuccess parameter
            const status = isSuccess ? 'success' : 'failed';
            return fetch(`${API_BASE_URL}/${data.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: status })
            });
        } else {
            throw new Error('Failed to create transaction');
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Status updated:', data);
        // Simulate API delay
        setTimeout(() => {
            if (isSuccess) {
                window.location.href = 'transaction-success.html';
            } else {
                window.location.href = 'transaction-failed.html';
            }
        }, 1500);
    })
    .catch(error => {
        console.error('Error in transaction process:', error);
        // Even if API fails, we still redirect to show the result
        setTimeout(() => {
            if (isSuccess) {
                window.location.href = 'transaction-success.html';
            } else {
                window.location.href = 'transaction-failed.html';
            }
        }, 1500);
    });
}

// Function to go back to checkout from success page
function goToCheckout() {
    window.location.href = 'checkout.html';
}

// Function to retry payment from failure page
function retryPayment() {
    window.location.href = 'payment.html';
}

// Function to go back to landing page
function goToLanding() {
    window.location.href = 'index.html';
}