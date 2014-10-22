<?php
/**
 *	汽车在线PHP-SDK 工具类API
 *  @author  pkkgu <910111100@qq.com>
 *  @link https://github.com/pkkgu/goocar-php-sdk
 *  @version 1.0
 *  usage:
		$options = array(
				'account'=>'test', //经销商的账号
				'password'=>'test123', //经销商的密码
				'access_token'=>'', //accesstoken
				'map_type'=>'BAIDU' //GOOGLE,BAIDU两种坐标
			);
		$weObj = new Goocar($options);
		$Monitor = $weObj->Monitor();
		$TIME    = time();
		$IMEI    = $Monitor['data'][0]['imei'];
		$lng     = $Monitor['data'][0]['lng'];
		$lat     = $Monitor['data'][0]['lat'];
		print_r($Monitor);
		print_r($weObj->Tracking($IMEI));
		print_r($weObj->History($IMEI,$TIME-72000,$TIME,4));
		print_r($weObj->Address($lng,$lat));
 */
class Goocar
{
	const API_URL_PREFIX = 'http://api.gpsoo.net/1/';
	const AUTH_URL = 'auth/access_token?';
	const MONITOR_URL = 'account/monitor?';
	const TRACKING_URL = 'devices/tracking?';
	const HISTORY_URL = 'devices/history?';
	const ADDRESS_URL = 'tool/address?';
	private $access_token;
	private $account;
	private $password;
	private $map_type;
	private $time;
	public $debug =  false;
	public $errCode = 2001;
	public $errMsg = "账号或密码错误";
	private $_logcallback;
	
	public function __construct($options)
	{
		$this->access_token = isset($options['access_token'])?$options['access_token']:'';
		$this->account = isset($options['account'])?$options['account']:'';
		$this->password = isset($options['password'])?$options['password']:'';
		$this->map_type = isset($options['map_type'])?$options['map_type']:'BAIDU';
		$this->time = time();
		$this->debug = isset($options['debug'])?$options['debug']:false;
		$this->_logcallback = isset($options['logcallback'])?$options['logcallback']:false;
	}

	/**
	 * 获取Access Token POST
	 * @param string $account
	 * @param string $password
	 * @param string $access_token 手动指定access_token，非必要情况不建议用
	 */
	public function getOauthAccessToken($account='',$password='',$access_token=''){
		if (!$account || !$password) {
			$account = $this->account;
			$password = $this->password;
		}
		if ($access_token) { //手动指定access_token，优先使用
		    $this->access_token=$access_token;
		    return $this->access_token;
		}
		
		//TODO: get the cache access_token
		$result = $this->http_get(self::API_URL_PREFIX.self::AUTH_URL.'account='.$account.'&signature='.md5(md5($password).$this->time)."&time=".$this->time);
		if ($result)
		{
			$json = json_decode($result,true);
			if (!$json || $json['ret']) {
				$this->errCode = $json['ret'];
				$this->errMsg = $json['msg'];
				return false;
			}
			$this->access_token = $json['access_token'];
			$expire = $json['expires_in'] ? intval($json['expires_in'])-100 : 3600;
			//TODO: cache access_token
			return $this->access_token;
		}
		return false;
	}

	/**
	 * 获取一个账户名下所有设备最新位置信息 POST
	 * @return boolean|array
	 */
	public function Monitor(){
		if (!$this->access_token && !$this->getOauthAccessToken()) return false;
		$data = array(
				'access_token'=>$this->access_token,
				'time'=>$this->time,
				'map_type'=>$this->map_type,
				'account'=>$this->account,
				'target'=>$this->account
		);
		$result = $this->http_post(self::API_URL_PREFIX.self::MONITOR_URL,$data);
		if ($result)
		{
			$json = json_decode($result,true);
			if (!$json || !empty($json['errcode'])) {
				$this->errCode = $json['errcode'];
				$this->errMsg = $json['errmsg'];
				return false;
			}
			return $json;
		}
		return false;
	}

	/**
	 * 获取单个/批量设备最新位置信息 POST
	 * @param array $imeis 设备imei多个请用,分割
	 * @return boolean|array
	 */
	public function Tracking($imeis){
		if (!$this->access_token && !$this->getOauthAccessToken()) return false;
		if (!$imeis) return false;
		$data = array(
				'access_token'=>$this->access_token,
				'time'=>$this->time,
				'map_type'=>$this->map_type,
				'account'=>$this->account,
				'imeis'=>$imeis
		);
		$result = $this->http_post(self::API_URL_PREFIX.self::TRACKING_URL,$data);
		if ($result)
		{
			$json = json_decode($result,true);
			if (!$json || !empty($json['errcode'])) {
				$this->errCode = $json['errcode'];
				$this->errMsg = $json['errmsg'];
				return false;
			}
			return $json;
		}
		return false;
	}

