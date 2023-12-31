const Product = require("../models/product");
const Order = require("../models/order");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      // We are checking if the order exists.
      if (!order) {
        return next(new Error("No order found."));
      }
      // We are checking if the user is authorized to view the invoice.
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = "invoice-" + orderId + ".pdf";
      // three params are : first data folder then invoices folder then invoice file name
      const invoicePath = path.join("data", "invoices", invoiceName);

      // This is creating a pdf file
      const pdfDoc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=" + invoiceName);
      // This is actually a readable stream.
      // so we can pipe it to a writable stream.
      // We are creating a writable stream here.
      // calling fs.createWriteStream() ensures pdf genereated is also stored in server not just served to client
      pdfDoc.pipe(fs.createWriteStream(invoicePath)); // This is writing the data to the file.

      // want to return to client
      pdfDoc.pipe(res);

      // Now whatever I add to doc will be forwared to fs.createWriteStream() and then to the file.
      pdfDoc.fontSize(26).text("Invoice", {
        // text allows us to add single line of text to the pdf
        underline: true,
      });

      pdfDoc.text("-----------------------");
      let totalPrice = 0;
      // We are looping through the products and adding them to the pdf.
      order.products.forEach((prod) => {
        // We are calculating the total price of the order.
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " x " +
              "$" +
              prod.product.price
          );
      });

      pdfDoc.text("---");
      pdfDoc.fontSize(20).text("Total Price: $" + totalPrice);

      pdfDoc.end();

      // ------------------------- Learning 1 ways of preloading data--------------------------
      // This is preloading the data into the memory and then sending it to the client.
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      // We are setting headers to tell the browser what kind of file we are sending.
      // res.setHeader("Content-Type", "application/pdf");
      // inline will open the pdf in the browser
      // res.setHeader(
      //   "Content-Disposition",
      //   "inline; filename='" + invoiceName + "'"
      // );

      // attachment will download the pdf
      // res.setHeader(
      //   "Content-Disposition",
      //   "attachement; filename=" + invoiceName
      // );

      // res.send(data);
      // });
      // -------------------------Learning 2 ways of streaming data--------------------------
      // This is streaming data
      // Using this node never has to preload the data into the memory.
      // But just streams it to the client on fly.
      // Only chunk node has to work with is chunk of data that is currently being read in the buffer
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader("Content-Disposition", "inline; filename=" + invoiceName);
      // file.pipe(res); // To forward the data that is read in read stream to the response write stream.
    })
    .catch((err) => next(err));
};
