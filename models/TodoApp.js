const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({ //create schema for the database table
    title: String,
    description: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Todo', TodoSchema);