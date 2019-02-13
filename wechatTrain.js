Global 微信号名称,微信号ID,微信简介,消息intX,消息intY,WxUrl,WxDate,WxTitle,间隔线Y,Test
Test = 1

Rem QiDong
SWTime0 = "17:20:00"//你要的设置的时间，也可作为变量随意
SWTime1 = "00:30:00"//你要的设置的时间，也可作为变量随意

Do
	Exit Do 
    NowTime = Time
    If Test = 1 Then 
		TracePrint NowTime
	End If
    If Hour(SWTime0) = Hour(NowTime) and Minute(SWTime0) = Minute(NowTime) and Second(SWTime0) = Second(NowTime)  Then 
        If Test = 1 Then
        	TracePrint "启动A:" & NowTime
        End If
        Exit Do
    ElseIf Hour(SWTime1) = Hour(NowTime) and Minute(SWTime1) = Minute(NowTime) and Second(SWTime1) = Second(NowTime)  Then 
        If Test = 1 Then
        	TracePrint "启动B:" & NowTime
        End If
        Exit Do 
    End If
    If Test = 1 Then
   		TracePrint "B" & NowTime
    End If
    Delay 1000
Loop

Call 主程序(132, 0)
//Goto QiDong

// GH_Num 公号数量| Start_Num 第几个公号开始
Function 主程序(GH_Num,Start_Num)
	//查找窗口类名(WeChatMainWndForPC)或者标题(微信),返回找到的句柄Hwnd
	Hwnd = Plugin.Window.Find("WeChatMainWndForPC",0)
	GH_intY = 7
	For kk = 0 To GH_Num
		
		取余 = kk Mod 21
		GH_intX = 取余 * 68 + 416
		If 取余 = 0 Then 
			GH_intY = GH_intY + 105
		End If
		
		If kk < Start_Num Then 
			
		Else
			If Test = 1 Then
				TracePrint "微信主窗口句柄：" & Hwnd
			End If
			Call Plugin.Window.Top(Hwnd, 0)
			//显示窗口
			Call Plugin.Window.Show(Hwnd)
			Call Plugin.Window.Move(Hwnd, 0, 0)
			Call Plugin.Window.Size(Hwnd, 1900, 800)
			Call Plugin.Window.Top(Hwnd, 1)
			
			Call 鼠标单击(25,144,"点击通讯录按钮")
			Call 鼠标单击(128, 222, "点击通讯录-->公众号")
	
			Call 点击公众号(GH_intX, GH_intY, kk)
		End If
	Next	
End Function

