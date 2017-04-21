//我的账号
mui.ready(function() {
	/*定义全局变量*/
	var loginYes = document.getElementById("loginYes");
	var loginNo = document.getElementById("loginNo");
	var goLogin = document.getElementById("gologin");
	var goReg = document.getElementById("goreg");
	var goSetup = document.getElementById("goSetup");
	var gonXuqiu=document.getElementById("demand");
	var goZixun = document.getElementById("goZixun")
	var goFollow = document.getElementById("goFollow");
	var userImg = document.getElementById("userImg");
	var userImg2 = document.getElementById("userImg2");
	var nameli = document.getElementById("nameli");
	var goBecomeExpert = document.getElementById("goBecomeExpert");
	var infobasic = document.getElementById("exitSpan");
	var myIntegral = document.getElementById("myIntegral");
	var nosign = document.getElementById("nosign");
	var yessign =document.getElementById("yessign");
	var oFlag;
	var oFlag1;
	var professorName,scorePercent;
	mui.plusReady(function() {

		var userId = plus.storage.getItem('userid');
		console.log(userId);
		
		/*判断登录是否成功*/
		loginStatus();

		/*用户信息初始化*/
		userInformation();
		
		/*专家认证*/
		isexpert();
		
		/*初始化签到状态*/
		signFun();
		
		/*登录按钮*/
		loginNo.addEventListener('tap', function() {
			goLoginFun();
		})

		/*专家认证刷新页面*/
		window.addEventListener('mPage', function(event) {
			isexpert();
		})

		/*退出登录刷新页面*/
		window.addEventListener('rewards', function(event) {
			plus.navigator.setStatusBarBackground( "#FF9900" );
		});
		
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
		
		//点击签到
		var signed=document.getElementById("nosign");
		signed.addEventListener("tap", function() {
			signyesFun();
		})
		
		//点击我的名片
		var myCard=document.getElementById("myCard");
		myCard.addEventListener("tap", function() {
			mui.openWindow({
				url: '../html/mycard.html',
				id: 'mycard.html',
				show: {
					autoShow: false,
				},
				extras: {
					num: 2
				}
			});
		})

		/*专家认证*/
		function isexpert() {
			var userId = plus.storage.getItem('userid');
			var expertAuth = document.getElementById("expertAuth");
			mui.ajax(baseUrl + "/ajax/professor/auth", {
				data: {
					"id": userId
				},
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				async: false,
				success: function(data) {
					console.log(JSON.stringify(data));
					var $info = data.data || {};
					if(data.success && data.data) {
						authStatusExpert = $info.authStatusExpert;
						authStatus = $info.authStatus;
						console.log(authStatusExpert)
						if(authStatusExpert == -1) {
							expertAuth.innerHTML = "认证失败";
						} else if(authStatusExpert == 0) {
							expertAuth.innerHTML = "未认证";
						} else if(authStatusExpert == 1) {
							expertAuth.innerHTML = "待认证";
						} else if(authStatusExpert == 2) {
							expertAuth.innerHTML = "认证中";
						} else if(authStatusExpert == 3) {
							expertAuth.innerHTML = "已认证";
						}
						goBecomeExpert.addEventListener('tap', function() {
							if(authStatus == 3){
								if(authStatusExpert == -1 || authStatusExpert == 0) {
									mui.openWindow({
										url: '../html/expert-authentication.html',
										id: 'expert-authentication.html',
										show: {
											autoShow: false,
											aniShow: "slide-in-right"
										}
									});
								}
							}else if(authStatus == -1 || authStatus == 0){
								if(authStatusExpert == -1 || authStatusExpert == 0) {
									mui.openWindow({
										url: '../html/realname-authentication2.html',
										id: 'realname-authentication2.html',
										show: {
											autoShow: false,
											aniShow: "slide-in-right"
										}
									});
								}
							}else if(authStatus == 1 || authStatus == 2){
								plus.nativeUI.toast("正在进行实名认证，请稍等片刻。", toastStyle);
							}
						})
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}

		function loginStatus() {
			//alert(userId);
			if(userId && userId != "null" && userId != null) {
				loginYes.classList.remove("displayNone");
				loginNo.classList.add("displayNone");
				/*设置*/
				goSetup.addEventListener('tap', function() {
					mui.openWindow({
						url: '../html/setup.html',
						id: '../html/setup.html',
						show: {
							//autoShow: false,
							aniShow: "slide-in-right"
						}
					});
				})
				/*我的需求*/
				gonXuqiu.addEventListener('tap', function() {
					mui.openWindow({
						url: '../html/needList.html',
						id: '../html/needList.html',
						show: {
							autoShow: false,
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
						if(oFlag1) {
							mui.openWindow({
								url: '../html/proinforupdate.html',
								id: 'html/proinforupdate.html',
								show: {
									autoShow: false,
									aniShow: "slide-in-left"
								},

							});
						} else if(!oFlag1 && oFlag == 1) {
							/*我的修改企业工作者*/
							mui.openWindow({
								url: '../html/researcher.html',
								id: 'html/researcher.html',
								show: {
									autoShow: false,
									aniShow: "slide-in-left"
								},

							});
						} else if(!oFlag1 && oFlag == 2) {
							/*我的修改企业工作者*/
							mui.openWindow({
								url: '../html/companyUpdata.html',
								id: 'html/companyUpdata.html',
								show: {
									autoShow: false,
									aniShow: "slide-in-left"
								},

							});
						} else if(!oFlag1 && oFlag == 3) {
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
					
					/*邀请好友*/
					document.getElementById("goNewuser").addEventListener("tap", function() {
						mui.openWindow({
							url: '../html/invite_new.html',
							id: 'invite_new.html',
							show: {
								autoShow: false,
								aniShow: "slide-in-left"
							},
							extras: {
								proName: professorName
							}
						});
					})
					
					/*我的积分*/
					myIntegral.addEventListener('tap', function() {
						mui.openWindow({
							url: '../html/rewards-list.html',
							id: 'html/rewards-list.html',
							show: {
								autoShow: false,
								aniShow: "slide-in-left"
							},
							extras: {
								score: scorePercent
							}
						});
					})

			} else {
				loginNo.classList.remove("displayNone");
				loginYes.classList.add("displayNone");
				mui("#loginNo").on("tap", "li", function() {
					goLoginFun();
				})
			}
		}

		function userInformation() {
			mui.ajax(baseUrl + "/ajax/professor/baseInfo/" + userId, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				//async: false,
				success: function(data) {
					if(data.success && data.data) {
						var $info = data.data || {};
						oFlag = $info.authentication;
						oFlag1 = $info.authType
						professorName = $info.name;
						scorePercent = $info.scorePercent;
						document.getElementById("userName").innerText = $info.name;
						document.getElementById("orgName").innerText = $info.orgName;
						if($info.hasHeadImage == 1) {
							var mun = Math.round(Math.random() * 99 + 1);
							userImg.setAttribute("src", baseUrl + "/images/head/" + $info.id + "_l.jpg?" + mun);
						} else {
							userImg.setAttribute("src", baseUrl + "/images/default-photo.jpg");
						}
						var userType = autho($info.authType, $info.orgAuth, $info.authStatus);
						document.getElementById("authicon").classList.add(userType.sty);
                        if($info.authType==1){
                        	goZixun.classList.remove("displayNone");
                        	document.getElementById("setItem").classList.add("itemThree");
                        }
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}

		function signFun(){
			mui.ajax(baseUrl + "/ajax/growth/isSignIn", {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				data:{"professorId":userId},
				//async: false,
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						if(data.data){
							nosign.classList.remove("displayNone");
						}else{
							yessign.classList.remove("displayNone");
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		
		function signyesFun(){
			mui.ajax(baseUrl + "/ajax/growth/signIn", {
				dataType: 'json', //数据格式类型
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				data:{"professorId":userId},
				//async: false,
				success: function(data) {
					console.log(JSON.stringify(data))
					if(data.success && data.data) {
						nosign.classList.add("displayNone");
						yessign.classList.remove("displayNone");
						mui.openWindow({
							url: '../html/mycard.html',
							id: 'mycard.html',
							show: {
								autoShow: false,
							},
							extras: {
								num: 1,
								todayScore: data.data.todayScore,
								lastDayScore: data.data.lastDayScore
							}
						});
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
