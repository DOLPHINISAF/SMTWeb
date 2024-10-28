<?php
session_start();

if(isset($_SESSION['username'])){
    unset($_SESSION['username']);
}
if(isset($_SESSION['APIKEY'])){
    unset($_SESSION['APIKEY']);
}
session_destroy();

header("Location: login");
exit();
?>