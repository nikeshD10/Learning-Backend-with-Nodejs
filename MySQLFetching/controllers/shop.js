const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId; // productId is the name of the route parameter in url
  Product.findById(prodId, (product) => {
    res.render("shop/product-detail", {
      product: product, // product is a property of the response object
      pageTitle: product.title, // title is a property of the product object
      path: "/products", // path is used to set the active class in the header
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll()
      .then(([rows]) => {
        // we need to create a new array of cart products
        // we need to loop through the products
        const cartProducts = [];
        for (let product of rows) {
          // we need to find the product in the cart
          const cartProductData = cart.products.find(
            (prod) => prod.id === product.id
          );
          // if we have a product in the cart
          if (cartProductData) {
            // we need to push the product to the cartProducts array
            cartProducts.push({
              productData: product,
              qty: cartProductData.qty,
            });
          }
        }
        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: cartProducts,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId; // productId is the name of the input field in the form
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId; // productId is the name of the input field in the form
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
