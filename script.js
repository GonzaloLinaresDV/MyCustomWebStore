/////////// CONFIGURACION DE NOMBRE Y LOGO DE LLA PAGINA  ///////////


   const STORE_CONFIG = {  /////   SE PIDE AL CLIENTE UN NOMBRE Y UN LOGO!!!!!!!!!!  //////
    name: "My Shop",
    logo: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=150" // URL de tu imagen o logo
};

const ADMIN_CREDENTIALS = { user: "admin", pass: "admin123" };
/////////// JSON BASICO DE EJEMPLO  ///////////
let products = JSON.parse(localStorage.getItem('store_products')) || [
    { id: 1, name: "Zapatillas Urbanas Pro", category: "Calzado", price: 79.99, stock: 15, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400" },
    { id: 2, name: "Mochila Executiva Impermeable", category: "Accesorios", price: 49.50, stock: 8, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400" },
    { id: 3, name: "Reloj Minimalista de Cuero", category: "Relojes", price: 120.00, stock: 5, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400" },
    { id: 4, name: "Auriculares Inalámbricos ANC", category: "Tecnología", price: 89.99, stock: 12, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" }
];

let cart = [];
let currentCategory = 'todos';
let isAdminLoggedIn = false;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('brand-name').textContent = STORE_CONFIG.name;
    document.getElementById('brand-logo').src = STORE_CONFIG.logo;
    document.getElementById('footer-brand-name').textContent = STORE_CONFIG.name;
    document.title = STORE_CONFIG.name;

    renderCategories();
    renderProducts();
    updateCartCount();
});

function saveProducts() {
    localStorage.setItem('store_products', JSON.stringify(products));
}

function renderCategories() {
    const categoriesContainer = document.getElementById('category-filters');
    const categories = ['todos', ...new Set(products.map(p => p.category))];
    
    categoriesContainer.innerHTML = categories.map(cat => `
        <button onclick="filterCategory('${cat}')" 
            class="cat-btn px-4 py-2.5 rounded-xl text-sm font-semibold transition ${currentCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}">
            ${cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
    `).join('');
}

function filterCategory(category) {
    currentCategory = category;
    renderCategories();
    renderProducts();
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    const filtered = products.filter(p => {
        const matchesCategory = currentCategory === 'todos' || p.category.toLowerCase() === currentCategory.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-16 text-center text-slate-400">
                <i class="fa-solid fa-box-open text-4xl mb-3"></i>
                <p class="text-lg font-medium">No se encontraron productos</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <div class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition border border-slate-100 overflow-hidden flex flex-col justify-between group">
            <div class="relative overflow-hidden bg-slate-100 h-52">
                <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    ${p.category}
                </span>
            </div>
            <div class="p-5 flex flex-col flex-grow justify-between">
                <div>
                    <h3 class="font-bold text-slate-900 text-base mb-1 line-clamp-1">${p.name}</h3>
                    <div class="flex items-center justify-between mt-2 mb-4">
                        <span class="text-xl font-extrabold text-indigo-600">$${p.price.toFixed(2)}</span>
                        <span class="text-xs font-semibold px-2.5 py-1 rounded-lg ${p.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}">
                            ${p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}
                        </span>
                    </div>
                </div>
                <button onclick="addToCart(${p.id})" ${p.stock === 0 ? 'disabled' : ''} 
                    class="w-full py-3 px-4 rounded-xl font-bold text-sm shadow-sm transition flex items-center justify-center gap-2 ${p.stock > 0 ? 'bg-slate-900 hover:bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}">
                    <i class="fa-solid fa-cart-plus"></i> ${p.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                </button>
            </div>
        </div>
    `).join('');
}

function filterProducts() {
    renderProducts();
}

   ///////////  CARRITO DE COMPRAS Y CHECKOUT  ///////////

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('hidden');
    if (!sidebar.classList.contains('hidden')) {
        renderCartItems();
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
        } else {
            alert('No hay más stock disponible para este producto.');
            return;
        }
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartCount();
    toggleCart();
}

function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-badge').textContent = totalCount;
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-16 text-slate-400">
                <i class="fa-solid fa-cart-arrow-down text-4xl mb-3"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        document.getElementById('cart-total').textContent = '$0.00';
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl shadow-sm">
            <div class="flex-1 ml-4">
                <h4 class="font-bold text-slate-900 text-sm line-clamp-1">${item.name}</h4>
                <p class="text-indigo-600 font-semibold text-sm">$${item.price.toFixed(2)}</p>
                <div class="flex items-center gap-2 mt-1">
                    <button onclick="updateQuantity(${item.id}, -1)" class="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-100">-</button>
                    <span class="text-sm font-semibold">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center hover:bg-slate-100">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-slate-400 hover:text-rose-500 p-2 transition">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    const product = products.find(p => p.id === productId);
    if (!item) return;

    const newQty = item.quantity + change;
    if (newQty > 0 && newQty <= product.stock) {
        item.quantity = newQty;
    } else if (newQty > product.stock) {
        alert('Stock máximo alcanzado.');
    } else {
        removeFromCart(productId);
    }
    updateCartCount();
    renderCartItems();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartCount();
    renderCartItems();
}

function checkout() {
    if (cart.length === 0) return;

    cart.forEach(cartItem => {
        const prod = products.find(p => p.id === cartItem.id);
        if (prod) {
            prod.stock -= cartItem.quantity;
            if (prod.stock < 0) prod.stock = 0;
        }
    });

    saveProducts();
    renderProducts();
    
    alert('¡Compra realizada con éxito! El inventario ha sido actualizado.');
    cart = [];
    updateCartCount();
    toggleCart();
}

   /////////// PANEL DE ADMINISTRACIÓN Y AUTENTICACIÓN  ///////////

function openAdminModal() {
    if (!isAdminLoggedIn) {
        document.getElementById('login-modal').classList.remove('hidden');
    } else {
        document.getElementById('admin-modal').classList.remove('hidden');
        renderAdminProducts();
    }
}

function closeLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
}

function closeAdminModal() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;

    if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass) {
        isAdminLoggedIn = true;
        closeLoginModal();
        document.getElementById('admin-user').value = '';
        document.getElementById('admin-pass').value = '';
        openAdminModal();
    } else {
        alert('Usuario o contraseña incorrectos.');
    }
}

function renderAdminProducts() {
    const tbody = document.getElementById('admin-products-table');
    tbody.innerHTML = products.map(p => `
        <tr class="hover:bg-slate-50 transition">
            <td class="p-4 flex items-center gap-3">
                <img src="${p.image}" class="w-10 h-10 object-cover rounded-xl shadow-sm" alt="">
                <span class="font-bold text-slate-900">${p.name}</span>
            </td>
            <td class="p-4 text-slate-600">${p.category}</td>
            <td class="p-4 font-semibold text-slate-900">$${p.price.toFixed(2)}</td>
            <td class="p-4">
                <span class="px-2.5 py-1 rounded-lg text-xs font-bold ${p.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}">
                    ${p.stock} un.
                </span>
            </td>
            <td class="p-4">
                <div class="flex items-center justify-center gap-2">
                    <button onclick="adjustPrice(${p.id}, -5)" title="Bajar $5" class="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 font-bold text-xs">-$5</button>
                    <button onclick="adjustPrice(${p.id}, 5)" title="Subir $5" class="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 font-bold text-xs">+$5</button>
                    <button onclick="adjustStock(${p.id}, -1)" title="Restar Stock" class="w-7 h-7 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold">-</button>
                    <button onclick="adjustStock(${p.id}, 1)" title="Sumar Stock" class="w-7 h-7 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold">+</button>
                </div>
            </td>
            <td class="p-4 text-center">
                <button onclick="deleteProduct(${p.id})" class="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function addProduct(event) {
    event.preventDefault();
    const name = document.getElementById('new-name').value;
    const category = document.getElementById('new-category').value;
    const price = parseFloat(document.getElementById('new-price').value);
    const stock = parseInt(document.getElementById('new-stock').value);
    const image = document.getElementById('new-image').value;

    const newProduct = {
        id: Date.now(),
        name,
        category,
        price,
        stock,
        image
    };

    products.push(newProduct);
    saveProducts();
    renderProducts();
    renderCategories();
    renderAdminProducts();
    event.target.reset();
    alert('¡Producto agregado con éxito!');
}

function adjustPrice(productId, amount) {
    const p = products.find(prod => prod.id === productId);
    if (p) {
        p.price = Math.max(0, p.price + amount);
        saveProducts();
        renderProducts();
        renderAdminProducts();
    }
}

function adjustStock(productId, amount) {
    const p = products.find(prod => prod.id === productId);
    if (p) {
        p.stock = Math.max(0, p.stock + amount);
        saveProducts();
        renderProducts();
        renderAdminProducts();
    }
}

function deleteProduct(productId) {
    if (confirm('¿Estás seguro de eliminar este producto de la tienda?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        renderProducts();
        renderCategories();
        renderAdminProducts();
    }
}