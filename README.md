goocar-php-sdk
==============

汽车在线开放平台php开发包

项目地址：**https://github.com/pkkgu/goocar-php-sdk**   

## 使用详解
需要有汽车在线开放平台账号并且申请了APPKEY：  
API平台文档：http://www.goocar.net/open/v1.0/dataApi.html

----------

## 1. goocar.class.php 官方API类库

### 主要功能 
- getAccessToken 获取AccessToken POST
- Monitor 获取一个账户名下所有设备最新位置信息 POST
- Tracking 获取单个/批量设备最新位置信息 POST
- History 获取设备历史轨迹位置信息 GET
- Address 根据经纬度得到中文地址 GET


### 初始化动作 
```php


 $options = array(
	'account'=>'test', //经销商的账号
	'password'=>'test123', //经销商的密码
	'access_token'=>'', //accesstoken
	'map_type'=>'BAIDU' //GOOGLE,BAIDU两种坐标
	);
 $weObj = new Goocar($options); //创建实例对象
 //TODO：调用$weObj各实例方法

----------

## author
author  pkkgu <910111100@qq.com>
link https://github.com/pkkgu/
