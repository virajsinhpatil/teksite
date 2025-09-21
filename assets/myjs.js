let cart = [];

// Load cart from localStorage
window.onload = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cart = cart.filter(item => item && item.name && item.price && item.quantity);
        updateCartUI();
    }

    // Add click event to all product buttons
    const productButtons = document.querySelectorAll(".pro-btn");
    productButtons.forEach(button => {
        button.addEventListener("click", () => {
            const name = button.getAttribute("data-name");
            const price = parseInt(button.getAttribute("data-price"));

            addToCart(name, price);

            // Change button text when clicked
            button.textContent = "Added";
        });
    });

    // Checkout button redirect
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            window.location.href = "checkout.html";
        });
    }
};

// Add product to cart
function addToCart(name, price) {
    if (!name || !price) return;

    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    saveCart();
    updateCartUI();
}

// Remove product from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    updateCartUI();
}

// Update cart table and header count
function updateCartUI() {
    const cartItemsContainer = document.getElementById("cart-items");
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>₹${item.price}</td>
                <td>
                    <button class="quantity-btn decrease-btn" data-name="${item.name}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-name="${item.name}">+</button>
                </td>
                <td>₹${itemTotal}</td>
                <td><button class="remove-btn" data-name="${item.name}">Remove</button></td>
            `;
            cartItemsContainer.appendChild(row);
        });

        document.getElementById("cart-total").textContent = `Total: ₹${total}`;

        // Add remove button events
        const removeButtons = document.querySelectorAll(".remove-btn");
        removeButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const name = btn.getAttribute("data-name");
                removeFromCart(name);
            });
        });

        // Add quantity button events
        const decreaseButtons = document.querySelectorAll(".decrease-btn");
        decreaseButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const name = btn.getAttribute("data-name");
                const item = cart.find(i => i.name === name);
                if (item && item.quantity > 1) {
                    item.quantity -= 1;
                    saveCart();
                    updateCartUI();
                }
            });
        });

        const increaseButtons = document.querySelectorAll(".increase-btn");
        increaseButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const name = btn.getAttribute("data-name");
                const item = cart.find(i => i.name === name);
                if (item) {
                    item.quantity += 1;
                    saveCart();
                    updateCartUI();
                }
            });
        });
    }

    // Update header cart count
    const countElem = document.getElementById("cart-count");
    if (countElem) {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElem.textContent = totalCount;
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Load cart from localStorage and display in checkout page
 cart = JSON.parse(localStorage.getItem("cart")) || [];
const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");
const cartCount = document.getElementById("cart-count");

let total = 0;
if (checkoutItems) {
    checkoutItems.innerHTML = "";
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const li = document.createElement("li");
        li.textContent = `${item.name} x ${item.quantity} = ₹${itemTotal}`;
        checkoutItems.appendChild(li);
    });

    checkoutTotal.textContent = `Total: ₹${total}`;
}

// Update header cart count
if (cartCount) {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;
}

// Handle form submission
const form = document.getElementById("checkout-form");
if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        alert("Order placed successfully!");
        localStorage.removeItem("cart"); // clear cart
        window.location.href = "index.html"; // redirect to home
    });
}
