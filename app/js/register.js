//注册信息
mui.ready(function() {
	
	/*定义全局变量*/
	var name = document.getElementById("name");
	var phoneName = document.getElementById("username");
	var setCode = document.getElementById("set-code");
	var obtainCode = document.getElementById("obtain-code");
	var setpassword = document.getElementById("setpassword");
	var reg = document.getElementById("reg");
	var protocollink = document.getElementById("protocollink");
	var imgCode = document.getElementById("imgCode");
	var changImage = document.getElementById("changImage")
	var phoneCode = false;
	var state = 0;
	
	mui.plusReady(function() {

		/*校验提交按钮显示状态*/
		mui('.frmboxNew').on('keyup', "#name,#username,#imgCode,#set-code,#setpassword", function() {
			if(name.value == "" || phoneName.value == "" || imgCode.value == "" || setCode.value == "" || setpassword.value == "") {
				reg.classList.remove("frmactiveok");
				reg.disabled = "disabled";
			} else {
				reg.classList.add("frmactiveok");
				reg.disabled = "";
			}
		});
		
		phoneName.addEventListener('input', function() {
			if(phoneName.value==""){
				obtainCode.disabled = "disabled";
			}else{
				obtainCode.disabled = "";
			}
		})

		/*点击获取验证码*/
		obtainCode.addEventListener('tap', function() {
			phoneVal();
		})

		/*注册按钮*/
		reg.addEventListener('tap', function() {
			var inputval = name.value.replace(/[^\u0000-\u00ff]/g, "aa").length;
			var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
			var oNum=/^\d{4}$/;
			if(inputval > 20) {
				plus.nativeUI.toast("姓名最长为10个汉字或20个英文字符", toastStyle);
				return;
			} 
			if(!hunPhone.test(phoneName.value)) {
				plus.nativeUI.toast("请输入正确的手机号码", toastStyle);
				return;
			}
			if(imgCode.value.length==0) {
				plus.nativeUI.toast("请输入图形验证码", toastStyle);
				return;
			}else if(imgCode.value.length==4){
				
			}else{
				plus.nativeUI.toast("图形验证码4位", toastStyle);
				return;
			}
			if(!oNum.test(setCode.value)) {
				plus.nativeUI.toast("验证码为4位数字", toastStyle);
				return;
			}
			if(setpassword.value.length < 6){
				plus.nativeUI.toast("密码由6-24个字符组成，区分大小写", toastStyle);
				return;
			}
			isReg(1);
			//completeReg()
		})
		
		/*用户协议*/
		protocollink.addEventListener('tap',function(){
			mui.openWindow({
				url: '../html/privacy.html',
				id: '../html/privacy.html',
				show: {
					aniShow: "slide-in-right"
				}
			});
		});
		
		changImage.addEventListener("tap",function(){ 
			this.setAttribute("src",baseUrl+"/ajax/PictureVC?"+new Date().getTime());
		})
		/*校验手机号*/
		function phoneVal() {
			if(imgCode.value=="") {
				plus.nativeUI.toast("请输入图形验证码", toastStyle);
				return;
			}
			var hunPhone = /^1[3|4|5|7|8]\d{9}$/;
			if(hunPhone.test(phoneName.value)){
				isReg();
			} else {
				plus.nativeUI.toast("请输入正确的手机号码", toastStyle);
				return;
			}
		}

		/*校验用户名是否注册*/
		function isReg(arg) {
			var oArg=arg;
			mui.ajax(baseUrl + '/ajax/isReg?key=' + phoneName.value, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.data == false) {
						plus.nativeUI.toast("该账号已存在，请直接登录", toastStyle);
						return;
					} else {
						if(oArg==1){
							completeReg()
							//sendAuthentication(1)
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
			console.log(phoneName.value)
			console.log(imgCode.value)
			var cookieValue=plus.navigator.getCookie(baseUrl+"/ajax/PictureVC");
			console.log(cookieValue)
			//plus.navigator.setCookie( baseUrl + '/ajax/regmobilephone', cookieValue )
			mui.ajax(baseUrl + '/ajax/regmobilephone', {
				header:{
					"Cookie":cookieValue
				},
				data: {
					mobilePhone: phoneName.value,
					vcode: imgCode.value
				},
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				async: true,
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						state = data.data;
							doClick();
						
					}else{
						if(data.code==20001) {
							plus.nativeUI.toast("请输入正确的图形验证码", toastStyle);
							changImage.setAttribute("src",baseUrl+"/ajax/PictureVC?"+new Date().getTime());
						}
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
					changImage.setAttribute("src",baseUrl+"/ajax/PictureVC?"+new Date().getTime());
				}
			}, 1000);
		}
		/*校验验证码*/
		function codeVal() {
			mui.ajax(baseUrl + '/ajax/validCode', {
				data: {
					"state": state,
					"vc": setCode.value
				},
				dataType: 'json', //数据格式类型
				async: false,
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(data.success);
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

		//注册提交
		function completeReg() {
			mui.ajax(baseUrl + '/ajax/mobileReg', {
				data: {
					state: state,
					mobilePhone: phoneName.value,
					validateCode: setCode.value,
					password: setpassword.value,
					name:name.value
				},
				dataType: 'json', //数据格式类型
				type: 'post', //http请求类型
				//async: false,
				success: function(data) {
					if(data.success) {
						var userId = data.data;
						plus.storage.setItem('userid', userId);
						plus.storage.setItem('name', name.value);
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
					}else{
						if(data.code==-1){
							plus.nativeUI.toast("验证码已过期，请重新获取", toastStyle);
						}else if(data.code==-2 || data.code==-3 ||data.code==0){
							plus.nativeUI.toast("验证码错误，请检查后重试", toastStyle);
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		}
		
	});
});