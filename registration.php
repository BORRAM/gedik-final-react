<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Methods: *');

header("Access-Control-Allow-Headers: *");
/*

        const fullName = $(e.target).find('input[name="adsoyad"]').val();
        const gender = $(e.target).find('select[name="gender"]').val();
        const nationality = $(e.target).find('input[name="uyrugu"]').val();
        const licenseType = $(e.target).find('input[name="sbelge"]').val();
        const telephone = $(e.target).find('input[name="telephone"]').val();
        const email = $(e.target).find('input[name="email"]').val();
        const agreement = $(e.target).find('input[name="onay"]').is(':checked');

*/

if(!isset($_POST)) {
    die(json_encode([
        'status' => 'error',
        'message' => 'POST is not set'
    ]));
}

if(!isset($_POST['fullName'])) {
    die(json_encode([
        'status' => 'error',
        'message' => 'fullName is not set'
    ]));
}

if(!isset($_POST['gender'])) {
    die(json_encode([
        'status' => 'error',
        'message' => 'gender is not set'
    ]));
}

if(!isset($_POST['nationality'])) {
    die(json_encode([
        'status' => 'error',
        'message' => 'nationality is not set'
    ]));
}

if(!isset($_POST['licenseType'])) {
    die(json_encode([
        'status' => 'error',
        'message' => 'licenseType is not set'
    ]));
}

if(!isset($_POST['telephone'])) {
    die(json_encode([
        'status' => 'error',
        'message' => 'telephone is not set'
    ]));
}

if(!isset($_POST['email'])) {
    die(json_encode([
        'status' => 'error',
        'message' => 'email is not set'
    ]));
}

if(!isset($_POST['agreement'])) {
    die(json_encode([
        'status' => 'error',
        'message' => 'agreement is not set'
    ]));
}

$fullName = trim($_POST['fullName']);
$gender = trim($_POST['gender']);
$nationality = trim($_POST['nationality']);
$licenseType = trim($_POST['licenseType']);
$telephone = trim($_POST['telephone']);
$email = trim($_POST['email']);
$agreement = trim($_POST['agreement']);

if(empty($fullName) || empty($gender) || empty($nationality) || empty($licenseType) || empty($telephone) || empty($email) || empty($agreement)) {
    die(json_encode([
        'status' => 'error',
        'message' => 'One or more fields are empty'
    ]));
}

if(!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Email is not valid'
    ]));
}

if(!is_numeric($telephone)) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Telephone is not valid'
    ]));
}

try {
    $db = new PDO('mysql:host=localhost;dbname=odev;charset=utf8mb4', 'arda', 'ArDa8040');
} catch(PDOException $e) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Database connection failed'
    ]));
}

// registrations table
$query = $db->prepare("INSERT INTO registrations SET full_name = ?, gender = ?, email = ?, nationality = ?, license_type = ?, phone = ?");
$query = $query->execute([
    $fullName,
    (intval($gender) == 1) ? "ERKEK" : "KADIN",
    $email,
    $nationality,
    $licenseType,
    $telephone
]);

if(!$query) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Database query failed'
    ]));
}

die(json_encode([
    'status' => 'success',
    'message' => 'Registration successful'
]));