Function 点击公众号(X,Y,kkk)
	//点击第一个公众号
	Call 鼠标单击(X,Y,"点击第"&kkk&"个公众号")
	
	//获取微信详情句柄
	Hwnd2 = Plugin.Window.Find("ContactProfileWnd", 0)
	sRect = Plugin.Window.GetWindowRect(Hwnd2)  
	dim MyArray
	MyArray = Split(sRect, "|")
	If Test = 1 Then
		TracePrint sRect
	End If
	//下面这句将字符串转换成数值   
	L = Clng(MyArray(0))
	T = Clng(MyArray(1))   
	R = Clng(MyArray(2))
	B = Clng(MyArray(3))   
	//Msgbox "左" & L & ",右 "& R & ",上" & T & ",下" & B 
	
	//复制微信号名称
	Delay 100
	intX__ = L+40
	intY__ = T+45
	MoveTo intX__, intY__
	LeftClick 2
	KeyDown "Ctrl", 1
	KeyPress "C", 1
	KeyUp "Ctrl", 1
	Delay 100
	微信号名称 = Plugin.Sys.GetCLB()
	Plugin.Sys.SetCLB("")
	If Test = 1 Then
		TracePrint "微信号名称：" & 微信号名称
	End If
	//复制微信号ID
	If 微信号名称 = "惠州市律师协会" Then 
		微信号ID = 微信号名称
	ElseIf 微信号名称 = "永旺华南商业有限公司" Then
		微信号ID = 微信号名称
	ElseIf 微信号名称 = "惠州税务" Then
		微信号ID = 微信号名称
	Else 
		
		Delay 100
		FindColor R-240, B-85, R-230, T, "999999", ColorX, ColorY
		MoveTo ColorX+40, ColorY+5
		
		If Test = 1 Then
			TracePrint "ColoroX"&ColorX
			TracePrint "ColorY" & ColorY
		End If
		
		LeftClick 2
		KeyDown "Ctrl", 1
		KeyPress "C", 1
		KeyUp "Ctrl", 1
		Delay 100
		微信号ID = Plugin.Sys.GetCLB()
		Plugin.Sys.SetCLB("")
		If Test = 1 Then
			TracePrint "微信号ID：" & 微信号ID
		End If
		
	End If
	
	
	//复制微信简介
	Delay 100
	intX__ = R - 260
	intY__ = B - 85
	MoveTo intX__, intY__
	If Test = 1 Then
		TracePrint "历史消息按钮坐标" & intX__ &"||"& intY__
	End If
	
	LeftClick 2
	KeyDown "Ctrl", 1
	KeyPress "C", 1
	KeyUp "Ctrl", 1
	Delay 100
	微信简介 = Plugin.Sys.GetCLB()
	Plugin.Sys.SetCLB("")
	If Test = 1 Then
		TracePrint "微信简介：" & 微信简介
	End If
	
	//提交帐号信息
	PostData = "enews=WxNo&pw=998872&WxName="&微信号名称&"&WxID="&微信号ID&"&WxSmallText="&微信简介
	If Test = 1 Then
		TracePrint "提交帐号-->数据" & PostData
	End If
	PostUrl = "http://wx.prgteam.com/e/admin/jiekou_utf8.php"
	返回数组 = Lib.旋_WINHTTP.简易_Post访问(PostUrl,PostData,"","",0,1)
	返回文本 = 返回数组(1)
	If Test = 1 Then
		TracePrint "提交帐号-->返回值" & 返回文本
	End If
	//关闭错误提示	
	Hwnd2 = Plugin.Window.Find("#32770", "JavaScript Alert - https://mp.weixin.qq.com")
	If Test = 1 Then
		TracePrint "Hwnd2:" & Hwnd2
	End If
	If Hwnd2 > 0 Then 
		If Test = 1 Then
			TracePrint "Hwnd2:" & Hwnd2
		End If
		Call 鼠标单击(600,1100,"鼠标单击，关闭错误弹窗(JavaScript Alert)")
		Delay 500
		KeyPress "Enter", 1
		Delay 1000
	End If
	
	//点击历史消息按钮
	Delay 100
	intX__ = R-90
	intY__ = B-40
	Call 鼠标单击(intX__,intY__,"点击历史消息按钮")
	Delay 500
	
	//获取历史消息列表句柄
	Hwnd1 = Plugin.Window.Find("CefWebViewWnd", 0)
	If Test = 1 Then
		TracePrint "历史消息列表句柄：" & Hwnd1
	End If
	Call Plugin.Window.Move(Hwnd1, 0, 0)
	Call Plugin.Window.Size(Hwnd1, 1300, 1156)
	
	点击推文(a)
	
End Function

