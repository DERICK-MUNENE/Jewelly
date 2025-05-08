// Checkout Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Form Validation
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    
    if (shippingForm) {
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const isValid = validateForm(this);
            if (isValid) {
                // Save shipping info
                const shippingInfo = {
                    name: this.querySelector('#full-name').value,
                    email: this.querySelector('#email').value,
                    address: this.querySelector('#address').value,
                    city: this.querySelector('#city').value,
                    zip: this.querySelector('#zip').value,
                    country: this.querySelector('#country').value,
                    phone: this.querySelector('#phone').value
                };
                
                localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
                
                // Proceed to payment
                window.location.href = 'checkout-payment.html';
            }
        });
    }
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const isValid = validateForm(this);
            if (isValid) {
                // Process payment
                processPayment();
            }
        });
    }
    
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        // Special validation for credit card
        const cardNumber = form.querySelector('#card-number');
        if (cardNumber && !validateCreditCard(cardNumber.value)) {
            cardNumber.classList.add('error');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateCreditCard(number) {
        // Simple validation - real app would use proper validation
        return number.replace(/\s/g, '').length === 16;
    }
    
    function processPayment() {
        // In a real app, this would interface with payment processor
        // For demo, we'll simulate a successful payment
        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo'));
        const paymentInfo = {
            method: document.querySelector('input[name="payment-method"]:checked').value,
            cardLast4: document.getElementById('card-number').value.slice(-4)
        };
        
        // Create order
        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: cart,
            shipping: shippingInfo,
            payment: paymentInfo,
            status: 'Processing'
        };
        
        // Save order to user's account if logged in
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            currentUser.orders = currentUser.orders || [];
            currentUser.orders.push(order);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update users array
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Redirect to confirmation
        window.location.href = `order-confirmation.html?orderId=${order.id}`;
    }
    
    // Load saved shipping info if available
    if (shippingForm) {
        const savedInfo = JSON.parse(localStorage.getItem('shippingInfo'));
        if (savedInfo) {
            Object.keys(savedInfo).forEach(key => {
                const field = shippingForm.querySelector(`#${key}`);
                if (field) field.value = savedInfo[key];
            });
        }
    }
});