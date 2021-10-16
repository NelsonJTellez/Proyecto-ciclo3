const express = require("express");
const book = require("../model/book");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/libros", async (request, response) => {
  let errors = [];
  try {
    let books = await book.find().lean();
    response.render("books/index", { books });
  } catch (error) {
    errors.push({ text: error });
    response.render("error", { errors });
  }
});

router.get("/libros/:id/editar", async (request, response) => {
  let errors = [];

  ValidarConexionBD;

  try {
    //Se obtiene la información del libro por id
    let data = await book.findById(request.params.id).lean();
    response.render("books/edit", { data });
  } catch (error) {
    errors.push({ text: "Error al obtener los datos de ba base de datos" });
    response.render("books/edit", { errors });
  }
});

router.post("/libros/:id/editar", async (request, response) => {
  let errors = [];
  const {titulo, autor, descripcion, genero} =   request.body;    
 
  try {
    await book.findByIdAndUpdate(request.params.id, { titulo, autor, descripcion, genero });
    response.redirect("/libros");
  } catch (error) {
    errors.push({ text: error });
    response.render("books/edit", { errors });
  }
});

router.delete("/libros/:id/borrar", async (request, response) => {
  try {
    //Se elimina el registro de la base de datos.
    await book.findByIdAndDelete(request.params.id);
    //Se redireciona al la principal de libros
    response.redirect("/libros");
  } catch (error) {
    response.render("error", { error });
  }
});

router.get("/libros/crear", (request, response) => {
  response.render("books/create");
});

router.post("/libros/crear", async function (request, response) {
  ValidarConexionBD();
  //Se crea un objto de tipo libro
  const newBook = new book({
    titulo: request.body.titulo,
    autor: request.body.autor,
    descripcion: request.body.descripcion,
    genero: request.body.genero,
  });

  try {
    //Se guarda el objeto en la base de datos.
    let data = await newBook.save();
    response.redirect("/libros");
  } catch (error) {
    response.render("error", { error });
  }
});

//TODO: falta revisar el patch, en el momento no esta entrando al método después de realizar la solictud

router.patch("libros/:id", async (request, response) => {
  try {
    //Se obtiene la información del libro en la base de datos
    const dbBook = await book.findById(request.params.id);

    //Se valida que los parametros que hayn enviado sean validos para actualizar
    if (request.params.autor != undefined) dbBook.autor = request.params.autor;

    if (request.params.titulo != undefined)
      dbBook.titulo = request.params.titulo;

    if (request.params.descripcion != undefined)
      dbBook.descripcion = request.params.descripcion;

    if (request.params.presentacion != undefined)
      dbBook.presentacion = request.params.presentacion;

    //Se guarda en la bd y se envia la respuesta
    reponse.json(await dbBook.save());
    response.status = 204;
  } catch (error) {
    response.render("error", { error });
  }
});

function ValidarConexionBD() {
  let errors = [];
  //Se valida que haya conección con la base de datso
  if (mongoose.connection.readyState != 1) {
    errors.push({ text: "No hay conexión con la base de datos." });
    response.render("books/edit", { errors });
  }
}

module.exports = router;
