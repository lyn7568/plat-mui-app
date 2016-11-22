//我的账号
mui.ready(function() {

	/*定义全局变量*/
	var loginYes = document.getElementById("loginYes");
	var loginNo = document.getElementById("loginNo");
	var goLogin = document.getElementById("gologin");
	var goReg = document.getElementById("goreg");
	var goSetup = document.getElementById("goSetup");
	var goZixun = document.getElementById("goZixun");
	var oEdit = document.getElementById("editbox");
	var goFollow = document.getElementById("goFollow");

	mui.plusReady(function() {

		var userId = plus.storage.getItem('userid');
		/*判断登录是否成功*/
		loginStatus();

		/*用户信息初始化*/
		userInformation()

		/*登录按钮*/
		goLogin.addEventListener('tap', function() {
			goLoginFun();
		})

		/*注册按钮*/
		goReg.addEventListener('tap', function() {
			goRegFun();

		})

		/*退出登录刷新页面*/
		window.addEventListener('closeUser', function(event) {
			userId = event.detail.id;
			loginStatus();
		});

		function loginStatus() {
			if(userId && userId != "null" && userId != null) {
				loginYes.style.display = "block";
				loginNo.style.display = "none";

				/*设置按钮*/
				goSetup.addEventListener('tap', function() {
					mui.openWindow({
						url: '../html/setup.html',
						id: '../html/setup.html',
						show: {
							aniShow: "slide-in-right"
						}
					});
				})

				/*我的关注*/
				goFollow.addEventListener('tap', function() {
					plus.nativeUI.showWaiting(); //显示原生等待框
					plus.webview.create("../html/attentions.html");
				})

				/*我的修改*/
				oEdit.addEventListener('tap', function() {
					mui.openWindow({
						url: '../html/proinforupdate.html',
						id: 'html/proinforupdate.html',
						show: {
							autoShow: false,
							aniShow: "slide-in-left"
						},

					});
				})
				
				/*我的历史和评价*/
				goZixun.addEventListener('tap', function() {
					mui.openWindow({
						url: '../html/coophistory.html',
						id: 'html/coophistory.html',
						show: {
							autoShow: false,
							aniShow: "slide-in-left"
						},

					});
				})

			} else {
				loginNo.style.display = "block";
				loginYes.style.display = "none";
				mui(".mui-content").on("tap", "#goZixun,#goFollow,#goNewuser,#goSetup", function() {
					goLoginFun();
				})
			}
		}

		function userInformation() {
			mui.ajax(baseUrl + "/ajax/professor/editBaseInfo/" + userId, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					var $info = data.data || {}
					if(data.success && data.data) {
						document.getElementById("userName").innerText = $info.name || '';
						document.getElementById("userTitle").innerText = $info.title || '';
						document.getElementById("userPosition").innerText = $info.office || '';
						document.getElementById("userDepartment").innerText = $info.department || '';
						document.getElementById("userMechanism").innerText = $info.orgName || '';
						document.getElementById("userCity").innerText = $info.address || '';
						document.getElementById("zixunOk").innerText = $info.consultCount || '';
						var startLeval = parseInt($info.starLevel);
						var start = document.getElementsByClassName("star");
						for(var i = 0; i < startLeval; i++) {
							start[i].classList.add("icon-favorfill");
						}
						if($info.hasHeadImage == 1) {
							document.getElementById("userImg").setAttribute("src", "../images/head/" + $info.id + "_m.jpg");
						} else {
							document.getElementById("userImg").setAttribute("src", "../images/default-photo.jpg");
						}
						if($info.authentication) {
							document.querySelector('.authicon').style.display = "inline";
						} else {
							document.querySelector('.unauthicon').style.display = "inline";
						}

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