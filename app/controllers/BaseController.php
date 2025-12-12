<?php
class BaseController {
    protected function json($data){
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
    protected function view($path, $vars = []){
        extract($vars);
        require_once __DIR__ . "/../views/{$path}.php";
    }
}