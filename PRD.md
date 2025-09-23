# Payment Simulator – PRD

## 1. Project Overview
A lightweight **Payment Simulator** built using HTML, CSS, and JavaScript.  
The project mimics a simple Razorpay/NPCI checkout flow.  
It allows users to simulate payment success or failure via API calls and shows transaction result pages accordingly.  

---

## 2. Objectives
- Create a frontend-only project that looks like a payment checkout system.  
- Provide a basic **checkout → payment → result** flow.  
- Enable simulated API calls to demonstrate **success** or **failure** scenarios.  

---

## 3. User Flow
1. **Checkout Page (`checkout.html`)**
   - User clicks **“Pay Now”**.  
   - Redirects to payment simulation page.  

2. **Payment Page (`payment.html`)**
   - Shows **2 buttons**:  
     - ✅ Success → calls `/api/success`  
     - ❌ Failure → calls `/api/failure`  

3. **Transaction Pages**
   - If **Success API** → Redirect to `transaction-success.html` with message: *“Transaction Successful ✅”*  
   - If **Failure API** → Redirect to `transaction-failed.html` with message: *“Transaction Failed ❌”*  

---

## 4. Key Features
- Razorpay-style **checkout UI** (minimal).  
- API calls simulated with JavaScript `fetch()` or `console.log`.  
- Separate pages for:  
  - Checkout  
  - Payment (Success/Failure)  
  - Transaction Success  
  - Transaction Failed  

---

## 5. Technical Requirements
- **Frontend:** HTML, CSS, Vanilla JavaScript  
- **Pages Required:**
  1. `checkout.html`  
  2. `payment.html`  
  3. `transaction-success.html`  
  4. `transaction-failed.html`  
- **Mock APIs:**  
  - `/api/success` → returns `{status: "success", message: "Payment Successful"}`  
  - `/api/failure` → returns `{status: "failed", message: "Payment Failed"}`  

---

## 6. Out of Scope
- No real payment gateway integration (Razorpay, PayTM, NPCI).  
- No backend database storage.  
- No user authentication.  

---

## 7. Deliverables
- Functional HTML/CSS/JS project simulating a payment flow.  
- Clean, minimal UI inspired by Razorpay checkout.  
