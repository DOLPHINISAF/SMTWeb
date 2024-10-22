<?php
session_start();



$_SESSION["UID"] = 4;

header("Location: dashboard.html");
exit();

?>