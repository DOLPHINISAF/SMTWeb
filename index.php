<?php

if(isset($_SESSION)){
    header("Location: dashboard");
    exit();
}
else{
    header("Location: login");
    exit();
}

?>
