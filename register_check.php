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

        $sql_message = $conn->prepare("SELECT * FROM users WHERE username = ?");
        $sql_message->bind_param("s", $username);
        $sql_message->execute();
        $result = $sql_message->get_result();


        if($result->num_rows > 0){
            $_SESSION['error_message'] = 'Username already in use';
        }
        else{
            $hashedPass = password_hash($password, PASSWORD_DEFAULT);

            $userConfig = json_encode([
                "actions" => [],
                "parameters" => []
                ]);
            
            
            do{
                $apiKey = bin2hex(random_bytes(24));
                
                $slqMessage = $conn->prepare("SELECT id FROM users WHERE api_key = ?");
                $slqMessage->bind_param("s", $apiKey);
                $slqMessage->execute();
                $result = $slqMessage->get_result();

            }while($result->num_rows > 0);

            $slqMessage = $conn->prepare("
                INSERT INTO users (username, email, password, api_key, user_config)
                VALUES (?, ?, ?, ?, ?)
                ");


            try{

                $slqMessage->bind_param("sssss", $username, $email, $hashedPass, $apiKey, $userConfig);

                $slqMessage->bind_param(
                "sssss",
                $username,
                $email,
                $hashedPass,
                $apiKey,
                $userConfig
                );

                $slqMessage->execute();
                $conn->close();
                header("Location: login");
                exit();
            }
            catch(mysqli_sql_exception $e){
                echo $e->getMessage();
                $_SESSION['error_message'] = 'Internal error when querring, please try again later';
            }
            

        }
        $conn->close();
    }
}

header("Location: register");
exit();

?>