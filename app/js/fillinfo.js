//注册完成个人信息
mui.init();
mui.plusReady(function(){
	/*定义全局变量*/
	//var userid = plus.storage.getItem('userid');
	var userName = document.getElementById("userName");
	var userMechanism = document.getElementById("userMechanism");
	var userDepartment = document.getElementById("userDepartment");
	var userPosition = document.getElementById("userPosition");
	var userTitle = document.getElementById("userTitle");
	var goIndex = document.getElementById("goIndex");
	var self=plus.webview.currentWebview();
	
	/*校验提交按钮显示状态*/
	mui('.basicinfo').on('keyup',"#userName,#userMechanism",function() {
		hideButtn();
	});
	
	/*提交个人信息*/
	goIndex.addEventListener('tap', function() {
		goVal();
	});
	
	function hideButtn(){
		if(userName.value==""||userMechanism.value==""){
			goIndex.classList.remove('frmactiveok');
			goIndex.disabled="disabled";
		}else{
			goIndex.classList.add('frmactiveok');
			goIndex.disabled="";
		}
	}
	
	function goVal(){
		var $data = {};
		$data.name = userName.value;				
		$data.orgName = userMechanism.value;
		$data.title = userTitle.value;
		$data.department = userDepartment.value;
		$data.address = userPosition.value;
		$data.id = self.userid;
		mui.ajax(baseUrl + '/ajax/professor', {
			data:$data,
			dataType: 'json', //数据格式类型
			type: 'POST', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				console.log(data.success);
				if(data.success) {
					mui.openWindow({
		      			url:'../index.html',
		      			id:'../index.html',
						show:{
							aniShow:"slide-in-right"
						}
		      		});	
				}else{
					plus.nativeUI.toast("提交失败，用户ID失效", toastStyle);
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		})
	}
	
});