Function 点击推文(a)
	Call 鼠标单击(9, 85, "激活窗口3")
	Delay 2000
	MouseWheel - 2 
	//For ii = 0 To 1
	
		获取推文标题坐标 (a)
		间隔线Arr = Split(间隔线Y, "|")
		For i = 0 To UBound(间隔线Arr)
			复制推文标题 (间隔线Arr(i))
			复制推文时间 (间隔线Arr(i))
			WxTitleLen = Len(WxTitle)
			//WxDateLen = Len(WxDate)
			If Test = 1 Then
				TracePrint "WxTitleLen长度：" & WxTitleLen
			End If
			WxDateA = split(WxDate, "2019年")
			WxDateB = split(WxDate, "2018年")
			WxDateC = split(WxDate, "2017年")
			WxTitleA = split(WxTitle, "<a")
			WxDateType = 0
			If UBound (WxDateA) = 1 or UBound (WxDateB) = 1 or UBound (WxDateC) = 1 Then 
				WxDateType = 1
				If Test = 1 Then
					TracePrint "WxDateType1"
				End If
			Else 
				If Test = 1 Then
					TracePrint "WxDateType0"
				End If
			End If
			If WxTitle = "内容违规已被删除" Then 
				WxTitleLen = 0
			ElseIf UBound(WxTitleA) = 1 Then
				WxTitleLen = 0
			End If
			
			If WxTitleLen > 0 and WxDateType = 1 Then 
				Call 鼠标单击(25, 间隔线Arr(i)+25, "点击第" & i + 1 & "条推文")
				If Test = 1 Then
					TracePrint "推文标题坐标：(25)(intY：" & 间隔线Arr(i) + 25 & ")"
				End If
				进入推文正文页 (i)
			Else 
				If Test = 1 Then
					TracePrint "#######标题为空未不采集"
				End If
			End If
		Next
		
		//Call 鼠标单击(9, 85, "激活窗口1")
		//Delay 500
		//MouseWheel - 3
		//Delay 50
		//MouseWheel - 3 
		//Delay 50
		//MouseWheel - 3 
	//Next
End Function

Function 查找点赞位置(a)

	Call 鼠标单击(9,85,"激活窗口-->滚动查找")

	MouseWheel - 500 //滚动鼠标 
	Delay 50
	MouseWheel - 500 //滚动鼠标 
	Delay 500
	If Test = 1 Then
		TracePrint "找图开始 ============="
	End If
	//滚动查找【阅读】数量位置
	n = 0
	bqNo = 0
	Do
		If bqNo > 3 Then 
			MouseWheel - 500 //滚动鼠标 
			Call 鼠标单击(36, 50, "未找到点赞，分割线点击后退")
			Delay 2000
			Exit Do
		End If
		//
		If n > 30 Then 
			Delay 100
			Call 鼠标单击(9,85,"激活窗口-->滚动查找")
			MouseWheel - 500 //滚动鼠标 
			Delay 500
			MouseWheel - 500 //滚动鼠标
			Delay 500
			MouseWheel - 500 //滚动鼠标
			Delay 500
			n = 1
			bqNo = bqNo+1
		End If
		If Test = 1 Then
    		TracePrint "找图-->第" & n & "次找图"
    	End If
		Delay 100
		
    	Call 获取阅读和点赞(a)
    	If ReadNum > 0 Then 
			Exit Do //退出找到
		End If	
    	
    	MouseWheel + 8 //滚动鼠标 
    	n=n+1
	Loop
	If Test = 1 Then
		TracePrint "找图结束 ============="
	End If
	
	PostData = "enews=WxInfo&pw=998872&WxUrl=" & WxUrl & "&DiggNum=" & DiggNum & "&ReadNum=" & ReadNum & "&WxName=" & 微信号名称 & "&WxID=" & 微信号ID &"&WxDate="&WxDate &"&WxTitle="&WxTitle
	If Test = 1 Then
		TracePrint "提交帐号-->数据" & PostData
	End If
	PostUrl = "http://wx.prgteam.com/e/admin/jiekou_utf8.php"
	返回数组 = Lib.旋_WINHTTP.简易_Post访问(PostUrl,PostData,"","",0,1)
	返回文本 = 返回数组(1)
	If Test = 1 Then 
		TracePrint PostData
		TracePrint "提交帐号-->返回值" & 返回文本
	End If
	Delay 500
	Call 鼠标单击(36, 50, "点击后退")
	Delay 2000
End Function

