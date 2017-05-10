mui.plusReady(function() {
var ws = plus.webview.currentWebview();
var phone=document.getElementById("phone");
var getPhoneCode=document.getElementById("getPhoneCode");
var oPhoneCode=document.getElementById("phoneCode");
var weiChatName=document.getElementById("weiChatName");
var setpassword=document.getElementById("setpassword");
var binding=document.getElementById("binding");
var state = 0;
var phoneCode = false;
document.getElementById("weiChatName").value=ws.name;
phone.addEventListener("keyup",function(){
	if(phone.value==""){
		getPhoneCode.setAttribute("disabled","disabled");
	}else{
		if(getPhoneCode.getAttribute("disabled")==null){
			return;
		}
		getPhoneCode.removeAttribute("disabled")
	}
})
/*校验提交按钮显示状态*/
		mui('.frmboxNew').on('keyup', "#weiChatName,#phone,#phoneCode,#setpassword", function() {
			if(weiChatName.value == "" || phone.value == "" || oPhoneCode.value == "" || setpassword.value == "") {
				binding.setAttribute("disabled","disabled");
			} else {
				if(binding.getAttribute("disabled")==null) {
					return;
				}
				binding.removeAttribute("disabled");
			}
		});
		
		/*校验手机号*/
		getPhoneCode.addEventListener("tap",function(){
			phoneVal();
		})
		function phoneVal() {
			var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
			if(hunPhone.test(phone.value)) {
				isReg();
			} else {
				plus.nativeUI.toast("请输入正确的手机号码", toastStyle);
				return;
			}
		}

		/*校验用户名是否注册*/
		function isReg(arg) {
			var oArg=arg;
			mui.ajax(baseUrl + '/ajax/isReg?key=' + phone.value, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.data == false) {
						if(oArg==1) {
							plus.nativeUI.toast("该账号已存在", toastStyle);
						}else{
							plus.nativeUI.toast("该账号已存在，请直接登录", toastStyle);
						}
						return;
					} else {
						if(oArg==1){		
							codeVal();
						}else{							
						phoneCode = true;
						if(phoneCode){
							sendAuthentication();
						}
						}
						
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		/*手机发送验证码*/
		function sendAuthentication() {
			console.log("send code")
			mui.ajax(baseUrl + '/ajax/regmobilephone', {
				data: {
					mobilePhone: phone.value
				},
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				async: false,
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						state = data.data;
						console.log(state);
						doClick();
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			})
		}
	/*30s后重新获取验证码*/
		function doClick() {
			var getCodeOff = document.getElementById("getcodeoff");
			getPhoneCode.style.display = "none";
			getCodeOff.style.display = "block";
			getCodeOff.value = "60s后重新获取";
			var clickTime = new Date().getTime();
			var Timer = setInterval(function() {
				var nowTime = new Date().getTime();
				var second = Math.ceil(60 - (nowTime - clickTime) / 1000);
				if(second > 0) {
					getCodeOff.value = second + "s后重新获取";
				} else {
					clearInterval(Timer);
					getPhoneCode.style.display = "block";
					getCodeOff.style.display = "none";
					getPhoneCode.value = "获取验证码";
				}
			}, 1000);
		}
		/*校验验证码*/
		function codeVal() {
			console.log(state);
			console.log(oPhoneCode.value)
			mui.ajax(baseUrl + '/ajax/validCode', {
				data: {
					"state": state,
					"vc": oPhoneCode.value
				},
				dataType: 'json', //数据格式类型
				async: false,
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(JSON.stringify(data));
					if(data.success) {
						if(data.data) {
							completeReg();
						}else{
							plus.nativeUI.toast("验证码错误，请检查后重试", toastStyle);
							return;
						}
					}else{
						console.log(data.msg);
						if(data.msg=="验证超时"){
							plus.nativeUI.toast("验证码已过期，请重新获取", toastStyle);
							return;
						}else{
							plus.nativeUI.toast("请填写正确的手机号,验证码", toastStyle);
							return;
						}
						
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			})
		}
		binding.addEventListener("tap",function(){
			var nameval = /^\w{0,20}$/;
			var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
			var oNum=/^\d{4}$/;
			if(nameval.test(weiChatName.value)) {
				plus.nativeUI.toast("姓名最长为10个汉字或20个英文字符", toastStyle);
				return;
			} 
			if(!hunPhone.test(phone.value)) {
				plus.nativeUI.toast("请输入正确的手机号码", toastStyle);
				return;
			}
			if(!oNum.test(oPhoneCode.value)) {
				plus.nativeUI.toast("验证码为4位数字", toastStyle);
				return;
			}
			if(setpassword.value.length < 6){
				plus.nativeUI.toast("密码由6-24个字符组成，区分大小写", toastStyle);
				return;
			}
			isReg(1);
		});
		//绑定提交
		function completeReg() {
			console.log(state)
			console.log(ws.openid);
			console.log(phoneCode.value);
			
			mui.ajax(baseUrl + '/ajax/mobileReg', {
				data: {
					state: state,
					mobilePhone: phone.value,
					validateCode: oPhoneCode.value,
					password: setpassword.value,
					name:weiChatName.value,
					oauthType :"weixin" , 
					openid : ws.openid
				},
				dataType: 'json', //数据格式类型
				type: 'post', //http请求类型
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						var userId = data.data;
						plus.storage.setItem('userid', userId);
						plus.nativeUI.toast("已完成注册，请填写个人信息", toastStyle);
						mui.openWindow({
							url: 'fill-select.html',
							id: 'fill-select.html',
							extras: {
								userid: userId
							},
							show: {
								aniShow: "slide-in-right"
							}
						});
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		}
		/*点击已有账号跳已有账号页面*/
		document.getElementById("alreadyAccount").addEventListener("tap",function(){
			mui.openWindow({
							url: '../html/backBindOn.html',
							id: 'backBindOn.html',
							show: {
								aniShow: "slide-in-right"
							},
							extras: {
								openid:ws.openid
							}
						});
		})
		/*用户协议*/
		document.getElementById("protocollink").addEventListener('tap',function(){
			mui.openWindow({
				url: '../html/privacy.html',
				id: '../html/privacy.html',
				show: {
					aniShow: "slide-in-right"
				}
			});
		});
})