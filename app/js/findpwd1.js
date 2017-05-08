//手机找回密码
mui.ready(function() {
	
	/*定义全局变量*/
	var userPhone = document.getElementById("userPhone");
	var userCode = document.getElementById("userCode");
	var nextPage = document.getElementById("nextPage");
	var obtainCode = document.getElementById("obtain-code");
	var gopaer = document.getElementById("gopaer");
	var phoneCode = false;
	var state = "";
	var num;
	
	mui.plusReady(function(){
		
		/*校验提交按钮显示状态*/
		mui('.frmboxNew').on('keyup', "#userPhone,#userCode", function() {
			hideButtn(userPhone,userCode,nextPage,"frmactiveok");
		});
		
		/*下一步按钮*/
		nextPage.addEventListener('tap', function() {
			codeVal();
		})
		
		/*点击获取验证码*/
		obtainCode.addEventListener('tap', function() {
			phoneVal();
		})
		
		userPhone.addEventListener('keyup', function() {
			if(userPhone.value==""){
				obtainCode.disabled = "disabled";
			}else{
				obtainCode.disabled = "";
			}
		})
		
		/*点击又想起来了*/
		gopaer.addEventListener('tap', function() {
			mui.back();
		})
		
		/*校验手机号*/
		function phoneVal() {
			var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
			if(hunPhone.test(userPhone.value)) {
				isReg();
			} else {
				plus.nativeUI.toast("请输入正确的手机号码", toastStyle);
				return;
			}
		}
		
		/*校验用户名是否注册*/
		function isReg() {
			mui.ajax(baseUrl + '/ajax/isReg?key=' + userPhone.value, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				//async: false,
				success: function(data) {
					console.log(data.data);
					if(data.data == false) {
						phoneCode = true;
						if(phoneCode){
							sendAuthentication();
						}
					} else {
						plus.nativeUI.toast("该账号不存在，请检查后重试", toastStyle);
						return;
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		}
		
		/*手机发送验证码*/
		function sendAuthentication() {
			mui.ajax(baseUrl + '/ajax/vcWithRP', {
				data: {
					mobilePhone: userPhone.value
				},
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				//async: false,
				success: function(data) {
					console.log(data)
					if(data.success) {
						state = data.data;
						doClick();
						return;
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
			obtainCode.style.display = "none";
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
					obtainCode.style.display = "block";
					getCodeOff.style.display = "none";
					obtainCode.value = "获取验证码";
				}
			}, 1000);
		}

		/*校验验证码*/
		function codeVal() {
			mui.ajax(baseUrl + '/ajax/validCode', {
				data: {
					"state": state,
					"vc": userCode.value
				},
				dataType: 'json', //数据格式类型
				async: false,
				type: 'POST', //http请求类型
				success: function(data) {
					console.log(data.success);
					console.log(data.data);
					if(data.success) {
						if(data.data) {
							mui.openWindow({
								url: 'setpass.html',
								id: 'setpass.html',
								extras: {
									phoneName: userPhone.value,
									setCode: userCode.value,
									state: state,
									num:1
								}
							});
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

	
	});
	
});