Function 获取阅读和点赞(a)
	DiggNum = 0
	ReadNum = 0
	FindColor 988,129,988,1130,"F2F2F2",intX,intY
	If intX > 0 And intY > 0 Then
		intY = intY - 1
		GetColor = GetPixelColor(intX, intY)
		If GetColor = "FFFFFF" Then 
			If Test = 1 Then
				TracePrint "找到"
				TracePrint "intX:"&intX
				TracePrint "intY:"&intY
			End If
			
			Y = intY - 28
			X = intX
			MoveTo X, Y
			Delay 50
			LeftDown 1
			X = intX - 7
			MoveTo X, Y
			LeftUp 1
			Delay 50
			KeyDown "Ctrl", 1
			KeyPress "C", 1
			KeyUp "Ctrl", 1
			Delay 50
			DataNum = Plugin.Sys.GetCLB()
			TracePrint DataNum
			If InStr(DataNum, "好看") > 0 Then 
				MyArray = Split(DataNum, "好看")
				DataNum = MyArray(0)
				TracePrint MyArray(0)
				TracePrint "点赞"&Trim(MyArray(1))
				DiggNum = Trim(MyArray(1))
				If InStr(DataNum, "原文") > 0 Then 
					MyArray = Split(DataNum, "阅读原文阅读")
				Else 
					MyArray = Split(DataNum, "阅读")
				End If
	
				TracePrint "阅读"&Trim(MyArray(1))
				ReadNum = Trim(MyArray(1))
				Exit Function
			End If
			
			
			
			
			
			
			
			//复制点赞次数
			intX_ = intX - 45
			intY_ = intY - 30
			MoveTo intX_, intY_
			Delay 50
			LeftClick 2
			LeftClick 1
			Delay 50
			KeyDown "Ctrl", 1
			KeyPress "C", 1
			KeyUp "Ctrl", 1
			Delay 50
			DiggNum = Plugin.Sys.GetCLB()
			Plugin.Sys.SetCLB("") 
			If Test = 1 Then
				TracePrint "赞数:"& DiggNum
			End If
			//取消选择
			MoveTo intX, intY
			LeftClick 1
			
			//复制阅读次数
			intX_ = intX
			intY_ = intY - 30
			MoveTo intX_, intY_
			Delay 50
			LeftClick 2
			LeftClick 1
			Delay 50
			KeyDown "Ctrl", 1
			KeyPress "C", 1
			KeyUp "Ctrl", 1
			Delay 50
			ReadNum = Plugin.Sys.GetCLB()
			Plugin.Sys.SetCLB("") 
			
			If Instr(ReadNum, "阅读原文") > 0 Then 
				intX_ = intX - 592
				intY_ = intY - 30
				MoveTo intX_, intY_
				Delay 50
				LeftClick 2
				LeftClick 1
				Delay 50
				KeyDown "Ctrl", 1
				KeyPress "C", 1
				KeyUp "Ctrl", 1
				Delay 50
				
				ReadNum = Plugin.Sys.GetCLB()
				Plugin.Sys.SetCLB("") 
				If Test = 1 Then
					TracePrint "阅读原文重新获取"
				End If
			End If
			If Instr(ReadNum, "阅读原文") > 0 Then 
				If Test = 1 Then
					TracePrint "第二次阅读原文#"&ReadNum
				End If

				DiggNum = 0
				ReadNum = 0
			ElseIf  Instr(ReadNum, "阅读") > 0 Then 
				ReadNum = Replace(ReadNum,"阅读 ","") + 0
				If Test = 1 Then
					TracePrint "阅读:" & ReadNum
				End If
			Else 
				If Test = 1 Then
					TracePrint "找到但是复制出错"&ReadNum
				End If
				DiggNum = 0
				ReadNum = 0
			End If
		Else
			If Test = 1 Then 
				TracePrint "阅读:" & DiggNum
				TracePrint "阅读:" & ReadNum
				TracePrint "未找到1"
			End If
		End If
	Else 
		If Test = 1 Then
			TracePrint "未找到2"
		End If
	End If
