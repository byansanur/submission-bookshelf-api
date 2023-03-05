const {
    healthCheck,
    addBook,
    getListBook,
    getBookById,
    editBookById,
    deleteBookById
} = require('./handlers')

const routes = [
    {
        method:'GET',
        path:'/health-check',
        handler: healthCheck
    },
    {
        method: 'POST',
        path: '/books',
        handler: addBook
    },
    {
        method: 'GET',
        path: '/books',
        handler: getListBook
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookById
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBookById,
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookById,
    },
]

module.exports = routes