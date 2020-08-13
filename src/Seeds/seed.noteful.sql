TRUNCATE folders, notes RESTART IDENTITY CASCADE;

INSERT INTO folders (folder_name) 
VALUES
('Folder One'),
('Folder Two'),
('Folder Three');

INSERT INTO notes (note_name, content, date_modified, folderid)
VALUES 
('Note One', 'This is the first note.', '2018-08-15T23:00:00.000Z', 1),
('Note Two', 'This is the second note.', '2018-08-16T23:00:00.000Z', 2),
('Note Three', 'This is the third note.', '2018-08-17T23:00:00.000Z', 3);
