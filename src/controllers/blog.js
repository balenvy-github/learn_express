const { validationResult } = require("express-validator");
const BlogPost = require("../models/blog");
const path = require("path");
const fs = require("fs");

exports.createBlogPost = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const err = new Error("Input Value Tidak Sesuai");
    err.errorStatus = 400;
    err.data = error.array();

    throw err;
  }

  if (!req.file) {
    const err = new Error("Image Harus di Upload");
    err.errorStatus = 422;

    throw err;
  }

  const title = req.body.title;
  const body = req.body.body;
  const image = req.file.path;

  const Posting = new BlogPost({
    title: title,
    body: body,
    image: image,
    author: {
      uid: 1,
      name: "Author Name",
    },
  });

  Posting.save()
    .then((result) => {
      res.status(201).json({
        message: "Create Blog Post Success",
        data: result,
      });
    })
    .catch((err) => {
      console.log("error: ", err);
    });
};

exports.getAllBlogPost = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 5;
  let totalItems;

  BlogPost.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return BlogPost.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then((result) => {
      res.status(200).json({
        message: "Data berhasil dipanggil",
        data: result,
        total_data: totalItems,
        per_page: parseInt(perPage),
        current_page: parseInt(currentPage),
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getBlogPostById = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then((result) => {
      if (!result) {
        const error = new Error("Blog Post Tidak Ditemukan");
        error.errorStatus = 404;
        throw error;
      }
      res.status(200).json({
        message: "Data blog post berhasil dipanggil",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updatePostById = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const err = new Error("Input Value Tidak Sesuai");
    err.errorStatus = 400;
    err.data = error.array();

    throw err;
  }

  if (!req.file) {
    const err = new Error("Image Harus di Upload");
    err.errorStatus = 422;

    throw err;
  }

  const title = req.body.title;
  const body = req.body.body;
  const image = req.file.path;
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Blog Post Tidak Ditemukan");
        err.errorStatus = 404;
        throw err;
      }

      post.title = title;
      post.body = body;
      post.image = image;

      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Update Berhasil",
        data: result,
      });
    })
    .catch((error) => {
      next(error);
    });
};

exports.deleteBlogPost = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Blog Post Tidak Ditemukan");
        error.errorStatus = 404;
        throw error;
      }
      removeImage(post.image);
      return BlogPost.findByIdAndRemove(postId);
    })
    .then((result) => {
      res.status(200).json({
        message: "Hapus blog post berhasil",
        data: result,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const removeImage = (filePath) => {
  console.log("file path:", filePath);
  console.log("dirname:", __dirname);

  filePath = path.join(__dirname, "../..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
