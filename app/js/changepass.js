//注册信息
mui.ready(function() {
	
	/*定义全局变量*/
	var restPassword = document.getElementById("restPassword");
	var oldPassword = document.getElementById("oldPassword");
	var newPassword = document.getElementById("newPassword");
	var newPassword2 = document.getElementById("newPassword2");
	
	/*校验修改密码按钮显示状态*/
	mui('.maincon').on('keyup', "#oldPassword,#newPassword,#newPassword2", function() {
		hideButtn2(oldPassword,newPassword,restPassword,"frmactiveok",newPassword2);
	});
	
	/*修改密码按钮*/
	restPassword.addEventListener('tap', function() {
		valOld();
    })
	
	function valOld(){
		if(oldPassword.value.length < 6 || newPassword.value.length < 6 || newPassword2.value.length < 6){
			plus.nativeUI.toast("密码不少于6位，请输入正确的密码", toastStyle);
			return;
		}else if(oldPassword.value == newPassword.value){
			plus.nativeUI.toast("新旧密码不能一致", toastStyle);
			return;
		}else if(newPassword2.value != newPassword.value){
			plus.nativeUI.toast("两次输入密码不一致", toastStyle);
			return;
		}else{
			modifySuccess();
		}
	}
	
	/*修改密码*/
	function modifySuccess() {
		var userId = plus.storage.getItem('userid');
		console.log(userId)
		mui.ajax(baseUrl + '/ajax/cp', {
			data:{
				"id":userId,
				"npw":newPassword2.value,
				"onw":oldPassword.value
			},
			dataType: 'json', //数据格式类型
			type: 'post', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				console.log(data.success)
				if(data.data){
					plus.nativeUI.toast("密码修改成功",toastStyle);
					mui.currentWebview.close();
					goLoginFun();
					return;
				}else{
					plus.nativeUI.toast("原密码填写错误",toastStyle);
					return;
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
	}

	

})