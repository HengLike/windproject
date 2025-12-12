<?php
class WindModel {
    public function list($start=0,$length=10,$filters=[]){
        $names = ["สถานีลมเหนือ","สถานีลมใต้","สถานีลมตะวันออก","สถานีลมตะวันตก","จุดตรวจวัดริมชายฝั่ง","สถานีเขาภูดร","สถานีเกาะกลาง","สถานีลุ่มน้ำ","สถานีฟาร์มลม"];
        $dirs = ["N","NE","E","SE","S","SW","W","NW"];
        $mock = [];
        for($i=1;$i<=50;$i++){
            $mock[] = [
                "id"=>$i,
                "station"=>$names[array_rand($names)]." #".$i,
                "wind_speed"=> rand(0,60),
                "wind_direction"=>$dirs[array_rand($dirs)],
                "lat"=> (float)(14 + rand(0,100)/100),
                "lng"=> (float)(100 + rand(0,100)/100),
                "updated_at"=> date("Y-m-d H:i:s", strtotime("-".rand(1,72)." hours")),
                "status"=> rand(0,1) ? "warning":"secondary"
            ];
        }
        $total = count($mock);
        $data = array_values(array_slice($mock,$start,$length));
        return ["total"=>$total,"data"=>$data];
    }
    public function get($id){
        return [
            "id"=>$id,
            "station"=>"สถานีลมตัวอย่าง #".$id,
            "wind_speed"=> rand(0,60),
            "wind_direction"=>"NE",
            "lat"=>14.25,
            "lng"=>100.75,
            "updated_at"=>date("Y-m-d H:i:s"),
            "status"=>"ok"
        ];
    }
}