	/**
	 * 获取设备历史轨迹位置信息 GET
	 * @param array $imei 设备imei
	 * @param array $begin_time 开始时间戳
	 * @param array $end_time 结束时间戳
	 * @param array $limit 查询条数
	 * @return boolean|array
	 */
	public function History($imei,$begin_time,$end_time,$limit=100){
		if (!$this->access_token && !$this->getOauthAccessToken()) return false;
		if (!$imei || !$begin_time || !$end_time) return false;
		$data = array(
				'access_token'=>$this->access_token,
				'time'=>$this->time,
				'map_type'=>$this->map_type,
				'account'=>$this->account,
				'imei'=>$imei,
				'begin_time'=>$begin_time,
				'end_time'=>$end_time,
				'limit'=>$limit
		);
		$data = http_build_query($data);
		$result = $this->http_get(self::API_URL_PREFIX.self::HISTORY_URL.$data);
		if ($result)
		{
			$json = json_decode($result,true);
			if (!$json || !empty($json['errcode'])) {
				$this->errCode = $json['errcode'];
				$this->errMsg = $json['errmsg'];
				return false;
			}
			return $json;
		}
		return false;
	}


	/**
	 * 根据经纬度得到中文地址 GET
	 * @param array $lng
	 * @param array $lat
	 * @return boolean|array
	 */
	public function Address($lng,$lat){
		if (!$this->access_token && !$this->getOauthAccessToken()) return false;
		if (!$lng || !$lat) return false;
		$data = array(
				'access_token'=>$this->access_token,
				'time'=>$this->time,
				'map_type'=>$this->map_type,
				'account'=>$this->account,
				'lng'=>$lng,
				'lat'=>$lat,
				'lang'=>"zh-cn"
		);
		$data = http_build_query($data);
		$result = $this->http_get(self::API_URL_PREFIX.self::ADDRESS_URL.$data);
		if ($result)
		{
			$json = json_decode($result,true);
			if (!$json || !empty($json['errcode'])) {
				$this->errCode = $json['errcode'];
				$this->errMsg = $json['errmsg'];
				return false;
			}
			return $json;
		}
		return false;
	}


	/**
	 * GET 请求
	 * @param string $url
	 */
	private function http_get($url){
		$oCurl = curl_init();
		if(stripos($url,"https://")!==FALSE){
			curl_setopt($oCurl, CURLOPT_SSL_VERIFYPEER, FALSE);
			curl_setopt($oCurl, CURLOPT_SSL_VERIFYHOST, FALSE);
		}
		curl_setopt($oCurl, CURLOPT_URL, $url);
		curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 1 );
		$sContent = curl_exec($oCurl);
		$aStatus = curl_getinfo($oCurl);
		curl_close($oCurl);
		if(intval($aStatus["http_code"])==200){
			return $sContent;
		}else{
			return false;
		}
	}
	
	/**
	 * POST 请求
	 * @param string $url
	 * @param array $param
	 * @param boolean $post_file 是否文件上传
	 * @return string content
	 */
	private function http_post($url,$param,$post_file=false){
		$oCurl = curl_init();
		if(stripos($url,"https://")!==FALSE){
			curl_setopt($oCurl, CURLOPT_SSL_VERIFYPEER, FALSE);
			curl_setopt($oCurl, CURLOPT_SSL_VERIFYHOST, false);
		}
		if (is_string($param) || $post_file) {
			$strPOST = $param;
		} else {
			$aPOST = array();
			foreach($param as $key=>$val){
				$aPOST[] = $key."=".urlencode($val);
			}
			$strPOST =  join("&", $aPOST);
		}
		curl_setopt($oCurl, CURLOPT_URL, $url);
		curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 1 );
		curl_setopt($oCurl, CURLOPT_POST,true);
		curl_setopt($oCurl, CURLOPT_POSTFIELDS,$strPOST);
		$sContent = curl_exec($oCurl);
		$aStatus = curl_getinfo($oCurl);
		curl_close($oCurl);
		if(intval($aStatus["http_code"])==200){
			return $sContent;
		}else{
			return false;
		}
	}

	private function log($log){
		if ($this->debug && function_exists($this->_logcallback)) {
			if (is_array($log)) $log = print_r($log,true);
			return call_user_func($this->_logcallback,$log);
		}
	}
}