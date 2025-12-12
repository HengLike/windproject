<?php
class DocumentModel {
    public function list($start=0,$length=10,$filters=[]){
        $names = ["Company Profile","Employee Handbook","Salary Report","Project Plan","Invoice_2024_001","Meeting Minutes","Design Draft","Purchase Order","User Manual","IT Policy","Financial Summary","Training Material","Contract Agreement","Budget Estimate","Work Schedule","Client Feedback","Presentation Slides","Report_Q4","Checklist","Audit Form"];
        $types = ["pdf","docx","xlsx","pptx","jpg","png"];
        $icons = [
            "pdf"=>"fa-solid fa-file-pdf text-danger",
            "docx"=>"fa-solid fa-file-word text-primary",
            "xlsx"=>"fa-solid fa-file-excel text-success",
            "pptx"=>"fa-solid fa-file-powerpoint text-warning",
            "jpg"=>"fa-solid fa-file-image text-info",
            "png"=>"fa-solid fa-file-image text-info"
        ];
        $admin = ["Somchai","Anan","Somsak","Kittisak","Suchart"];
        $mock = [];
        for($i=0;$i<50;$i++){
            $type = $types[array_rand($types)];
            $mock[] = [
                "id"=>$i+1,
                "document_icon"=> '<i class="'.$icons[$type].' fa-2x"></i>',
                "document_name"=>$names[$i % count($names)],
                "document_type"=>strtoupper($type),
                "document_size"=> rand(50,5000)." KB",
                "document_date"=> date("Y-m-d", strtotime("-".rand(1,400)." days")),
                "status"=> rand(0,1) ? "Public":"Private",
                "create_at"=> date("Y-m-d H:i:s", strtotime("-".rand(1,400)." days")),
                "create_by"=>$admin[array_rand($admin)]
            ];
        }
        $total = count($mock);
        $data = array_values(array_slice($mock,$start,$length));
        return ["total"=>$total,"data"=>$data];
    }
    public function get($id){
        return [
            "id"=>$id,
            "document_name"=>"Company Policy",
            "document_type"=>"PDF",
            "document_file"=>"policy.pdf",
            "description"=>"This is the company policy document.",
            "status"=>"Active",
            "updated_at"=>"2025-01-01 12:00:00"
        ];
    }
}