//资源信息页面 
var oresorcename = document.getElementById("resorcename"); //资源名称标题
var oproname = document.getElementById("proname"); //专家名称
var oprotitle = document.getElementById("protitle"); //专家职称
var oprooffice = document.getElementById("prooffice"); //专家职务
var oproorgName = document.getElementById("proorgName"); //专家所属机构
var oproadress = document.getElementById("proadress"); //专家所在地
var opromodify = document.getElementById("promodify"); //专家认证
var oproimg = document.getElementById("proimg"); //专家头像

var oresourceName = document.getElementById("resourceName"); //资源名称
var oyongtu = document.getElementById("yongtu"); //应用用途
var oziyuanimg = document.getElementById("ziyuanimg"); //资源图片
var ofield = document.getElementById("field"); //学术领域
var oapply = document.getElementById("apply"); //应用行业
var odetail = document.getElementById("detail"); //详细描述
var ohezuo = document.getElementById("hezuo"); //合作备注
var oEnter = document.getElementById("fess");
var ofielddiv = document.getElementById("fielddiv"); //学术领域容器
var oapplydiv = document.getElementById("applydiv"); //应用行业容器
var odetaildiv = document.getElementById("detaildiv"); //详细描述容器
var ohezuodiv = document.getElementById("hezuodiv"); //合作备注容器

var oconsult = document.getElementById("consult"); //咨询
var oconsultBtn = document.getElementById("consultBtn"); //咨询按钮
var professorId;
var proId;
var resourceName;
var supportedServices;

