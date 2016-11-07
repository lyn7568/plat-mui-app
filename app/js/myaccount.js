//我的账号
mui.plusReady(function(){
	
	/*定义全局变量*/
	var loginYes = document.getElementById("loginYes");
	var loginNo = document.getElementById("loginNo");
	var goLogin = document.getElementById("gologin");
	var goReg = document.getElementById("goreg");
	var removeId = document.getElementById("removeid");
	var userId = plus.storage.getItem('userid');
	
	mui.ready(function() {
		
	   /*判断登录是否成功*/
	   loginStatus();
	   
	   /*用户信息初始化*/
	   userInformation()
	   
       /*退出按钮*/
		removeId.addEventListener('tap',function(){
			var btn=["退出","取消"];
			mui.confirm("是否退出","提示",btn,function(e){
				if(e.index==0)
				{ 
					plus.storage.removeItem("userid");
					mui.currentWebview.close();
				}
			});
		})
		
		goLogin.addEventListener('tap',function(){
			goLoginFun();
		})
		goReg.addEventListener('tap',function(){
			goRegFun();
			
		})

		
		function loginStatus(){
			if(userId && userId != "null" && userId!=null){
				loginYes.style.display="block";
			}else{
				loginNo.style.display="block";
			}
		}
		
		function userInformation(){
			mui.ajax(baseUrl + "/ajax/professor/editBaseInfo/" + userId, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					var  $info = data.data || {}	
					if(data.success && data.data){
						document.getElementById("userName").innerText = $info.name || '';
						document.getElementById("userTitle").innerText = $info.title || '';
						document.getElementById("userPosition").innerText = $info.office || '';
						document.getElementById("userDepartment").innerText = $info.department || '';
						document.getElementById("userMechanism").innerText = $info.orgName || '';
						document.getElementById("userCity").innerText = $info.address || '';
						if($info.hasHeadImage==1){
							document.getElementById("userImg").setAttribute("src", "../images/head/" + $info.id + "_m.jpg");
						}else{
							document.getElementById("userImg").setAttribute("src", "../images/default-photo.jpg");
						}
						console.log($info.hasHeadImage);
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		
	});

});