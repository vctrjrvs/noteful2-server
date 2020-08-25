const express = require('express');
const xss = require('xss');
const path = require('path');

const NotesService = require('./notes-service')

const notesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
     id: note.id,
     note_name: note.note_name,
     content: xss(note.content),
     folderid: note.folderid
})

notesRouter
     .route('/')
     .get((req, res, next) => {
          const knexInstance = req.app.get('db');
          NotesService.getAllNotes(knexInstance)
               .then(notes => {
                    res.json(notes.map(serializeNote));
               })
               .catch(next);
     })

     .post(jsonParser, (req, res, next) => {
          const { note_name, content, date_modified, folderid } = req.body
          const newNote = { note_name, content, date_modified, folderid }

          for (const [key, value] of Object.entries(newNote)) {
               if (value === null) {
                    return res
                         .status(400)
                         .json({
                              error: { message: `Missing ${key} is required` }
                         });
               }
          }
          NotesService.createNote(req.app.get('db'), newNote)
               .then(note => {
                    res
                         .status(201)
                         .location(path.posix.join(req.originalUrl, `/${note.id}`))
                         .json(serializeNote(note))
               })
               .catch(next);

     });

notesRouter
     .route('/:id')
     .all((req, res, next) => {
          NotesService.getById(req.app.get('db'), req.params.id)
               .then(note => {
                    if (!note) {
                         return res.status(404).json({
                              error: { message: 'Note does not exist.' }
                         });
                    }
                    res.note = note;
                    next();
               })
               .catch(next);
     })
     .get((req, res, next) => {
          res.json(serializeNote(res.note));
     })
     .patch(jsonParser, (req, res, next) => {
          const { note_name, content, folderid } = req.body;
          const noteToUpdate = { note_name, content, folderid };

          const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
          if (numberOfValues == 0) {
               return res.status(400).json({
                    error: { message: `Request body must contain 'note_name', 'content', and 'folderid.` }
               });
          }
          NotesService.updateNote(req.app.get('db'), req.params.id, noteToUpdate)
               .then(numRowsAffected => {
                    res.status(204).end()
               })
               .catch(next);
     })
     .delete((req, res, next) => {
          NotesService.deleteNote(req.app.get('db'), req.params.id)
               .then(numRowsAffected => {
                    res.status(204).end()
               })
               .catch(next)
     });

module.exports = notesRouter;