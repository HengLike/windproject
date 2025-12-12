<?php
class MemberModel {
    public function list($start = 0, $length = 10, $filters = []) {
        $firstname = ["Somchai", "Anan", "Somsak", "Kittisak", "Manivong"];
        $lastname  = ["Phon", "Seng", "Thong", "Sisavat", "Phet"];
        $company   = ["PSG Group", "Lao Telecom", "Unitel"];
        $position  = ["Engineer", "Manager", "Officer"];
        $mock = [];
        for ($i = 0; $i < 50; $i++) {
            $mock[] = [
                "id" => $i + 1,
                "firstname" => $firstname[array_rand($firstname)],
                "lastname" => $lastname[array_rand($lastname)],
                "company" => $company[array_rand($company)],
                "position" => $position[array_rand($position)],
                "email" => "user".($i+1)."@example.com",
                "tel" => "020".rand(20000000, 29999999),
                "role" => rand(0,1) ? "Admin" : "User",
                "status" => rand(0,1) ? "Active" : "Inactive",
                "create_at" => date("Y-m-d H:i:s", strtotime("-".rand(1,300)." days")),
                "create_by" => "System"
            ];
        }
        return [
            "total" => count($mock),
            "data" => array_slice($mock, $start, $length)
        ];
    }
    public function get($id) {
        return [
            "id" => $id,
            "firstname" => "John",
            "lastname" => "Doe",
            "company" => "PSG Group",
            "position" => "Engineer",
            "email" => "john@example.com",
            "tel" => "02012345678",
            "role" => "User",
            "status" => "Active"
        ];
    }
}