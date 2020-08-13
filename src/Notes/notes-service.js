const NotesService = {
     getAllNotes(knex) {
          return knex
               .select('*')
               .from('notes')
     },
     getById(knex, id) {
          return knex
               .from('notes')
               .select('*')
               .where('id', id)
               .first()
     },
     getByFolderId(knex, id) {
          return knex('notes')
               .select('*')
               .where({ folderid: id });
     },

     createNote(knex, newNote) {
          return knex
               .insert(newNote)
               .into('notes')
               .returning('*')
               .then(rows => {
                    return rows[0];
               });
     },
     updateNote(knex, id, newNoteFields) {
          return knex('notes')
               .where({ id })
               .update(newNoteFields);
     },
     deleteNote(knex, id) {
          return knex('notes')
               .where({ id })
               .delete();
     }
};

module.exports = NotesService;