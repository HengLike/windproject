<?php   
    class UserController extends Controller {
        public function user() {
            ensure_login();
            $this->view('user/map');
        }
        public function news() {
            ensure_login();
            $this->view('user/news');
        }
        public function document() {
            ensure_login();
            $this->view('user/document');
        }
        public function download() {
            ensure_login();
            $this->view('user/download');
        }
    }