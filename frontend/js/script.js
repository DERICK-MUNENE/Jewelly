// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const productsContainer = document.getElementById('productsContainer');
const cartCount = document.getElementById('cartCount');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const closeModalBtns = document.querySelectorAll('.close-modal');

// Sample product data
const products = [
    {
        id: 1,
        title: "Eternal Diamond Pendant",
        price: 1299.00,
        image: "images/diamond-pendant.jpg",
        category: "necklaces"
    },
    {
        id: 2,
        title: "Classic Pearl Strand",
        price: 899.00,
        image: "images/pearl-necklace.jpg",
        category: "necklaces"
    },
    {
        id: 3,
        title: "Golden Embrace Choker",
        price: 750.00,
        image: "images/gold-choker.jpg",
        category: "necklaces"
    },
    {
        id: 4,
        title: "Sapphire Dream Necklace",
        price: 1150.00,
        image: "images/sapphire-necklace.jpg",
        category: "necklaces"
    },
    {
        id: 5,
        title: "Silver Moonstone Ring",
        price: 450.00,
        image: "images/moonstone-ring.jpg",
        category: "rings"
    },
    {
        id: 6,
        title: "Diamond Stud Earrings",
        price: 980.00,
        image: "images/diamond-earrings.jpg",
        category: "earrings"
    }
];

// Cart data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
    
    // Check if user is logged in
    if (localStorage.getItem('currentUser')) {
        document.querySelector('.fa-user').classList.add('logged-in');
    }
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Search functionality
searchBtn.addEventListener('click', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        const results = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );
        
        displaySearchResults(results);
    }
});

searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
    
    // Live search
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm.length > 2) {
        const results = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );
        
        displaySearchResults(results);
    } else {
        searchResults.style.display = 'none';
    }
});

function displaySearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
    } else {
        results.forEach(product => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <span>${product.title} - $${product.price.toFixed(2)}</span>
            `;
            item.addEventListener('click', () => {
                window.location.href = `product-detail.html?id=${product.id}`;
            });
            searchResults.appendChild(item);
        });
    }
    
    searchResults.style.display = 'block';
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});

// Render products
function renderProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        if (product.category === 'necklaces') {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}" class="product-img">
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `;
            productsContainer.appendChild(productCard);
        }
    });
    
    // Add event listeners to add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show confirmation
    alert(`${product.title} has been added to your cart!`);
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Modal functionality
document.querySelector('.fa-user').addEventListener('click', (e) => {
    if (localStorage.getItem('currentUser')) {
        // User is logged in, go to account page
        window.location.href = 'account.html';
    } else {
        // Show login modal
        e.preventDefault();
        loginModal.style.display = 'block';
    }
});

showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    registerModal.style.display = 'block';
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'none';
    loginModal.style.display = 'block';
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});