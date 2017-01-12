var ozixun = document.getElementById("zixun");
var yesExpert = document.getElementById("yesExpert");
var noExpert = document.getElementById("noExpert");
var personalMaterial = document.getElementsByClassName('personalMaterial');
var personSummary = document.getElementsByClassName("breifinfo")[0];

mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var proId = self.proid;
	console.log(userid);
	/*点击咨询*/
	if(userid) {
		ozixun.addEventListener('tap', function() {
			var flag = 'professor';
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框
			webviewShow = plus.webview.create("../html/consultapply.html", 'consultapply.html', {}, {
				'proId': proId,
				'flag': flag
			});

			webviewShow.addEventListener("loaded", function() {

			}, false);
		});
	} else if(userid == '' || userid == undefined) {
		ozixun.addEventListener('tap', function() {
			/*mui.alert('请登录', '' ,function(){
				mui.openWindow({
					url: '../html/login.html',
					id: 'html/login.html',
					show: {
						aniShow: "slide-in-left"
					}
				});
			});*/
			plus.nativeUI.toast("请先登录");
		});
	}

	var professorResource = function(odata) {
			var $data = odata;
			var html = [];
			for(var i = 0; i < odata.length; i++) {
				var string = '<li class="mui-table-view-cell mui-media" resouseId=' + $data[i].resourceId + '>'
				string += '<a class="proinfor"><div class="mui-media-object mui-pull-left ResImgBox ResImgBox2">'
				if($data[i].images.length) {
					string += '<img class="resImg headRadius" src="' + baseUrl + '/images/resource/' + $data[i].resourceId + '.jpg">'

				} else {

					string += '<img class="resImg headRadius" src="../images/default-resource.jpg">'
				}
				string += '</div><div class="mui-media-body">'
				string += '<span class="listtit">' + $data[i].resourceName + '</span>'
				string += '<p class="listtit2">' + $data[i].supportedServices + '</p>'
//				string += '<p class="listtit3 resbrief">'
//				if($data[i].descp) {
//					string += $data[i].descp;
//				}
//				string += '</p>'
				string += '</div></a></li>'
				html.push(string);
			}
			document.getElementById("resourceList").innerHTML = html.join('');

		}
		/*获取个人信息*/
	function personalMessage() {
		mui.ajax(baseUrl + "/ajax/professor/info/" + proId, {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			success: function(data) {
				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("slide-in-right", 150);
				var $data = data.data;
				personalMaterial[0].innerText = $data.name;
				document.getElementById("professorName").innerText=$data.name;
				//基本信息
				if($data.consultCount) {
					document.getElementsByClassName("consultCount")[0].innerText = $data.consultCount;
				} else {
					document.getElementById("accessHistory").style.display = "none";
				}
				var startLeval = parseInt($data.starLevel);
				var start = document.getElementsByClassName("start");
				for(var i = 0; i < startLeval; i++) {
					start[i].classList.add("icon-favorfill");
					start[i].classList.remove("icon-favor");
				}
				if($data.hasHeadImage) {
					document.getElementsByClassName("headimg")[0].src = baseUrl + "/images/head/" + $data.id + "_l.jpg";
				} else {
					document.getElementsByClassName("headimg")[0].src = "../images/default-photo.jpg";
				}
				if($data.authType) {
					nameli.classList.add('icon-vip');
					nameli.classList.add('authicon-cu');
				} else {
					if($data.authStatus) {
						if($data.authentication == 1) {
							nameli.classList.add('icon-renzheng');
							nameli.classList.add('authicon-mana');
							//nameli.innerHTML="<span>科研</span>";
						} else if($data.authentication == 2) {
							nameli.classList.add('icon-renzheng');
							nameli.classList.add('authicon-staff');
							//nameli.innerHTML="<span>企业</span>";
						} else {
							nameli.classList.add('icon-renzheng');
							nameli.classList.add('authicon-stu');
							//nameli.innerHTML="<span>学生</span>";
						}
					}
				}
				console.log($data.title);
				console.log($data.office);
				console.log($data.department);
				console.log($data.orgName);
				if($data.office) {
					if($data.title) {
						personalMaterial[1].innerText = $data.office + "，";
					} else {
						personalMaterial[1].innerText = $data.office;
					}
				}
				if($data.title) {
					personalMaterial[2].innerText = $data.title;
				}
				if($data.orgName) {
					if($data.department) {
						personalMaterial[3].innerText = $data.orgName + "，";
					} else {
						if($data.address) {
							personalMaterial[3].innerText = $data.orgName+ " | ";
						} else {
							personalMaterial[3].innerText = $data.orgName
						}
						
					}

				}
				if($data.department) {

					if($data.address) {
						personalMaterial[4].innerText = $data.department + " | ";
					} else {
						personalMaterial[4].innerText = $data.department;
					}

				}
				if($data.address) {
					personalMaterial[5].innerText = $data.address;
				}
				//个人简介

				if($data.descp) {
					personSummary.innerHTML = $data.descp;
				} else {
					document.getElementById("professorBreifinfo").style.display = "none";
				}
				//专家资源
				if($data.resources.length) {
					professorResource($data.resources);
				} else {
					document.getElementById("professorresourceList").style.display = "none";
				}
				//如无详细内容数据，隐藏详细点击的按钮
				if(!$data.edus.length && !$data.jobs.length && !$data.projects.length && !$data.papers.length && !$data.patents.length && !$data.honors.length) {
					document.getElementById("detailProfessor").style.display = "none";
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
	}
	//修改详细页面
	document.getElementById("detailProfessor").addEventListener("tap", function() {
		var nwaiting = plus.nativeUI.showWaiting();
		var web = plus.webview.create("../html/proinforbrow-more.html", "proinforbrow-more.html", {}, {
			pro: proId
		}); //后台创建webview并打开show.html   	    	
		web.addEventListener("loaded", function() {}, false);
	});

	personalMessage();
	/*进入资源详细页面*/
	mui("#resourceList").on('tap', 'li', function() {
		var resouId = this.getAttribute("resouseId");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/resinforbrow.html", 'resinforbrow.html', {}, {
			resourceId: resouId
		});
	});
	/*咨询成功,返回专家信息*/
	window.addEventListener('backproinfo', function(event) {
		var proid = event.detail.proId;
		console.log(proid);
		/*ozixun.classList.add('displayNone');*/
	});

	ifCollection();

	yesExpert.addEventListener('tap', function() {
		var $this = this;
		if(userid && userid != null && userid != "null") {
			collectionExpert($this);
		} else {
			plus.nativeUI.toast("请先登录");
		}
	});

	noExpert.addEventListener('tap', function() {
		var $this = this;
		cancelCollectionExpert($this);
	});

	/*判断是非收藏专家*/
	function ifCollection() {
		mui.ajax(baseUrl + '/ajax/watch/hasWatch', {
			data: {
				"professorId": userid,
				"watchObject": proId
			},
			dataType: 'json', //数据格式类型
			type: 'get', //http请求类型
			timeout: 10000,
			async: false,
			success: function(data) {
				if(data.success && data.data != null) {
					yesExpert.style.display = "none";
					noExpert.style.display = "block";
					returnId = data.data.watchObject;
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

	/*收藏专家*/
	function collectionExpert($this) {
		mui.ajax(baseUrl + '/ajax/watch', {
			data: {
				"professorId": userid,
				"watchObject": proId,
				"watchType": 1
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
					returnId = data.data;
					//console.log(returnId)
					plus.nativeUI.toast("专家关注成功", toastStyle);
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}

	/*取消收藏专家*/
	function cancelCollectionExpert($this) {
		//console.log(returnId)
		// console.log(userid)
		mui.ajax({
			url: baseUrl + '/ajax/watch/delete',
			data: {
				professorId: userid,
				watchObject: returnId
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
					plus.nativeUI.toast("取消关注成功", toastStyle);
				}
			},
			error: function(data) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});

	}
	/*专家的历史和评价*/
	document.getElementById("accessHistory").addEventListener('tap', function() {
		mui.openWindow({
			url: '../html/coophistory-other.html',
			id: 'html/coophistory-other.html',
			show: {
				autoShow: false,
			},
			extras: {
				professorId: proId
			}
		});
	})
	/*图像预览*/
	mui.previewImage();
});