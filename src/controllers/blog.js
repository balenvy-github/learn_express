const { validationResult } = require("express-validator");

exports.createBlogPost = (req, res, next) => {
  const title = req.body.title;
  const body = req.body.body;

  const error = validationResult(req);

  if (!error.isEmpty()) {
    const err = new Error("Input Value Tidak Sesuai");
    err.errorStatus = 400;
    err.data = error.array();

    throw err;
  }

  const result = {
    message: "Create Blog Post Success",
    data: {
      post_id: 1,
      title: title,
      image: "image.png",
      body: body,
      created_at: "12/10/2020",
      author: {
        uid: 1,
        name: "testing",
      },
    },
  };
  res.status(201).json({
    result,
  });
};
