//注册信息
mui.init();
mui.plusReady(function(){
	
	/*定义全局变量*/
	var phoneName = document.getElementById("username");
	var setCode = document.getElementById("set-code");
	var obtainCode = document.getElementById("obtain-code");
	var reg = document.getElementById("reg");
	var phoneCode=false;
	var codeVal2 = false;
	var state = 0;
		
	phoneName.addEventListener('blur', function() {
		phoneVal();
	});
	
	setCode.addEventListener('blur', function() {
		codeVal();
	});

	/*点击获取验证码*/
	obtainCode.addEventListener('tap',function(){
		//console.log(phoneCode)
		sendAuthentication();
	})
	
	/*注册按钮*/
	reg.addEventListener('tap',function(){
		if(phoneCode&&codeVal2){
			mui.openWindow({
      			url:'setpass.html',
      			id:'setpass.html',
      			extras:{
					phoneName:phoneName.value,
					setCode:setCode.value,
					state:state
				}
      		});	
		}else{
			phoneVal();
			codeVal();	
		}
	})
	
	/*校验手机号*/
	function phoneVal(){
		var hunPhone=/^1[3|4|5|7|8]\d{9}$/;
		if(phoneName.value.length==0){
			plus.nativeUI.toast("手机号不能为空",toastStyle)
			document.querySelector('.frmactive').style.display="none";
			document.querySelector('.frmactive2').style.display="block";
			phoneCode=false;
      	}else{
			if(hunPhone.test(phoneName.value)){
				isReg(); 
			}else{
				plus.nativeUI.toast("请输入正确的手机号码",toastStyle);
				phoneCode=false;
			}
		}
	}
	
	/*校验用户名是否注册*/
	function isReg() {
		mui.ajax(baseUrl+'/ajax/isReg?key='+phoneName.value,{
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				if(data.data == false) {
					//mui.back();
					phoneCode=false;
					//alert(phoneCode);
					plus.nativeUI.toast("您的手机已被注册",toastStyle);
				}else{
					//plus.nativeUI.toast(phoneCode,toastStyle);
					phoneCode=true;
					return phoneCode; 
				}
			},
			error: function() {
					plus.nativeUI.toast("服务器链接超时",toastStyle);
					phoneCode=false;
					
			}
		})
	}

	/*手机发送验证码*/
	function sendAuthentication(){
		console.log(phoneCode)
		if(phoneCode){
			mui.ajax(baseUrl+'/ajax/regmobilephone',{
				data:{mobilePhone:phoneName.value},
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				async: false,
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						state=data.data;
						console.log(state)
						doClick();
					}
				},
				error: function() {
						plus.nativeUI.toast("服务器链接超时",toastStyle);
				}
			})
		}
	}
	
	/*30s后重新获取验证码*/
	function doClick() {
		var getCodeOff = document.getElementById("getcodeoff");
		obtainCode.style.display = "none";
		getCodeOff.style.display = "block";
		getCodeOff.innerHTML = "30s后重新获取";
		var clickTime = new Date().getTime();
		var Timer = setInterval(function() {
			var nowTime = new Date().getTime();
			var second = Math.ceil(30 - (nowTime - clickTime) / 1000);
			if(second > 0) {
				getCodeOff.innerHTML = second + "s后重新获取";
			} else {
				clearInterval(Timer);
			    obtainCode.style.display = "block";
				getCodeOff.style.display = "none";
				obtainCode.innerHTML = "获取验证码";
			}
		}, 1000);
	}
	
	/*校验验证码*/
	function codeVal(){
		//console.log(state)
		if(setCode.value.length==0){
			plus.nativeUI.toast("验证码不能为空",toastStyle);
			codeVal2 = false;
			document.querySelector('.frmactive').style.display="none";
			document.querySelector('.frmactive2').style.display="block";
      	}else{
      		document.querySelector('.frmactive2').style.display="none";
		    document.querySelector('.frmactive').style.display="block";
      		mui.ajax(baseUrl+'/ajax/validCode',{
				data:{"state":state,"vc":setCode.value},
				dataType: 'json', //数据格式类型
				async: false,
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					console.log(data.data);
					if(data.success){
						console.log(data.success);
						if(data.data){
							//plus.nativeUI.toast("验证码输入正确",toastStyle);
							codeVal2 = true;
						}else{
							plus.nativeUI.toast("验证码不正确",toastStyle);
							codeVal2 = false;
						}
					}else{
						plus.nativeUI.toast("验证超时",toastStyle);
						codeVal2 = false;
						console.log(data.msg);
					}
				},
				error: function() {
						plus.nativeUI.toast("服务器链接超时",toastStyle);
						codeVal2 = false;
				}
			})
      	}
	}
	
	
})