function ziyuaninfo(resourceId) {
	mui.plusReady(function() {

		mui.ajax(baseUrl + '/ajax/resource/resourceInfo', {
			data: {
				'resourceId': resourceId,
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'get', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if(data.success) {
					console.log(JSON.stringify(data));

					var mydata = data.data;
					//资源名称
					professorId = mydata['editProfessor']['id'];
					var userid = plus.storage.getItem('userid');
					if(professorId == userid) {
						document.getElementsByClassName("footbox")[0].style.display = "none";
					}
					resourceName = mydata['resourceName'];
					(mydata['resourceName']) ? oresorcename.innerHTML = mydata['resourceName']: oresorcename.innerHTML = '';
					(mydata['resourceName']) ? oresourceName.innerHTML = mydata['resourceName']: oresourceName.innerHTML = '';

					//专家信息
					proId = mydata['editProfessor']['id']; //专家id 
					//专家名字
					(mydata['editProfessor']["name"]) ? oproname.innerText = mydata['editProfessor']["name"]: oproname.innerText = '';
					//职称
					(mydata['editProfessor']["title"]) ? oprotitle.innerHTML = mydata['editProfessor']["title"]: oprotitle.innerHTML = '';
					//职位
					if(mydata['editProfessor']["office"] == null || mydata['editProfessor']["office"] == undefined) {
						oprooffice.innerHTML = '';
					} else {						
						if(mydata['editProfessor']["title"]) {								
							oprooffice.innerHTML = '，' + mydata['editProfessor']["office"]; //职位
						}						
					};
					//所在机构
					(mydata['editProfessor']["orgName"]) ? oproorgName.innerHTML = mydata['editProfessor']["orgName"]: oproorgName.innerHTML = '';
					//所在地
					(mydata['editProfessor']["address"]) ? oproadress.innerHTML = mydata['editProfessor']["address"]: oproadress.innerHTML = '';
					/*是否认证*/
					//(mydata['editProfessor']["authentication"] == true) ? opromodify.classList.add('authicon'): opromodify.classList.add('unauthicon');
					if(mydata['editProfessor']["authType"]) {
						opromodify.classList.add('icon-vip');
						opromodify.classList.add('authicon-cu');
						opromodify.style.float = "left";
					} else {
						if(mydata['editProfessor']["authStatus"]==3) {
							if(mydata['editProfessor']["authentication"] == 1) {
								opromodify.classList.add('icon-renzheng');
								opromodify.classList.add('authicon-mana');
								opromodify.style.position = "static";
								opromodify.style.margin = "3px 0 0 0";
							} else if(mydata['editProfessor']["authentication"] == 2) {
								opromodify.classList.add('icon-renzheng');
								opromodify.classList.add('authicon-staff');
								opromodify.style.position = "static";
								opromodify.style.margin = "3px 0 0 0";
							} else {
								opromodify.classList.add('icon-renzheng');
								opromodify.classList.add('authicon-stu');
								opromodify.style.position = "static";
								opromodify.style.margin = "3px 0 0 0";
							}
						}
					}

					/*专家头像*/
					
					(mydata['editProfessor']["hasHeadImage"] == 0) ? oproimg.setAttribute('src', '../images/default-photo.jpg'): oproimg.setAttribute('src', baseUrl + '/images/head/' + mydata['editProfessor']['id'] + '_m.jpg');
					console.log(mydata['editProfessor']["hasHeadImage"])
					//资源基本信息
					//(mydata['images']['imageSrc']) ? oziyuanimg.setAttribute('src', mydata['images']['imageSrc']): oziyuanimg.setAttribute('src', '../images/default-resource.jpg'); //资源图片

					var imgRes = baseUrl + "/images/resource/" + mydata.resourceId + ".jpg";
					if(mydata['images'].length) {
						oziyuanimg.setAttribute('src', imgRes)
					} else {
						oziyuanimg.setAttribute('src', '../images/default-resource.jpg')
					}
					supportedServices = mydata['supportedServices'];
					(mydata['supportedServices']) ? oyongtu.innerHTML = mydata['supportedServices']: oyongtu.innerHTML = ''; //应用用途

					//学术领域
					if(mydata['subject']) {
						if(mydata['subject'].indexOf(',') != -1) { //字符串是否包含,
							var fieldlist = mydata['subject'].split(",");
							console.log(fieldlist.length);
							for(var i = 0; i < fieldlist.length; i++) {
								var oli = document.createElement('li');
								oli.innerText = fieldlist[i];
								ofield.appendChild(oli);
							}
						} else {
							var oli = document.createElement('li');
							oli.innerText = mydata['subject'];
							ofield.appendChild(oli);
						}

					} else {
						ofielddiv.style.display = 'none';
					}

					//应用行业
					if(mydata['industry']) {
						if(mydata['industry'].indexOf(',') != -1) { //字符串是否包含,
							var applylist = mydata['industry'].split(",");
							console.log(applylist.length);
							for(var i = 0; i < applylist.length; i++) {
								var oli = document.createElement('li');
								oli.innerText = applylist[i];
								oapply.appendChild(oli);
							}
						} else {
							var oli = document.createElement('li');
							oli.innerText = mydata['industry'];
							oapply.appendChild(oli);
						}
					} else {
						oapplydiv.style.display = 'none';
					}

					//详细描述
					if(mydata['descp']) {
						odetail.innerHTML = mydata['descp'];
						var oImg = document.getElementById("detail").getElementsByTagName("img");
						for(var i = 0; i < oImg.length; i++) {
							(function(n) {
								var att = oImg[n].src.substr(7);
								oImg[n].setAttribute("src", baseUrl + att);
							})(i);
						}
					} else {
						odetaildiv.style.display = 'none';
					}

					//合作备注
					if(mydata['cooperationNotes']) {
						ohezuo.innerHTML = mydata['cooperationNotes'];
					} else {
						ohezuodiv.style.display = 'none';
					}

					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("slide-in-right", 150);
				}
			},
			error: function(xhr, type, errorThrown) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	})

}

mui.plusReady(function() {
	var yesExpert = document.getElementById("yesExpert");
	var noExpert = document.getElementById("noExpert");
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var resourceId = self.resourceId;
	oEnter.addEventListener("tap", function() {
		judge()
	})
	var judge = function() {
			mui.ajax(baseUrl + "/ajax/professor/editBaseInfo/" + professorId, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				async: false,
				success: function(data) {

					var $info = data.data || {}

					if(data.success && data.data) {
						if($info.authType||$info.authentication == 1) {
							mui.openWindow({
								url: '../html/proinforbrow.html',
								id: 'html/proinforbrow.html',
								show: {
									autoShow: false,
									aniShow: "slide-in-left"
								},
								extras: {
									proid: professorId
								},
							});
						} else if(!$info.authType&&$info.authentication == 2) {
							mui.openWindow({
								url: '../html/companybrowse.html',
								id: 'html/companybrowse.html',
								show: {
									autoShow: false,
									aniShow: "slide-in-left"
								},
								extras: {
									proid: professorId
								},
							});
						} else if(!$info.authType&&$info.authentication == 3) {
							mui.openWindow({
								url: '../html/studentbrowse.html',
								id: 'html/studentbrowse.html',
								show: {
									autoShow: false,
									aniShow: "slide-in-left"
								},
								extras: {
									proid: professorId
								},
							});
						}

					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		//console.log("资源id==" + resourceId);
		//资源信息
	ziyuaninfo(resourceId);
	/*点击咨询*/
	//判断是否登录，登录才可咨询，否则登录
	function isLogin() {
		var userid = plus.storage.getItem('userid');

		if(userid && userid != null && userid != 'null' && userid != undefined && userid != 'undefined') {

			var flag = 'ziyuan';
			var consulttitle = oresorcename.innerHTML;
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框
			webviewShow = plus.webview.create("../html/consultapply.html", 'consultapply.html', {}, {
				'proId': proId,
				'flag': flag,
				'consulttitle': consulttitle
			});

			webviewShow.addEventListener("loaded", function() {

			}, false);

		} else {
			mui.openWindow({
				url: '../html/login.html',
				id: 'login.html'
			})

		}
	};
	oconsult.addEventListener('tap', function() {
		isLogin();
	});

	/*咨询成功,返回资源信息*/
	window.addEventListener('backziyuaninfo', function(event) {

	});

	ifCollection();

	yesExpert.addEventListener('tap', function() {
		var $this = this;
		if(userid && userid != null && userid != "null") {
			collectionExpert($this);
		} else {
			//			plus.nativeUI.toast("请先登录");
			isLogin();
		}
	});

	noExpert.addEventListener('tap', function() {
		var $this = this;
		cancelCollectionExpert($this);
	});

	/*判断是否收藏资源*/
	function ifCollection() {
		mui.ajax(baseUrl + '/ajax/watch/hasWatch', {
			data: {
				"professorId": userid,
				"watchObject": resourceId
			},
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				if(data.success && data.data != null) {
					yesExpert.style.display = "none";
					noExpert.style.display = "block";
				} else {
					yesExpert.style.display = "block";
					noExpert.style.display = "none";
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	/*收藏资源*/
	function collectionExpert($this) {
		mui.ajax(baseUrl + '/ajax/watch', {
			data: {
				"professorId": userid,
				"watchObject": resourceId,
				"watchType": 2
			},
			dataType: 'json', //数据格式类型
			type: 'POST', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				console.log(data.success)
				if(data.success) {
					$this.style.display = "none";
					noExpert.style.display = "block";
					//resourceId = data.data;
					//console.log(resourceId)
					plus.nativeUI.toast("资源关注成功", toastStyle);
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	/*取消收藏资源*/
	function cancelCollectionExpert($this) {
		//console.log(returnId)
		// console.log(userid)
		mui.ajax({
			url: baseUrl + '/ajax/watch/delete',
			data: {
				professorId: userid,
				watchObject: resourceId
			},
			dataType: 'json', //数据格式类型
			type: 'post', //http请求类型
			timeout: 10000,
			async: true,
			success: function(data) {
				console.log(data.success)
				if(data.success) {
					$this.style.display = "none";
					yesExpert.style.display = "block";
					plus.nativeUI.toast("取消关注资源", toastStyle);
				}
			},
			error: function(data) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});

	}

	/*微信及微信朋友圈分享专家*/
	var auths, shares;
	document.getElementById("shareBtn").addEventListener("tap", function() {
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

		//// 弹出分享列表
		shareBts.length > 0 ? plus.nativeUI.actionSheet({
			title: '分享',
			cancel: '取消',
			buttons: shareBts
		}, function(e) {
			var str;
			if(supportedServices) {
				str = "应用用途：" + supportedServices
			}
			if(e.index == 1) {
				var share = buildShareService();
				
				if(share) {
					shareMessage(share, "WXSceneSession", {
						content: str,
						title: "【科袖资源】" + resourceName + "",
						href: baseUrl + "/ekexiu/shareResinfor.html?resourceId=" + resourceId,
						thumbs: [baseUrl + "/images/logo180.png"]
					});
				}
			} else if(e.index == 2) {
				var share = buildShareService();
				if(share) {
					shareMessage(share, "WXSceneTimeline", {
						content: str,
						title: "【科袖资源】" + resourceName + " ",
						href: baseUrl + "/ekexiu/shareResinfor.html?resourceId=" + resourceId,
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
			/*var strtmp = "分享到\"" + share.description + "\"成功！ ";
			console.log(strtmp);
			plus.nativeUI.toast(strtmp, {
				verticalAlign: 'center'
			});*/
			shareAddIntegral(2);
		}, function(e) {
			plus.nativeUI.closeWaiting();
			if(e.code == -2) {
				plus.nativeUI.toast('已取消分享', {
					verticalAlign: 'center'
				});
			}
		});
	}

	/*图像预览*/
	mui.previewImage();
});