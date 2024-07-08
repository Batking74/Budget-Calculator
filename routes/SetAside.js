// Importing Modules/Packages
const { getAllRecords, createNewRecord, deleteRecord } = require('../database');
const setAside = require('express').Router();

setAside.route('/api/setAside')
.get(async (req, res) => res.send(await getAllRecords()))
.post((req, res) => createNewRecord(req.body));

// Handling Delete SetAside Record Request (Deletes the Specified Record by the User from database)
setAside.delete('/api/setAside/:id', (req, res) => {
    deleteRecord(parseInt(req.params.id));
    res.send(JSON.stringify('Deleted Successfully!'));
})

// Exporting Module
module.exports = setAside;