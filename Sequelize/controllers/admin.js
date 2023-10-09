const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // we have alternative also which sequelize provide for associations. Since user has many products sequalize provides
  // method to create product under user. It will automatically create the userId field in the product table

  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });

  /*      ---------------------- Alternative ---------------------- */
  // Product.create({
  //   title: title,
  //   price: price,
  //   imageUrl: imageUrl,
  //   description: description,
  //   userId: req.user.id, // we are getting the user from the request object
  // })
  //   .then((result) => {
  //     console.log("Created Product");
  //     res.redirect("/admin/products");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.getEditProduct = (req, res, next) => {
  // we are trying to access query param in the url i.e http://localhost:3000/admin/edit-product/0?edit=true
  // so below extracted value always is a string. So "true" instead of true.

  const editMode = req.query.edit;
  // if editMode is not equal to true then we simply redirect
  // if editMode is equal to true then we continue
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      // if we don't have a product then we redirect
      if (!product) {
        return res.redirect("/");
      }
      // if we have a product then we render the edit-product page
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  // extract the id of the product we want to edit
  const prodId = req.body.productId;
  // extract the updated values
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  // find the product by id
  Product.findByPk(prodId)
    .then((product) => {
      // update the product
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      // save the product. It updates the product if it exists or creates a new one if it doesn't exist
      return product.save(); // return the promise
    })
    .then((result) => {
      // now from returned promise we are accessing the then block
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy(); // returns the promise
    })
    .then((result) => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
