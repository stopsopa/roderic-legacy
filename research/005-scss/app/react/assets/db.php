<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

$state = json_decode(file_get_contents("php://input"), true) ?: array();

$state = array_merge($_POST, $state);

$file = 'db.json';

if($state) {
    if (file_exists($file)) {
        unlink($file);
    }

    if (version_compare(PHP_VERSION, '5.4', '>=')) {
        $data = json_encode($state, JSON_PRETTY_PRINT);
    }
    else {
        $data = json_encode($state);
    }

    file_put_contents($file, $data, FILE_APPEND);
}
else {
    if (file_exists($file)) {
        $state = json_decode(file_get_contents($file), true) ?: array();
    }
}

sleep(1);

header('Content-Type: application/json');
header('Cache-Control: no-cache');
header('Access-Control-Allow-Origin: *');

echo json_encode($state ?: array());