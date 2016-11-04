//注册信息
mui.init();
mui.plusReady(function(){
	
	/*定义全局变量*/
	var phoneName = document.getElementById("username");
	var setCode = document.getElementById("set-code");
	var obtainCode = document.getElementById("obtain-code");
	var reg = document.getElementById("reg");
	var login = document.getElementById("login");
	var phoneCode=false;
	var state = 0;
	
	/*点击登录页面*/
	login.addEventListener('tap',function(){
		mui.openWindow({
  			url:'setpass.html',
  			id:'setpass.html',
  			show:{
            	aniShow:"slide-in-right"
  			}
      	});	
	})
	
	/*校验提交按钮显示状态*/
	mui('.frmbox').on('keyup',"#username,#set-code",function() {
		hideButtn();
	});
	
	/*点击获取验证码*/
	obtainCode.addEventListener('tap',function(){
		if(phoneCode){
			sendAuthentication();	
		}else{
			phoneVal();
		}
	})
	
	/*注册按钮*/
	reg.addEventListener('tap',function(){
		if(phoneCode){
			codeVal();	
		}else{
			phoneVal();	
		}
	})
	
	/*校验按钮显示状态*/
	function hideButtn(){
		if(phoneName.value==""||setCode.value==""){
			reg.classList.remove('frmactiveok');
			reg.disabled="disabled";
		}else{
			reg.classList.add('frmactiveok');
			reg.disabled="";
		}
	}
	
	/*校验手机号*/
	function phoneVal(){
		var hunPhone=/^1[3|4|5|7|8]\d{9}$/;
		if(hunPhone.test(phoneName.value)){
			isReg(); 
		}else{
			plus.nativeUI.toast("请输入正确的手机号码",toastStyle);
			return;
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
					plus.nativeUI.toast("您的手机已被注册",toastStyle);
					return;
				}else{
					phoneCode=true;
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时",toastStyle);
			}
		});
	}

	/*手机发送验证码*/
	function sendAuthentication(){
		mui.ajax(baseUrl+'/ajax/regmobilephone',{
			data:{mobilePhone:phoneName.value},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			async: false,
			timeout: 10000, //超时设置
			success: function(data) {
				if(data.success) {
					state=data.data;
					doClick();
				}
			},
			error: function() {
					plus.nativeUI.toast("服务器链接超时",toastStyle);
					return;
			}
		})
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
  		mui.ajax(baseUrl+'/ajax/validCode',{
			data:{"state":state,"vc":setCode.value},
			dataType: 'json', //数据格式类型
			async: false,
			type: 'POST', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				console.log(data.success);
				if(data.success){
					if(data.data){
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
						plus.nativeUI.toast("验证码不正确",toastStyle);
						return;	
					}
				}else{
					plus.nativeUI.toast("验证超时,请重新获取",toastStyle);
					return;	
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时",toastStyle);
				return;
			}
		})
    }
	
	
})