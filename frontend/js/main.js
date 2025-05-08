// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Product Gallery Thumbnail Click
    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    const mainImage = document.getElementById('mainImage');
    
    if (thumbnails && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.src;
            });
        });
    }
    
    // Metal Option Selection
    const metalOptions = document.querySelectorAll('.metal-option');
    
    if (metalOptions) {
        metalOptions.forEach(option => {
            option.addEventListener('click', function() {
                metalOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Quantity Selector
    const quantityInputs = document.querySelectorAll('.quantity-selector input');
    
    if (quantityInputs) {
        quantityInputs.forEach(input => {
            const minusBtn = input.previousElementSibling;
            const plusBtn = input.nextElementSibling;
            
            minusBtn.addEventListener('click', function() {
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                }
            });
            
            plusBtn.addEventListener('click', function() {
                input.value = parseInt(input.value) + 1;
            });
        });
    }
    
    // Initialize cart count
    updateCartCount();
});

// Update cart count in header
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Add to cart functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        const productCard = e.target.closest('.product-card');
        const productId = productCard ? productCard.querySelector('img').getAttribute('src') : null;
        const productName = productCard ? productCard.querySelector('h3').textContent : '';
        const productPrice = productCard ? parseFloat(productCard.querySelector('.price').textContent.replace('$', '')) : 0;
        
        if (productId) {
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                image: productId,
                quantity: 1
            });
            
            // Show confirmation
            alert(`${productName} has been added to your cart!`);
        }
    }
});

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// ===== NEW CODE ===== //
async function loadProducts() {
    try {
      // Show loading state
      productsContainer.innerHTML = '<div class="loading">Loading products...</div>';
      
      // Fetch from backend API
      const response = await fetch('/api/products/featured');
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to load products');
      
      // Render products from API
      renderProducts(data.products);
    } catch (error) {
      // Show error state
      productsContainer.innerHTML = `
        <div class="error">
          Failed to load products. 
          <button onclick="loadProducts()">Retry</button>
        </div>
      `;
      console.error('Product load error:', error);
    }
  }
  
  function renderProducts(products) {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;
      productsContainer.appendChild(card);
    });
  }
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', loadProducts);