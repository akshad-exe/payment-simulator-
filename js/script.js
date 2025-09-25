// Base API URL
const API_BASE_URL = 'https://payment-simulator-2.onrender.com';

// Function to wake up the backend API
function wakeUpBackend() {
    fetch(API_BASE_URL)
        .then(response => {
            console.log('Backend wake-up request sent. Status:', response.status);
        })
        .catch(error => {
            console.log('Backend wake-up request failed (this is normal):', error.message);
        });
}

// Function to navigate from landing page to checkout
function proceedToCheckout() {
    window.location.href = 'checkout.html';
}

// Function to navigate from checkout to payment simulation
function proceedToPayment() {
    window.location.href = 'payment.html';
}

// Utility function to handle fetch with timeout
function fetchWithTimeout(url, options, timeout = 10000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
}

// Function to simulate payment (success or failure) using the external API
function simulatePayment(isSuccess) {
    // Show processing indicator
    document.getElementById('processing').style.display = 'block';
    
    // Get user details from localStorage or use defaults
    const senderName = localStorage.getItem('senderName') || "John Doe";
    const senderPhone = localStorage.getItem('senderPhone') || "+919876543210";
    const senderUpi = localStorage.getItem('senderUpi') || "user@upi";
    const paymentAmount = localStorage.getItem('paymentAmount') || "4560.00";
    
    console.log('simulatePayment called with isSuccess:', isSuccess);
    console.log('User details:', { senderName, senderPhone, senderUpi, paymentAmount });
    
    // Create transaction first
    const transactionData = {
        amount: parseFloat(paymentAmount),
        sender_upi_id: senderUpi,
        receiver_upi_id: "merchant@upi",
        sender_name: senderName,
        receiver_name: "Merchant Account",
        sender_phone: senderPhone,
        receiver_phone: "+919876543211"
    };
    
    console.log('Sending transaction data:', transactionData);
    
    // Use fetch with comprehensive error handling and timeout
    fetchWithTimeout(`${API_BASE_URL}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData)
    }, 10000) // 10 second timeout
    .then(response => {
        console.log('Transaction creation response:', response);
        console.log('Response status:', response.status);
        console.log('Response OK:', response.ok);
        
        // Handle different HTTP status codes
        if (response.status === 400) {
            throw new Error('Bad Request: Invalid transaction data');
        } else if (response.status === 401) {
            throw new Error('Unauthorized: Authentication required');
        } else if (response.status === 403) {
            throw new Error('Forbidden: Access denied');
        } else if (response.status === 404) {
            throw new Error('Not Found: API endpoint not found');
        } else if (response.status === 408) {
            throw new Error('Request Timeout: Server timed out waiting for the request');
        } else if (response.status === 429) {
            throw new Error('Too Many Requests: Rate limit exceeded');
        } else if (response.status >= 500) {
            throw new Error(`Server Error: ${response.status} - ${response.statusText}`);
        } else if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Transaction created:', data);
        if (data && data.id) {
            // Update transaction status based on isSuccess parameter
            const status = isSuccess ? 'success' : 'failed';
            console.log('Updating transaction status to:', status);
            return fetchWithTimeout(`${API_BASE_URL}/${data.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: status })
            }, 10000); // 10 second timeout
        } else {
            throw new Error('Failed to create transaction: Invalid response from server');
        }
    })
    .then(response => {
        console.log('Status update response:', response);
        console.log('Response status:', response.status);
        console.log('Response OK:', response.ok);
        
        // Handle different HTTP status codes for status update
        if (response.status === 400) {
            throw new Error('Bad Request: Invalid status update data');
        } else if (response.status === 401) {
            throw new Error('Unauthorized: Authentication required for status update');
        } else if (response.status === 403) {
            throw new Error('Forbidden: Access denied for status update');
        } else if (response.status === 404) {
            throw new Error('Not Found: Transaction not found');
        } else if (response.status === 409) {
            throw new Error('Conflict: Transaction status cannot be updated');
        } else if (response.status === 429) {
            throw new Error('Too Many Requests: Rate limit exceeded for status update');
        } else if (response.status >= 500) {
            throw new Error(`Server Error: ${response.status} - ${response.statusText} during status update`);
        } else if (!response.ok) {
            throw new Error(`HTTP error during status update! status: ${response.status} - ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Status updated:', data);
        // Simulate API delay
        setTimeout(() => {
            if (isSuccess) {
                console.log('Redirecting to success page');
                window.location.href = 'transaction-success.html';
            } else {
                console.log('Redirecting to failure page');
                window.location.href = 'transaction-failed.html';
            }
        }, 1500);
    })
    .catch(error => {
        console.error('Error in transaction process:', error);
        // Store error details in sessionStorage to display on failure page
        sessionStorage.setItem('transactionError', error.message);
        // For production-like behavior, we'll show failure for any error
        setTimeout(() => {
            window.location.href = 'transaction-failed.html';
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

// Wake up the backend when script loads
wakeUpBackend();