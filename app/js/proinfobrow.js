var ozixun = document.getElementById("zixun");
var yesExpert = document.getElementById("yesExpert");
var noExpert = document.getElementById("noExpert");
var personalMaterial = document.getElementsByClassName('personalMaterial');
var personSummary = document.getElementsByClassName("breifinfo")[0];

mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var proId = self.proid;
    console.log(proId);
	/*点击咨询*/
	ozixun.addEventListener('tap', function() {
		mui.openWindow({
			url: 'consultapply.html',
			id: 'consultapply.html',
			extras: {
				'proId': proId
			}
		});
	});
	//查询学术领域
	var subjectShow = function(data) {
			if(data != undefined && data.length != 0) {
				var subs = new Array();
				if(data.indexOf(',')) {
					subs = data.split(',');
				} else {
					subs[0] = data;
				}
				if(subs.length > 0) {
					var html = [];
					for(var i = 0; i < subs.length; i++) {
						html.push("<li>" + subs[i] + "</li>");
					};
					document.getElementsByClassName("infosubject")[0].innerHTML = html.join('');
				}
			}
		}
		//查询研究方向	
	var getRecords = function($researchAreaLogs, caption) {
		var ret = [];
		for(var i = 0; i < $researchAreaLogs.length; i++) {
			if(caption == $researchAreaLogs[i].caption) {
				ret.push($researchAreaLogs[i].opreteProfessorId);
			}
		}
		return ret;
	}
	var researchAreaShow = function($datas, $datarecords) {
			if($datas != undefined && $datas.length != 0) {
				var html = [];
				for(var i = 0; i < $datas.length; ++i) {
					var $data = $datas[i];
					var $photos = [];
					//获取头像
					//console.log($data.count)
					if($datarecords.length > 0) {
						$photos = getRecords($datarecords, $data.caption);
					}
					var isAgree = -1;
					for(var j = 0; j < $photos.length; j++) {
						if(userid == $photos[j])
							isAgree++;
					}
					var showDiv = "<div class='listbox'><div class='listbrowse mui-ellipsis'><span class='like'>" + $data.count + "</span>" + $data.caption + "</div><span class=' mui-icon iconfont plusbtn icon-appreciate' data-pid='" + $data.professorId + "' data-caption='" + $data.caption + "' data-isagree='" + isAgree + "' ></span><div class='likenum'>";
					if($photos.length > 3) {
						showDiv += "<span class='mui-icon iconfont icon-more likepeople likemore'></span>'></div>";
					}

					if($photos.length > 0) {
						for(var j = 0; j < $photos.length; ++j) {

							showDiv += "<span class='likepeople'><img class='like-h' src='../images/head/" + $photos[j] + "_s.jpg'></span>";

						}
					}

					showDiv += "</div></div>";

					html.push(showDiv);
				}
				document.getElementsByClassName("reserachMess")[0].innerHTML = html.join('')
			}
		}
		//查询应用行业		
	var industryShow = function(data) {
		if(data != undefined && data.length != 0) {
			var subs = new Array();
			if(data.indexOf(',')) {
				subs = data.split(',');
			} else {
				subs[0] = data;
			}
			if(subs.length > 0) {
				var html = [];
				for(var i = 0; i < subs.length; i++) {
					html.push("<li>" + subs[i] + "</li>");
				};
				document.getElementsByClassName("infoapply")[0].innerHTML = html.join('');
			}
		}
	}
	var professorResource = function(odata) {
			var $data = odata;
			var html = [];
			for(var i = 0; i < odata.length; i++) {
				var string = '<li class="mui-table-view-cell mui-media">'
				string += '<a class="proinfor" href="resinforupdate.html">'
				if($data[i].images.length) {
					string += '<img class="mui-media-object mui-pull-left resimg" src="../images/resource/' + $data[i].resourceId + '.jpg">'

				} else {

					string += '<img class="mui-media-object mui-pull-left resimg" src="../images/default-resource.jpg">'
				}
				string += '<div class="mui-media-body">'
				string += '<span class="listtit">' + $data[i].resourceName + '</span>'
				string += '<p class="listtit2">' + $data[i].supportedServices + '</p>'
				string += '<p class="listtit3 resbrief">'
				if($data[i].descp) {
					string += $data[i].descp;
				}
				string += '</p></div></a></li>'
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
				plus.webview.currentWebview().show("slide-in-right",150);
				var $data = data.data;
				personalMaterial[0].innerText = $data.name;
				//基本信息
				document.getElementsByClassName("consultCount")[0].innerText = $data.consultCount;
				var startLeval = parseInt($data.starLevel);
				var start = document.getElementsByClassName("start");
				for(var i = 0; i < startLeval; i++) {
					start[i].classList.add("icon-favorfill");
				}
				if($data.hasHeadImage) {
					document.getElementsByClassName("headimg")[0].src = "/images/head/" + $data.id + "_l.jpg";
				} else {
					document.getElementsByClassName("headimg")[0].src = "../images/default-photo.jpg";
				}
				if(!$data.authentication) {

					document.getElementsByClassName('icon-vip')[0].classList.remove("authicon");
					document.getElementsByClassName('icon-vip')[0].classList.add("unauthicon");
				}
				if($data.office) {
					personalMaterial[1].innerText = $data.office;
				}
				if($data.title) {
					personalMaterial[2].innerText = $data.title;
				}
				if($data.orgName) {
					personalMaterial[3].innerText = $data.orgName;
				}
				if($data.department) {
					personalMaterial[4].innerText = $data.department;
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
				//学术领域
				if($data.subject) {
					subjectShow($data.subject);
				} else {
					document.getElementById("professorInfosubject").style.display = "none";
				}
				//研究方向
				if($data.researchAreas.length) {

					researchAreaShow($data.researchAreas, $data.researchAreaLogs);
				} else {
					document.getElementById("professorReserachMess").style.display = "none";
				}
				//应用行业
				if($data.industry) {
					industryShow($data.industry);
				} else {
					document.getElementById("professorinfoapply").style.display = "none";
				}
				//专家资源
				if($data.resources.length) {
					professorResource($data.resources);
				} else {
					document.getElementById("professorresourceList").style.display = "none";
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
	}
	//修改详细页面
	document.getElementsByClassName("gotonext")[0].addEventListener("tap", function() {
		var nwaiting = plus.nativeUI.showWaiting();
		var web = plus.webview.create("../html/proinforbrow-more.html", "proinforbrow-more.html", {}, {
			pro: proId
		}); //后台创建webview并打开show.html   	    	
		web.addEventListener("loaded", function() {}, false);
	});
	//点赞
	mui(".reserachMess").on("click", ".plusbtn", function() {
		if(userid && userid != null && userid != "null") {
			mui.ajax(this.getAttribute("data-isagree") > -1 ? baseUrl + "/ajax/researchArea/unAgree" : baseUrl + "/ajax/researchArea/agree", {
				"type": "POST",
				"data": {
					"targetId": this.getAttribute("data-pid"),
					"targetCaption": this.getAttribute("data-caption"),
					"opId": userid
				},
				"contentType": "application/x-www-form-urlencoded",
				"success": function($data) {

					if($data.success) {
						mui.ajax(baseUrl + "/ajax/professor/info/" + proId, {
							dataType: 'json', //数据格式类型
							type: 'GET', //http请求类型
							timeout: 10000, //超时设置
							success: function(data) {

								var $data = data.data;
								//研究方向
								document.getElementsByClassName("reserachMess")[0].innerHTML = "";
								if($data.researchAreas.length) {

									researchAreaShow($data.researchAreas, $data.researchAreaLogs);
								}

							},
							error: function() {
								plus.nativeUI.toast("服务器链接超时", toastStyle);
								return;
							}
						});
					}

				}
			})
		}

	})

	personalMessage();

	/*咨询成功,返回专家信息*/
	window.addEventListener('backproinfo', function(event) {
		var proid = event.detail.proId;
		console.log(proid);
		ozixun.classList.add('displayNone');
	});

	ifCollection();

	yesExpert.addEventListener('tap', function() {
		var $this = this;
		collectionExpert($this);
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
					plus.nativeUI.toast("专家收藏成功", toastStyle);
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
					plus.nativeUI.toast("取消收藏成功", toastStyle);
				}
			},
			error: function(data) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});

	}

});