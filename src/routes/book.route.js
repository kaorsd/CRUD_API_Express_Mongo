import express from 'express';

const router = express.Router();

import { Book } from '../models/book.model.js';

//const Book = require ('../book.model.js')


//MIDDLEWARE (elegir una opcion del getbook)
// const getBook = async (req, res, next) => {
//     try {
//         const book = await Book.findById(req.params.id);
//         if (!book) {
//             return res.status(404).send('El libro no fue encontrado');
//         }
//         res.book = book;
//         next();
//     } catch {
//         return res.status(500).send('Error al buscar el libro');
//     }
// }

const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json(
            {
                message: 'El ID del libro no es válido'
            }
        )
    }

    try {
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json(
                {
                    message: 'El libro no fue encontrado'
                }
            )
        }

    } catch (error) {
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }

    res.book = book;
    next()
}

// Obtener todos los libros [GET ALL]
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET ALL', books)
        if (books.length === 0) {
            return res.status(204).json([])
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Crear un nuevo libro (recurso) [POST]
router.post('/', async (req, res) => {
    const book = new Book(req.body);
  
    try {
      const newBook = await book.save();
      res.status(201).json(newBook);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});


//obtener un libro por id
router.get('/:id', getBook, async (req, res) => {
    res.json(res.book);
})

// router.put('/:id', getBook, async (req, res) => {
//     try {
//         const book = res.book
//         book.title = req.body.title || book.title;
//         book.author = req.body.author || book.author;
//         book.genre = req.body.genre || book.genre;
//         book.publication_date = req.body.publication_date || book.publication_date;

//         const updatedBook = await book.save()
//         res.json(updatedBook)
//     } catch (error) {
//         res.status(400).json({
//             message: error.message
//         })
//     }
// })

//editar un libro, el metodo de arriba es lo mismo pero menos conciso que este
router.put('/:id', getBook, async (req, res) => {
    const updates = { 
        title: '', 
        author: '', 
        genre: '', 
        publication_date: null 
    };
    Object.assign(updates, req.body);
    res.book.set(updates);
    try {
        const updatedBook = await res.book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



router.patch('/:id', getBook, async (req, res) => {
    res.book.set(req.body);
    try {
        const updatedBook = await res.book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.delete('/:id', getBook, async (req, res) => {
    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        });
        res.json({
            message: `El libro ${book.title} fue eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})


export default router


