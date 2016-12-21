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
	var userImg = document.getElementById("userImg");
	var nameli = document.getElementById("nameli");
	var infobasic = document.getElementsByClassName("infobasic")[0];
	var oFlag;
	mui.plusReady(function() {

		var userId = plus.storage.getItem('userid');
		console.log(userId);
		/*判断登录是否成功*/
		loginStatus();

		/*用户信息初始化*/
		userInformation();

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
			console.log(userId);
			loginStatus();
			userInformation()
		});
		//在修改上传图片触发的事件
		window.addEventListener('photoUser', function(event) {
					nameli.classList.remove(nameli.classList[2])
					nameli.classList.remove(nameli.classList[2]);
			nameli.innerHTML = ""			
			userInformation();
		});

		function loginStatus() {
			console.log(userId);
			if(userId && userId != "null" && userId != null) {
				loginNo.style.display = "none";
				loginYes.style.display = "block";
				//alert('dd')
				/*设置*/
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
					mui.openWindow({
						url: '../html/attentions.html',
						id: '../html/attentions.html',
						show: {
							autoShow: false,
							aniShow: "slide-in-right"
						}
					});
				})

				/*我的修改专家*/
				infobasic.addEventListener('tap', function() {
					if(oFlag == 1) {
						mui.openWindow({
							url: '../html/proinforupdate.html',
							id: 'html/proinforupdate.html',
							show: {
								autoShow: false,
								aniShow: "slide-in-left"
							},

						});
					} else if(oFlag == 2) {
						/*我的修改企业工作者*/
						mui.openWindow({
							url: '../html/companyUpdata.html',
							id: 'html/companyUpdata.html',
							show: {
								autoShow: false,
								aniShow: "slide-in-left"
							},

						});
					} else if(oFlag == 3) {
						/*我的修改学生*/
						mui.openWindow({
							url: '../html/studentUpdata.html',
							id: 'html/studentUpdata.html',
							show: {
								autoShow: false,
								aniShow: "slide-in-left"
							},

						});
					}
				})
				oEdit.addEventListener('tap', function() {
					if(oFlag == 1) {
						mui.openWindow({
							url: '../html/proinforupdate.html',
							id: 'html/proinforupdate.html',
							show: {
								autoShow: false,
								aniShow: "slide-in-left"
							},

						});
					} else if(oFlag == 2) {
						/*我的修改企业工作者*/
						mui.openWindow({
							url: '../html/companyUpdata.html',
							id: 'html/companyUpdata.html',
							show: {
								autoShow: false,
								aniShow: "slide-in-left"
							},

						});
					} else if(oFlag == 3) {
						/*我的修改学生*/
						mui.openWindow({
							url: '../html/studentUpdata.html',
							id: 'html/studentUpdata.html',
							show: {
								autoShow: false,
								aniShow: "slide-in-left"
							},

						});
					}
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
				mui("#loginNo").on("tap", "li", function() {
					goLoginFun();
				})
			}
		}

		function userInformation() {
			mui.ajax(baseUrl + "/ajax/professor/editBaseInfo/" + userId, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				async: false,
				success: function(data) {
					var $info = data.data || {};
					oFlag = $info.authentication;
					console.log(oFlag)
					if(data.success && data.data) {
						document.getElementById("userName").innerText = $info.name || '';
						var userTitle = document.getElementById("userTitle");
						var userPosition = document.getElementById("userPosition");
						var userDepartment = document.getElementById("userDepartment");
						var userMechanism = document.getElementById("userMechanism");
						var userCity = document.getElementById("userCity");
						var zixunOk = document.getElementById("zixunOk");
						if($info.title) {
							if($info.office) {
								userTitle.innerText = $info.title + "，"
							} else {
								userTitle.innerText = $info.title
							}

						}
						($info.office) ? userPosition.innerText =$info.office: userPosition.innerText = '';
						if($info.department) {
							if($info.orgName) {
								userDepartment.innerText=$info.department+"，"
							}else{
								if($info.address){
									userDepartment.innerText=$info.department+" | "
								}else{
									userDepartment.innerText=$info.department;
								}
							}
						}
						if($info.orgName) {
							if($info.address){
									userMechanism.innerText=$info.orgName+" | "
								}else{
									userMechanism.innerText=$info.orgName;
								}
						}
						($info.address != '') ? userCity.innerText =$info.address: userCity.innerText = '';
						($info.consultCount != '') ? zixunOk.innerText = $info.consultCount: zixunOk.innerText = '0';

						var startLeval = parseInt($info.starLevel);
						var start = document.getElementsByClassName("star");
						for(var i = 0; i < startLeval; i++) {
							start[i].classList.add("icon-favorfill");
							start[i].classList.remove("icon-favor");
						}
						if($info.hasHeadImage == 1) {
							userImg.setAttribute("src", baseUrl + "/images/head/" + $info.id + "_l.jpg");
						} else {
							userImg.setAttribute("src", baseUrl + "/images/default-photo.jpg");
						}
						if($info.authType) {
							nameli.classList.add('icon-vip');
							nameli.classList.add('authicon-cu');
						} else {
							if($info.authStatus) {
								if($info.authentication == 1) {
									nameli.classList.add('icon-renzheng');
									nameli.classList.add('authicon-mana');
									nameli.innerHTML = "<span>科研</span>";
								} else if($info.authentication == 2) {
									nameli.classList.add('icon-renzheng');
									nameli.classList.add('authicon-staff');
									nameli.innerHTML = "<span>企业</span>";
								} else {
									nameli.classList.add('icon-renzheng');
									nameli.classList.add('authicon-stu');
									nameli.innerHTML = "<span>学生</span>";
								}
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

	});

});