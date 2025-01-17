<?php
session_start();


if(isset($_SESSION['error_message'])){
    unset($_SESSION['error_message']);
}

$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];
$conf_password = $_POST['conf_password'];

if(!($password == $conf_password)){
    $_SESSION['error_message'] = 'Passwords do not match';
}
else{
    $server_name = "localhost";
    $sqlusername = "webscript";
    $sqlpassword = "webscriptroot1";
    $dbname = "servermonitortool";
    $conn = "";

    try{
        $conn = mysqli_connect($server_name,$sqlusername,$sqlpassword,$dbname);
    }
    catch(mysqli_sql_exception){
        $_SESSION['error_message'] = 'Internal problem, please try again later';
    }

    if(!$conn){
        $_SESSION['error_message'] = 'Internal problem, please try again later';
    }
    else{
        $slqMessage = "SELECT * FROM users WHERE username = '$username'";
        
        $result = $conn->query($slqMessage);

        if($result->num_rows > 0){
            $_SESSION['error_message'] = 'Username already in use';
        }
        else{
            $hashedPass = password_hash($password, PASSWORD_DEFAULT);

            
            $apiKey = bin2hex(random_bytes(24));
            $apiKey = strtoupper($apiKey);
            $slqMessage = "INSERT INTO users (username,email, password, api_key) VALUES(
                            '$username',
                            '$email',
                            '$hashedPass',
                            '$apiKey'
                            )";
            try{
            $conn->query($slqMessage);
            $conn->close();
            header("Location: login");
            exit();
            }
            catch(mysqli_sql_exception){
                $_SESSION['error_message'] = 'Internal error when quering, please try again later';
            }
            

        }
        $conn->close();
    }
}

header("Location: register");
exit();

?>