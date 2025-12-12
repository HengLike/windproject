<?php
require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../models/NotificationModel.php';
class NotificationController extends BaseController {
    private $model;
    public function __construct(){ $this->model = new NotificationModel(); }
    public function list(){
        $start = intval($_POST['start'] ?? 0);
        $length= intval($_POST['length'] ?? 10);
        $filters = [
            'status'=> $_POST['status'] ?? '',
            'creator'=> $_POST['creator'] ?? '',
            'date'=> $_POST['date'] ?? ''
        ];
        $res = $this->model->list($start,$length,$filters);
        $this->json([
            "draw" => intval($_POST['draw'] ?? 1),
            "recordsTotal" => $res['total'],
            "recordsFiltered" => $res['total'],
            "data" => $res['data']
        ]);
    }
    public function get(){
        $id = intval($_POST['id'] ?? 0);
        $this->json(['status'=>'success','data'=>$this->model->get($id)]);
    }
}
