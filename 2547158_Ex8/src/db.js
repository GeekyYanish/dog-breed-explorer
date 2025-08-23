// Import required Node.js modules.
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Define the path to the database file.
const dbFile = path.join(__dirname, '..', 'data.db');
// Establish a connection to the SQLite database.
const db = new sqlite3.Database(dbFile);

// Promisified db.run() for executing SQL commands like INSERT, UPDATE, DELETE.
function run(sql, ...params) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
}

// Promisified db.all() for fetching all rows from a SELECT query.
function all(sql, ...params) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
}

// Promisified db.get() for fetching a single row from a SELECT query.
function get(sql, ...params) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
}

// Export the database utility functions for use in other parts of the application.
module.exports = { db, run, all, get };