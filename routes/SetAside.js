const setAside = require('express').Router();
const { getAllRecords, createNewRecord, deleteRecord } = require('../database');

setAside.route('/setAside')
.get(async (req, res) => res.send(await getAllRecords()))
.post((req, res) => createNewRecord(req.body));

// Handling Delete SetAside Record Request (Deletes the Specified Record by the User from database)
setAside.delete('/setAside/:id', (req, res) => {
    deleteRecord(parseInt(req.params.id));
    res.send(JSON.stringify('Deleted Sucessfully!'));
})


module.exports = setAside;