const { nanoid } = require('nanoid')
const books = require('./books')

const healthCheck = (request, h) => {
    const response = h.response({
        status: 'Ok',
        message: 'Health check Ok!'
    })
    response.code(200)
    return response
}

const addBook = (request, h) => {

    // req body
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload

    const id = nanoid(16)
    const finished = pageCount === readPage
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    // temp added book
    const addedBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    }

    if (typeof name === 'undefined') {
        const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
    
        response.code(400)
        return response
    }

    if (readPage > pageCount) {
        const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
    
        response.code(400)
        return response
    }

    books.push(addedBook)

    const isSuccess = books.filter((book) => book.id === id).length > 0

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        })
    
        response.code(201)
        return response
    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    })

    response.code(500)
    return response
}

const getListBook = (request, h) => {
   
    // optional query parameters
    const {
        name,
        publisher,
        reading,
        finished
    } = request.query

    if (books.length === 0) {
        const response = h.response({
            status: 'success',
            data: {
                books: [],
            },
        })
        response.code(200)
        return response
    }

    let filterBook = books

    if (typeof name !== 'undefined') {
        filterBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    }

    if (typeof publisher !== 'undefined') {
        filterBook = books.filter((book) => book.publisher.toLowerCase().includes(publisher.toLowerCase()))
    }

    if (typeof reading !== 'undefined') {
        filterBook = books.filter((book) => Number(book.reading) === Number(reading))
    }

    if (typeof finished !== 'undefined') {
        filterBook = books.filter((book) => Number(book.finished) === Number(finished))
    }

    const listBook = filterBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
    }))

    const response = h.response({
        status: 'success',
        data: {
            books: listBook,
        },
    })

    response.code(200)
    return response
}

const getBookById = (request, h) => {

    // mandatory path param
    const { bookId } = request.params

    const book = books.filter((n) => n.id === bookId)[0]

    if (typeof book !== 'undefined') {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        })
    
        response.code(200)
        return response
    }
    
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    })
    
    response.code(404)
    return response
}

const editBookById = (request, h) => {
   
    // mandatory path param
    const { bookId } = request.params

    // req body
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload

    const updatedAt = new Date().toISOString()
    const index = books.findIndex((book) => book.id === bookId)

    if (typeof name === 'undefined') {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })

        response.code(400)
        return response
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })

        response.code(400)
        return response
    }

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        })

        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })

    response.code(404)
    return response
}

const deleteBookById = (request, h) => {

    // mandatory path param
    const { bookId } = request.params
  
    const index = books.findIndex((book) => book.id === bookId)
  
    if (index !== -1) {
        books.splice(index, 1)
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        })
  
        response.code(200)
        return response
    }
  
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
  
    response.code(404)
    return response
}

module.exports = {
    healthCheck,
    addBook,
    getListBook,
    getBookById,
    editBookById,
    deleteBookById
}