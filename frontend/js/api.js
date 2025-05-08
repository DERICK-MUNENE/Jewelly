class API {
    constructor() {
        this.baseUrl = '/api'; // Change if your API is on a different domain
    }

    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include' // For session/cookie auth
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Request failed');
            }

            return responseData;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth methods
    async login(email, password) {
        return this.request('/auth/login', 'POST', { email, password });
    }

    async register(name, email, password) {
        return this.request('/auth/register', 'POST', { name, email, password });
    }

    async logout() {
        return this.request('/auth/logout', 'POST');
    }

    // Product methods
    async getProducts(category = null, limit = 10, offset = 0) {
        let endpoint = '/products';
        if (category) endpoint += `?category=${category}&limit=${limit}&offset=${offset}`;
        return this.request(endpoint);
    }

    async getFeaturedProducts() {
        return this.request('/products?category=featured');
    }

    async searchProducts(query) {
        return this.request(`/products/search/${encodeURIComponent(query)}`);
    }

    // Cart methods
    async getCart() {
        return this.request('/cart');
    }

    async addToCart(productId, quantity = 1) {
        return this.request('/cart/add', 'POST', { product_id: productId, quantity });
    }

    async updateCartItem(productId, quantity) {
        return this.request('/cart/update', 'PUT', { product_id: productId, quantity });
    }

    async removeFromCart(productId) {
        return this.request('/cart/remove', 'DELETE', { product_id: productId });
    }

    // Order methods
    async createOrder(orderData) {
        return this.request('/orders/create', 'POST', orderData);
    }

    async getOrders() {
        return this.request('/orders');
    }
}

const api = new API();
export default api;