End Function

Function 三点复制(intX, intY, Text)
	If Test = 1 Then
		TracePrint "三点复制(" & intX & ")(" & intY & ")(" & Text & ")"
	End If
	Delay 50
	MoveTo intX_, intY_
	Delay 100
	LeftClick 1
	LeftClick 1
	Delay 100
	LeftClick 1
	Delay 100
	KeyDown "Ctrl", 1
	KeyPress "C", 1
	KeyUp "Ctrl", 1
	Delay 100
End Function

Function 鼠标单击(X,Y,Txt)
	MoveTo X, Y
	LeftClick 1
	Delay 500
	If Test = 1 Then
		TracePrint "鼠标单击(" & X & ")(" & Y & ")(" & Txt & ")"
	End If
End Function

Function 进入推文正文页(i)
	Delay 1000
	Call 鼠标单击(175,50,"点击复制网址按钮")	
	//获得剪切板网址
	WxUrl = Plugin.Sys.GetCLB()
	Plugin.Sys.SetCLB("")
	If Test = 1 Then
		TracePrint "推文网址：" & WxUrl
	End If
	MyPosWxUrl = Instr(WxUrl, "/s/")
	If Test = 1 Then
		TracePrint "[MyPosWxUrl]：" & MyPosWxUrl
	End If
	If MyPosWxUrl > 0 Then 
		WxUrl = Replace(WxUrl, "https://mp.weixin.qq.com/s/","") 
		If Test = 1 Then
			TracePrint "推文网址Key：" & WxUrl
		End If
		查找点赞位置(a)
	End If
End Function

Function 复制推文时间(intY)
	intY = intY+55
	If Test = 1 Then
		TracePrint "时间坐标：(intX：13|120)(intY：" & intY+55 & ")"
	End If
	Delay 50
	MoveTo 13, intY
	Delay 50
	LeftDown 1
	Delay 50
	MoveTo 120, intY
	Delay 50
	LeftUp 1
	Delay 50
	KeyDown "Ctrl", 1
	KeyPress "C", 1
	KeyUp "Ctrl", 1
	Delay 50
	WxDate = Plugin.Sys.GetCLB()
	Plugin.Sys.SetCLB("")
	If Test = 1 Then
		TracePrint "推文时间：" & WxDate
	End If
	Delay 50
	//复制推文时间
End Function

Function 复制推文标题(intY)
	intY = intY+28
	If Test = 1 Then
		TracePrint "标题坐标：(intX：13|120)(intY：" & intY + 28 & ")"
	End If
	Delay 50
	MoveTo 13, intY
	Delay 50
	LeftDown 1
	Delay 50
	MoveTo 1100, intY
	Delay 50
	LeftUp 1
	Delay 50
	KeyDown "Ctrl", 1
	KeyPress "C", 1
	KeyUp "Ctrl", 1
	Delay 50
	WxTitle = Plugin.Sys.GetCLB()
	Plugin.Sys.SetCLB("")
	WxTitle = Replace(WxTitle, "&", "|")
	If Test = 1 Then	
		TracePrint "推文标题：" & WxTitle
	End If
	Call Plugin.Sys.SetCLB("")

	Delay 50
End Function

Function 获取推文标题坐标(a)
	Call 鼠标单击(9, 85, "激活窗口2")
	Dim _间隔线Y
	_间隔线Y = 71
	间隔线Y=""
	k=0
	For i = 0 To 11
		//查找间隔线
    	FindColor 1110,_间隔线Y,1110,1094,"F2F1F1",intX,intY
		If intX > 0 And intY > 0 Then 
			If k = 0 Then 
				竖线 = ""
			Else 
				竖线 = "|"
			End If
			_间隔线Y = intY + 1
			间隔线Y = 间隔线Y&竖线&intY
			k=k+1
		End If
	Next
	If Test = 1 Then
		TracePrint "间隔线Y-->：" & 间隔线Y
	End If
End Function
