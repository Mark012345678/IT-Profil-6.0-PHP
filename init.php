<?php
// Inicializace databáze SQLite
$db = new PDO("sqlite:profile.db");

// Vytvoření tabulky interests, pokud neexistuje
$db->exec("CREATE TABLE IF NOT EXISTS interests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
)");
?>