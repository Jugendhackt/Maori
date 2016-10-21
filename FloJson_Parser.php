<?php
header('charset: UTF-8');
$url = "http://www.berlin.de/sen/wirtschaft/service/maerkte-feste/wochen-troedelmaerkte/index.php/index.json?q=";
if(!empty($_GET['q'])){
    $url = $url . $_GET['q'];
}
$final_json = [];

// Read Json and print better Json
function read_json($json, $final_json){
    $object = json_decode($json, true);
    if($object['results']['count'] === 0){
        echo("False");
        die();
    }

    foreach($object['index'] as $item){
        $final_array['name'] = "Keine Angabe";
        $final_array['days'] = "Keine Angabe";
        $final_array['owner'] = "Keine Angabe";
        $final_array['time'] = "Keine Angabe";
        $final_array['comment'] = "Keine Angabe";
        $final_array['website'] = "Keine Angabe";
        $final_array['email'] = "Keine Angabe";
        $final_array['lat'] = str_replace(",", ".", $item['latitude']);
        $final_array['lon'] = str_replace(",", ".", $item['longitude']);

        if(!empty($item['location'])) $final_array['name'] = $item['location'];
        if(!empty($item['tage'])) $final_array['days'] = $item['tage'];
        if(!empty($item['betreiber'])) $final_array['owner'] = $item['betreiber'];
        if(!empty($item['zeit'])) $final_array['time'] = $item['zeit'];
        if(!empty($item['bemerkung'])) $final_array['comment'] = $item['bemerkung'];
        if(!empty($item['www'])) $final_array['website'] = $item['www'];
        if(!empty($item['email'])) $final_array['email'] = $item['email'];
        array_push($final_json, $final_array);
    }
    return $final_json;
}
$tested_sites = 0;
$object = json_decode(file_get_contents($url), true);
while($object['results']['items_per_page'] * $tested_sites < (int)$object['results']['count']){
    $tested_sites += 1;
    $final_json = read_json(file_get_contents($url . "&page=" . $tested_sites), $final_json);
}

echo(json_encode($final_json));