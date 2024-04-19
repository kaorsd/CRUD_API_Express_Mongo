import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {type: String, required: true},
        author: {type: String, required: true},
        genre: {type: String, required: true},
        publication_date: {type: String, required: true},
    }
)

export const Book = mongoose.model('Book', bookSchema);