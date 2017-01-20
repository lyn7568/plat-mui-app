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
	var infobasic = document.getElementsByClassName("amend")[0];
	var oFlag;
	var oFlag1;
	var clickFlag=true;
	var professorName;
	mui.plusReady(function() {

		var userId = plus.storage.getItem('userid');
		console.log(userId);
		/*判断登录是否成功*/
		loginStatus();

		/*用户信息初始化*/
		userInformation();

		/*登录按钮*/
		loginNo.addEventListener('tap', function() {
			goLoginFun();
		})

		/*注册按钮*/
		/*goReg.addEventListener('tap', function() {
			goRegFun();
		})*/

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
							//autoShow: false,
							aniShow: "slide-in-right"
						}
					});
				})

				/*我的修改专家*/
				infobasic.addEventListener('tap', function() {
						if(oFlag1||oFlag == 1) {
							mui.openWindow({
								url: '../html/proinforupdate.html',
								id: 'html/proinforupdate.html',
								show: {
									autoShow: false,
									aniShow: "slide-in-left"
								},

							});
						} else if(!oFlag1&&oFlag == 2) {
							/*我的修改企业工作者*/
							mui.openWindow({
								url: '../html/companyUpdata.html',
								id: 'html/companyUpdata.html',
								show: {
									autoShow: false,
									aniShow: "slide-in-left"
								},

							});
						} else if(!oFlag1&&oFlag == 3) {
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
					if(!clickFlag) return;
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
					oFlag1=$info.authType
					console.log(oFlag)
					if(data.success && data.data) {
						document.getElementById("userName").innerText = $info.name || '';
						professorName=$info.name;
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
						($info.office) ? userPosition.innerText = $info.office: userPosition.innerText = '';
						if($info.department) {
							if($info.orgName) {
								userDepartment.innerText = $info.department + "，"
							} else {
								if($info.address) {
									userDepartment.innerText = $info.department + " | "
								} else {
									userDepartment.innerText = $info.department;
								}
							}
						}
						if($info.orgName) {
							if($info.address) {
								userMechanism.innerText = $info.orgName + " | "
							} else {
								userMechanism.innerText = $info.orgName;
							}
						}
						($info.address) ? userCity.innerText = $info.address: userCity.innerText = '';
						($info.consultCount != '') ? zixunOk.innerText = $info.consultCount: zixunOk.innerText = '0';
						var startLeval = parseInt($info.starLevel);						
						if($info.consultCount) {							
							zixunOk.innerText = $info.consultCount;
							if(!startLeval) {								
								clickFlag = false;
								document.getElementById("NoActive").classList.add("NoActive");
								document.getElementsByClassName("levelbox")[0].style.display = "none";
								document.getElementById("goZixun").classList.remove("mui-navigate-right");
							}
						} else {
							goZixun.style.display = "none";
						}
						if(!$info.authType&&($info.authentication == 2||$info.authentication == 3)){
							goZixun.style.display="none"; 
							}	 					
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
							nameli.style.margin = "-4px 0 0 -2px";
						} else {
							if($info.authStatus) {
								if($info.authentication == 1) {
									nameli.classList.add('icon-renzheng');
									nameli.classList.add('authicon-mana');
								} else if($info.authentication == 2) {
									nameli.classList.add('icon-renzheng');
									nameli.classList.add('authicon-staff');
								} else {
									nameli.classList.add('icon-renzheng');
									nameli.classList.add('authicon-stu');
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
/*微信及微信朋友圈分享专家*/
	var auths, shares;
	document.getElementById("goNewuser").addEventListener("tap", function() {
		shareShow()
	})
	plus.oauth.getServices(function(services) {
		auths = {};
		for(var i in services) {
			var t = services[i];
			auths[t.id] = t;

		}
	}, function(e) {
		alert("获取登录服务列表失败：" + e.message + " - " + e.code);
	});
	plus.share.getServices(function(services) {

		shares = {};
		for(var i in services) {

			var t = services[i];

			shares[t.id] = t;

		}
	}, function(e) {
		alert("获取分享服务列表失败：" + e.message + " - " + e.code);
	})

	function shareShow() {
		var shareBts = [];
		// 更新分享列表
		var ss = shares['weixin'];
		if(navigator.userAgent.indexOf('StreamApp') < 0 && navigator.userAgent.indexOf('qihoo') < 0) { //在360流应用中微信不支持分享图片
			ss && ss.nativeClient && (shareBts.push({
					title: '微信好友',
					s: ss,
					x: 'WXSceneSession'
				}),
				shareBts.push({
					title: '微信朋友圈',
					s: ss,
					x: 'WXSceneTimeline'
				}));
		}
		//				// 弹出分享列表
		shareBts.length > 0 ? plus.nativeUI.actionSheet({
			title: '分享',
			cancel: '取消',
			buttons: shareBts
		}, function(e) {
			var str = "研究方向"			
			if(e.index == 1) {				
				alert(userId);
				var share = buildShareService();
				if(share) {
					shareMessage(share, "WXSceneSession", {
						content: professorName,
						title: "【科袖名片】",
						href: baseUrl+"/ekexiu/Invitation.html?professorId="+userId+"&professorName="+encodeURI(professorName),
						thumbs: [baseUrl + "/images/logo180.png"]
					});
				}
			} else if(e.index == 2) {				
				var share = buildShareService();
				if(share) {
					shareMessage(share, "WXSceneTimeline", {
						content: professorName,
						title: "【科袖名片",
						href: baseUrl+"/ekexiu/Invitation.html?professorId="+userId+"&professorName="+encodeURI(professorName),
						thumbs: [baseUrl + "/images/logo180.png"]
					});
				}
			}

		}) : plus.nativeUI.alert('当前环境无法支持分享操作!');

	}

	function buildShareService() {
		var share = shares["weixin"];
		if(share) {
			if(share.authenticated) {
				console.log("---已授权---");
			} else {
				console.log("---未授权---");
				share.authorize(function() {
					console.log('授权成功...')
				}, function(e) {
					alert("认证授权失败：" + e.code + " - " + e.message);
					return null;
				});
			}
			return share;
		} else {
			alert("没有获取微信分享服务");
			return null;
		}

	}
	
	function shareMessage(share, ex, msg) {
		msg.extra = {
			scene: ex
		};
		share.send(msg, function() {
			plus.nativeUI.closeWaiting();
			var strtmp = "分享到\"" + share.description + "\"成功！ ";
			console.log(strtmp);
			plus.nativeUI.toast(strtmp, {
				verticalAlign: 'center'
			});
		}, function(e) {
			plus.nativeUI.closeWaiting();
			if(e.code == -2) {
				plus.nativeUI.toast('已取消分享', {
					verticalAlign: 'center'
				});
			}
		});
	}
	});

});