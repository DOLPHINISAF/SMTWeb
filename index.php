<?php

if(isset($_SESSION)){
    header("Location: dashboard.html");
    exit();
}
else{
    header("Location: login.php");
    exit();
}

?>
