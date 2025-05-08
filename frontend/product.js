// Products Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter Products
    const categoryFilter = document.getElementById('filter-category');
    const priceFilter = document.getElementById('filter-price');
    const productCards = document.querySelectorAll('.product-card');
    
    if (categoryFilter && priceFilter) {
        categoryFilter.addEventListener('change', filterProducts);
        priceFilter.addEventListener('change', filterProducts);
    }
    
    function filterProducts() {
        const categoryValue = categoryFilter.value;
        const priceValue = priceFilter.value;
        
        productCards.forEach(card => {
            const cardCategory = card.dataset.category || 'all';
            const cardPrice = parseFloat(card.querySelector('.price').textContent.replace('$', '').replace(',', ''));
            
            // Category filter
            const categoryMatch = categoryValue === 'all' || cardCategory === categoryValue;
            
            // Price filter
            let priceMatch = true;
            if (priceValue !== 'all') {
                const [min, max] = priceValue.split('-');
                if (max) {
                    priceMatch = cardPrice >= parseFloat(min) && cardPrice <= parseFloat(max);
                } else {
                    priceMatch = cardPrice >= parseFloat(min.replace('+', ''));
                }
            }
            
            // Show/hide based on filters
            if (categoryMatch && priceMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Add to Cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            const productLink = productCard.querySelector('a');
            const productId = productLink.getAttribute('href').split('=')[1];
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
            const productImage = productCard.querySelector('img').src;
            
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
            
            alert(`${productName} has been added to your cart!`);
        }
    });
    
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(count => {
            count.textContent = totalItems;
        });
    }
});