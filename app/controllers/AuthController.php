<?php
    class AuthController extends Controller {
        public function login() {
            if (!empty($_SESSION)) {
                $this->redirect('');
            }
            $this->view('auth/login');
        }
        public function doLogin() {
            $username = $_POST['username'];
            $pass = $_POST['password'];
            $keepLoggedIn = $_POST['keepLoggedIn'];
            $m = new Auth();
            $user = $m->findByEmail($username);
            header('Content-Type: application/json');
            if($user) {
                if(md5($pass) == $user['password']) {
                    $_SESSION['user'] = [
                        'id'=> $user['id'],
                        'role'=> 'user'
                    ];
                    if($keepLoggedIn) {
                    }
                    echo json_encode([
                        'status' => 'success',
                    ]);
                } else {
                    echo json_encode([
                        'status' => 'error',
                        'message' => 'password_incorrect'
                    ]);
                }
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'invalid_credentials'
                ]);
            }
            exit;
        }
        public function logout() {
            session_destroy();
            $this->redirect('login');
        }
        public function forgot() {
            $this->view('auth/forgot');
        }
        public function sendReset() {
            $email = $_POST['email'];
            $m = new Auth();
            $user = $m->findByEmail($email);
            if ($user) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'reset_success'
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'email_not_found'
                ]);
            }
        }
        public function switchAdmin() {
            $_SESSION['user']['role'] = 'admin';
            $this->redirect('./');
        }
        public function switchUser() {
            $_SESSION['user']['role'] = 'user';
            $this->redirect('./');
        }
        public function account() {
            ensure_login();
            $this->view('account');
        }    
    }