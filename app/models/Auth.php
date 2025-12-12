<?php
    class Auth {
        private $db;
        public function __construct() {
            $this->db = Database::getInstance()->pdo;
        }
        public function findByEmail($email) {
            $stmt = $this->db->prepare('SELECT id, password FROM users WHERE email = ? LIMIT 1');
            $stmt->execute([$email]);
            return $stmt->fetch();
        }
    }