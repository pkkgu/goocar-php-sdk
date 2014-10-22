<?php
/**
 * 汽车在线接口测试
 * 
 */
include("../goocar.class.php");

function logdebug($text){
	file_put_contents('../data/log.txt',$text."\n",FILE_APPEND);		
};

$options = array(
		'account'=>'test', //经销商的账号
		'password'=>'test123', //经销商的密码
		'access_token'=>'', //accesstoken
		'map_type'=>'BAIDU' //GOOGLE,BAIDU两种坐标
	);
$weObj = new Goocar($options);
	
echo "<pre>";
$Monitor = $weObj->Monitor();
$TIME    = time();
$IMEI    = $Monitor['data'][0]['imei'];
$lng     = $Monitor['data'][0]['lng'];
$lat     = $Monitor['data'][0]['lat'];
print_r($Monitor);

print_r($weObj->Tracking($IMEI));

print_r($weObj->History($IMEI,$TIME-72000,$TIME,4));

print_r($weObj->Address($lng,$lat));


