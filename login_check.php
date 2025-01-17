<?php
session_start();

if(isset($_SESSION['error_message'])){
    unset($_SESSION['error_message']);
}

$username = $_POST['username'];
$password = $_POST['password'];

$server_name = "localhost";
$db_username = "webscript";
$db_password = "webscriptroot1";
$db_name = "servermonitortool";
$conn = "";

try{
    $conn = mysqli_connect($server_name,$db_username,$db_password,$db_name);
}
catch(mysqli_sql_exception){
    $_SESSION['error_message'] = 'Internal problem, please try again later';
}
if(!$conn){
    $_SESSION['error_message'] = 'Internal problem, please try again later';
}
else{
    $sql_message = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($sql_message);

    if($result->num_rows > 0){
        $row = mysqli_fetch_assoc($result);
        if(password_verify($password, $row['password'])){
            $_SESSION['username'] = $username;
            $_SESSION['APIKEY'] = $row['api_key'];
            header("Location: dashboard");
            exit();
        }

    }

    $conn->close();
    $_SESSION['error_message'] = 'Incorrect username or password';

    
}
    header("Location: login");
    exit();
?>