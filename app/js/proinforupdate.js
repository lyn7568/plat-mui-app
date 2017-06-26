mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var oImg = document.getElementsByTagName("img")[0];
		var personalMaterial = document.getElementsByClassName('personalMaterial');
		var personSummary = document.getElementsByClassName("breifinfo")[0];
		var fl;
		window.addEventListener("newId", function(event) {
			fl = event.detail.rd;
			personalMaterial[1].parentNode.style.display = "block";
			personalMaterial[2].parentNode.style.display = "block";
			personalMaterial[3].parentNode.style.display = "block";
			personalMaterial[4].parentNode.style.display = "block";
			personalMaterial[5].parentNode.style.display = "block";
			personalMaterial[6].parentNode.style.display = "block";
			personalMaterial[7].parentNode.style.display = "block";
			personalMessage();
		})

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
			//查询研究方向
		var getRecords = function($researchAreaLogs, caption) {
			var ret = [];
			var t = 0;
			for(var i = 0; i < $researchAreaLogs.length; i++) {
				if(caption == $researchAreaLogs[i].caption) {
					ret[t] = {
						id: $researchAreaLogs[i].opreteProfessorId,
						img: $researchAreaLogs[i].hasHeadImage
					}
					t++;
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
					if($datarecords.length > 0) {
						$photos = getRecords($datarecords, $data.caption);
					}
					var isAgree = -1;
					for(var j = 0; j < $photos.length; j++) {
						if(userid == $photos[j].id)
							isAgree++;
					}
					if(isAgree) {
						var showDiv = "<div class='listbox'><div class='listbrowse mui-ellipsis'><span class='like'>" + $data.count + "</span>" + $data.caption + "</div><div class='likenum'>";
					} else {
						var showDiv = "<div class='listbox'><div class='listbrowse mui-ellipsis'><span class='like'>" + $data.count + "</span>" + $data.caption + "</div><div class='likenum'>";
					}
					
					if($photos.length < 4) {
						for(var j = 0; j < $photos.length; ++j) {
							if($photos[j].img) {
								showDiv += "<span class='likepeople headRadius'><img class='like-h' src='" + baseUrl + "/images/head/" + $photos[j].id + "_m.jpg'></span>";
							} else {
								showDiv += "<span class='likepeople headRadius'><img class='like-h' src='../images/default-photo.jpg'></span>";
							}
						}
					} else {
						for(var j = $photos.length - 2; j < $photos.length; ++j) {
							if($photos[j].img) {
								showDiv += "<span class='likepeople headRadius'><img class='like-h' src='" + baseUrl + "/images/head/" + $photos[j].id + "_m.jpg'></span>";
							} else {
								showDiv += "<span class='likepeople headRadius'><img class='like-h' src='../images/default-photo.jpg'></span>";
							}
						}
						showDiv += "<span class='mui-icon iconfont icon-more likepeople likemore headRadius'></span>";
					}
					showDiv += "</div></div></div>";
					html.push(showDiv);
				}
				document.getElementsByClassName("reserachMess")[0].innerHTML = html.join('')
			}
		}

		//获取个人的信息
		function personalMessage() {
			mui.ajax(baseUrl + "/ajax/professor/info/" + userid, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						plus.nativeUI.closeWaiting();
						if(!fl) {
							plus.webview.currentWebview().show("slide-in-right", 150);
						}
						var $data = data.data;
						personalMaterial[0].innerText = $data.name;
						//头像					
						if($data.hasHeadImage) {
							var mun = Math.round(Math.random() * 99 + 1);
							oImg.src = baseUrl + "/images/head/" + $data.id + "_l.jpg?" + mun;
						}
						//基本信息
						//					if(!$data.authType) {						
						//						document.getElementsByClassName('authword')[0].innerText = "未认证";
						//						document.getElementsByClassName('authword')[0].style.backgroundColor = "#cccccc";
						//					}
						if($data.title) {
							personalMaterial[1].innerText = $data.title;
						} else {
							personalMaterial[1].parentNode.style.display = "none";
						}
						if($data.office) {
							personalMaterial[2].innerText = $data.office;
						} else {
							personalMaterial[2].parentNode.style.display = "none";
						}
						if($data.department) {
							personalMaterial[3].innerText = $data.department;
						} else {
							personalMaterial[3].parentNode.style.display = "none";
						}
						if($data.orgName) {
							personalMaterial[4].innerText = $data.orgName;
						} else {
							personalMaterial[4].parentNode.style.display = "none";
						}
						if($data.address) {
							personalMaterial[5].innerText = $data.province + " " + $data.address;
						} else {
							personalMaterial[5].parentNode.style.display = "none";
						}
						if($data.phone) {
							personalMaterial[6].innerText = $data.phone;
						} else {
							personalMaterial[6].parentNode.style.display = "none";
						}
						if($data.email) {
							personalMaterial[7].innerText = $data.email;
						} else {
							personalMaterial[7].parentNode.style.display = "none";
						}
						//个人简介

						if($data.descp) {
							personSummary.innerHTML = $data.descp;
						}
						//学术领域
						if($data.subject) {
							subjectShow($data.subject);
						}else{
							document.getElementsByClassName("infosubject")[0].innerHTML =" ";
						}
						//研究方向
						if($data.researchAreas.length) {
							researchAreaShow($data.researchAreas, $data.editResearchAreaLogs);
						}else{
							document.getElementsByClassName("reserachMess")[0].innerHTML =" "
						}
						//应用行业
						if($data.industry) {
							industryShow($data.industry);
						}else{
							document.getElementsByClassName("infoapply")[0].innerHTML=" "
						}
						//我的资源
						if($data.resources.length) {
							resource($data.resources, $data.resources.length);
						} else {
							document.getElementById("resouse").style.display = "none";
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}
		//我的所有资源、
		function resource(oDa, n) {
			var $data = oDa;
			var html = [];
			for(var i = 0; i < n; i++) {
				var string = '<li class="mui-table-view-cell mui-media listitem" resouId=' + $data[i].resourceId + '>'
				string += '<a class="proinfor" href="resinforupdate.html"><div class="mui-media-object mui-pull-left ResImgBox ResImgBox2">'
				if($data[i].images.length) {
					string += '<img class="resImg headRadius" src="'+ baseUrl+'/data/resource/' + $data[i].images[0].imageSrc + '" />'
				} else {
					string += '<img class="resImg headRadius" src="../images/default-resource.jpg">'
				}
				string += '</div><div class="mui-media-body" style="width:60%">'
				string += '<span class="listtit mui-ellipsis-2">' + $data[i].resourceName + '<div class="updatebox updatebox2" style="top:24px;"><em class="mui-icon mui-icon-compose updatebtn" style="display:none;"></em></div></span>'
				string += '<p class="listtit2 mui-ellipsis-2">' + $data[i].supportedServices + '</p>'
					//					string += '<p class="listtit3 resbrief">'
					//					if($data[i].descp) {
					//						string += $data[i].descp;
					//					}
					//					string += '</p>'
				string += '</div></a></li>'
				html.push(string);
			}
			document.getElementById("resourceList").innerHTML = html.join('');

		}
		//个人信息修改
		document.getElementsByClassName("updatebox")[0].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  			
			webviewShow = plus.webview.create("../html/updateinfo1.html", "../html/updateinfo1.html", {}, {flag:0}); //后台创建webview并打开show.html   	    	
			webviewShow.addEventListener("loaded", function() { //注册新webview的载入完成事件
				//				nwaiting.close(); //新webview的载入完毕后关闭等待框
				//				webviewShow.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
			}, false);
		});
		document.getElementsByClassName("updatebox")[1].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting(); //显示原生等待框  
			var arr = {
				descp: personSummary.innerText,
				flag: 2
			}
			webviewShow = plus.webview.create("../html/updateinfo2.html", "updateinfo2.html", {}, arr); //后台创建webview并打开show.html   	    	
			webviewShow.addEventListener("loaded", function() { //注册新webview的载入完成事件
				nwaiting.close(); //新webview的载入完毕后关闭等待框
				webviewShow.show("slide-in-right", 150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画         
			}, false);
		});
		var page = mui.preload({
			url: "../html/updateinfo3.html",
			id: "updateinfo3.html",
			extras:{flag:0}
		})
		document.getElementsByClassName("updatebox")[2].addEventListener("tap", function() {
			page.show("slide-in-right", 150);
		});
		var page1 = mui.preload({
			url: "../html/updateinfo4.html",
			id: "updateinfo4.html"
		})
		document.getElementsByClassName("updatebox")[3].addEventListener("tap", function() {
			page1.show("slide-in-right", 150);
		});
		var page2 = mui.preload({
			url: "../html/updateinfo5.html",
			id: "updateinfo5.html",
			extras:{flag: 2}//自定义扩展参数
		})
		document.getElementsByClassName("updatebox")[4].addEventListener("tap", function() {
			page2.show("slide-in-right", 150);
		});
		//添加我的资源
		document.getElementsByClassName("addinfobox")[0].addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/updateinfo-res01.html", "updateinfo-res01.html", {}, {
				reFlag: 0
			}); //后台创建webview并打开show.html   	    	
			web.addEventListener("loaded", function() {
				plus.nativeUI.closeWaiting();
				web.show("slide-in-right", 150);
			}, false);
		});
		//修改我的资源
		mui("#resourceList").on("tap", "li", function() {
				var resouId = this.getAttribute("resouId");
				var nwaiting = plus.nativeUI.showWaiting();
				var web = plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
						resourceId: resouId
					})
					//				var web = plus.webview.create("../html/resinforupdate.html", "resinforupdate.html", {}, {
					//					resourceId: resouId,
					//					reFlag:0
					//				}); //后台创建webview并打开show.html   	    	
				web.addEventListener("loaded", function() {

				}, false);
			})
			//修改详细页面
		document.getElementById("updateDetailProfessor").addEventListener("tap", function() {
			var nwaiting = plus.nativeUI.showWaiting();
			var web = plus.webview.create("../html/proinforupdate-more.html", "proinforupdate-more.html"); //后台创建webview并打开show.html   	    	
			web.addEventListener("loaded", function() {}, false);
		});
		personalMessage();
		/*专家文章*/
		mui.ajax(baseUrl + "/ajax/article/qaPro", {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			data: {
				"professorId": userid
			},
			timeout: 10000, //超时设置
			success: function(data) {
				console.log(JSON.stringify(data))
				if(data.success) {
					var $data = data.data;
					if($data.length == 0) {
						document.getElementById("professorArticleList").style.display = "none";
						return;
					}
					var html = [];
					for(var i = 0; i < $data.length; i++) {
						var string = '<li class="mui-table-view-cell mui-media listitem" articleId=' + $data[i].articleId + '>'
						string += '<a class="proinfor" style="position:relative;"><div class="mui-media-object mui-pull-left ResImgBox ResImgBox2">'
						if($data[i].articleImg) {
							string += '<img class="resImg headRadius" src="' + baseUrl + '/data/article/' + $data[i].articleImg + '">'
						} else {
							string += '<img class="resImg headRadius" src="../images/default-artical.jpg">'
						}
						string += '</div><div class="mui-media-body centerTit">'
						string += '<span class="listtit mui-ellipsis-2">' + $data[i].articleTitle + '</span>'
						string += '</div></a></li>'
						html.push(string);
					}
					document.getElementById("articleList").innerHTML = html.join('');
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});
		/*进入文章详细页面*/
		mui("#professorArticleList").on('tap', 'li', function() {
			var artId = this.getAttribute("articleId");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/professorArticle.html", 'professorArticle.html', {}, {
				articleId: artId,
				ownerid:userid
			});
		});
	});
});