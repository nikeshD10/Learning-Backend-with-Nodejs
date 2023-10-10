const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({ where: { id: prodId } })
    .then((products) => {
      res.render("shop/product-detail", {
        product: products[0],
        pageTitle: products[0].title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
  // Product.findByPk(prodId)
  //   .then((product) => {
  //     res.render("shop/product-detail", {
  //       product: product,
  //       pageTitle: product.title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      // we need to create a new array of cart products
      // we need to loop through the products
      cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            path: "/cart",
            pageTitle: "Your Cart",
            products: products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));

  // Cart.getCart((cart) => {
  //   Product.findAll()
  //     .then((products) => {
  //       // we need to create a new array of cart products
  //       // we need to loop through the products
  //       const cartProducts = [];
  //       for (let product of products) {
  //         // we need to find the product in the cart
  //         const cartProductData = cart.products.find(
  //           (prod) => prod.id === product.id
  //         );
  //         // if we have a product in the cart
  //         if (cartProductData) {
  //           // we need to push the product to the cartProducts array
  //           cartProducts.push({
  //             productData: product,
  //             qty: cartProductData.qty,
  //           });
  //         }
  //       }
  //       res.render("shop/cart", {
  //         path: "/cart",
  //         pageTitle: "Your Cart",
  //         products: cartProducts,
  //       });
  //     })
  //     .catch((err) => console.log(err));
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId; // productId is the name of the input field in the form
  // Product.findByPk(prodId)
  //   .then((product) => {
  //     Cart.addProduct(prodId, product.price);
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      // retrieving single product which matches the prodId
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        // we need to increase the quantity of the product
        // This is also a magic method provided by sequelize but valid only for many to many relationship and inbetween tables
        newQuantity = product.cartItem.quantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      // magic method
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }, // setting the keys or fields that should be set in the intermediate table
      });
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId; // productId is the name of the input field in the form

  /* ------------ Approach 1 ------------ */
  // Product.findByPk(prodId)
  //   .then((product) => {
  //     Cart.deleteProduct(prodId, product.price);
  //     res.redirect("/cart");
  //   })
  //   .catch((err) => console.log(err));

  /* ------------ Approach 2 ------------ */
  req.user
    .getCart()
    .then((cart) => {
      // magic method
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      // we need to retrieve the product
      const product = products[0];
      // magic method
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  // fetch the cart
  let fetchedCart;

  // fetch the products from the cart and add them to the order
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      // magic method
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          // magic method
          return order.addProducts(
            products.map((product) => {
              // we need to add quantity to the product and it is also a magic method
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((product) => {
      return fetchedCart.setProducts(null); // magic method
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  // so what we are passing inside getOrders is
  // { include: ["products"] } is a sequelize object
  // it is saying when you fetch the orders then also fetch the products associated with the order

  req.user
    .getOrders({
      // magic method
      include: ["products"],
    })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    });
};
