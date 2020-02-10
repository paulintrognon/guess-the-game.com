/**
 * THIS IS FOR DEV PURPOSES ONLY
 */

UPDATE
    Users
SET
    Users.email = CONCAT("paulin.trognon+", Users.id, "@gmail.com")
WHERE
    Users.email IS NOT NULL;