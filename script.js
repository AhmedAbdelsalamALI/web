
document.addEventListener("DOMContentLoaded", function () {
    
    let cart = [];
    
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            let name = this.getAttribute("data-name");
            let price = parseFloat(this.getAttribute("data-price"));
            cart.push({ name, price });
            updateCart();
        });
    });

    function updateCart() {
        let cartItems = document.getElementById("cart-items");
        let total = 0;

        cartItems.innerHTML = "";
        cart.forEach((item, index) => {
            total += item.price;
            cartItems.innerHTML += `<li>${item.name} - $${item.price} <button onclick="removeFromCart(${index})">❌</button></li>`;
        });

        document.getElementById("cart-total").textContent = total;
    }

    window.removeFromCart = function (index) {
        cart.splice(index, 1);
        updateCart();
    };

    document.getElementById("clear-cart").addEventListener("click", function () {
        cart = [];
        updateCart();
    });
});
function checkout() {
    if (cart.length === 0) {
     alert("Your cart is empty!");
    } else {
     alert("Order placed successfully!");
     clearCart();
   }
 }
 
 
