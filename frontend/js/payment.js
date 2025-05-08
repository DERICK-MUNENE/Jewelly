// This would be in checkout.html
document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentForm');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (!currentUser) {
        alert('Please login to proceed to checkout');
        window.location.href = 'account.html';
        return;
    }
    
    if (cart.length === 0) {
        alert('Your cart is empty');
        window.location.href = 'index.html';
        return;
    }
    
    // Populate user info
    document.getElementById('name').value = currentUser.name || '';
    document.getElementById('email').value = currentUser.email || '';
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('orderTotal').textContent = `$${total.toFixed(2)}`;
    
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // In a real app, you would process payment here
        // This is just a simulation
        
        const cardNumber = document.getElementById('cardNumber').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardNumber || !expiry || !cvv) {
            alert('Please fill in all payment details');
            return;
        }
        
        // Simple validation
        if (cardNumber.replace(/\s/g, '').length !== 16) {
            alert('Please enter a valid card number');
            return;
        }
        
        // Create order
        const order = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: [...cart],
            total,
            shippingAddress: document.getElementById('address').value,
            paymentMethod: 'Credit Card',
            status: 'Processing'
        };
        
        // Save order to user's account
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex].orders.push(order);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
        }
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Redirect to confirmation page
        window.location.href = `order-confirmation.html?orderId=${order.id}`;
    });
});