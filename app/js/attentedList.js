//阻尼系数
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});


mui.ready(function() {
	mui.plusReady(function() {
		var userId = plus.storage.getItem('userid');
		var pullRefreshEl,index;
		//跳转专家浏览页面
		mui("#likeUser").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting(); //显示原生等待框
			plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
				proid: id
			});
		})
		mui("#likeRes").on("tap", "li", function() {
			var resouId = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
				resourceId: resouId
			});
		})
		mui("#likeArt").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			var datatype = this.getAttribute("data-type");
			var ownerid = this.getAttribute("owner-id");
			if(datatype == 1) {
				plus.nativeUI.showWaiting();
				plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
					articleId: id,
					ownerid: ownerid,
				});
			} else if(datatype == 2) {
				plus.nativeUI.showWaiting();
				plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
					articleId: id,
					ownerid: ownerid,
					oFlag: 1
				});
			}
		})
		mui("#likePer").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/paperShow.html", 'paperShow.html', {}, {
				"paperId": id
			});
		})
		mui("#likePat").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/patentShow.html", 'patentShow.html', {}, {
				"patentId": id
			});
		})
		mui("#likeCmp").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/cmpInforShow.html", 'cmpInforShow.html', {}, {
				"cmpId": id
			});
		})
		getWatchCon(1,10,1)
		getWatchCon(1,10,2)
		getWatchCon(1,10,3)
		getWatchCon(1,10,4)
		getWatchCon(1,10,5)
		getWatchCon(1,10,6)
		
		//左滑及右滑
		document.querySelector('#slider').addEventListener('slide', function(event) {
			var $this = document.querySelector(".mui-scroll .mui-active");
			if($this.innerHTML == "专家") {
				getWatchCon(1,10,1)
			} else if($this.innerHTML == "资源") {
				getWatchCon(1,10,2)
			} else if($this.innerHTML == "文章") {
				getWatchCon(1,10,3)
			} else if($this.innerHTML == "专利") {
				getWatchCon(1,10,4)
			} else if($this.innerHTML == "论文") {
				getWatchCon(1,10,5)
			}else if($this.innerHTML == "企业") {
				getWatchCon(1,10,6)
			}
		});
		//点击
		document.querySelector('#slider').addEventListener('tap', function(event) {
			var $this = document.querySelector(".mui-scroll .mui-active");
			if($this.innerHTML == "专家") {
				getWatchCon(1,10,1)
			} else if($this.innerHTML == "资源") {
				getWatchCon(1,10,2)
			} else if($this.innerHTML == "文章") {
				getWatchCon(1,10,3)
			} else if($this.innerHTML == "专利") {
				getWatchCon(1,10,4)
			} else if($this.innerHTML == "论文") {
				getWatchCon(1,10,5)
			}else if($this.innerHTML == "企业") {
				getWatchCon(1,10,6)
			}
		});

		
		
		function getWatchCon(pageNo,pageSize,num) {
			mui.ajax(baseUrl + '/ajax/watch/qaPro', {
				data: {
					"professorId": userId,
					"watchType": num,
					"pageNo": pageNo,
					"pageSize": pageSize
				},
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				success: function(data) {
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("fade-in", 150);
					if(data.success && data.data.data != "") {
						var datalist = data.data.data;
						if(num==1){
							detailPro(datalist);
						}else if(num==2){
							detailRes(datalist);
						}else if(num==3){
							detailArt(datalist);
						}else if(num==4){
							detailPat(datalist);
						}else if(num==5){
							detailPer(datalist);
						}else if(num==6){
							detailCmp(datalist);
						}
					}else{
						if(num==1){
							document.getElementById("likePro").nextSibling.classList.remove("displayNone");
						}else if(num==2){
							document.getElementById("likeRes").nextSibling.classList.remove("displayNone");
						}else if(num==3){
							document.getElementById("likeArt").nextSibling.classList.remove("displayNone");
						}else if(num==4){
							document.getElementById("likePat").nextSibling.classList.remove("displayNone");
						}else if(num==5){
							document.getElementById("likePer").nextSibling.classList.remove("displayNone");
						}else if(num==6){
							//alert(JSON.stringify(data))
							document.getElementById("likeCmp").nextSibling.classList.remove("displayNone");
							
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle); 
				}
			});
		}
		
		function detailPro(datalist) {
			document.getElementById("likeUser").innerHTML="";
			//console.log(JSON.stringify(datalist))	
			for(var i = 0; i < datalist.length; i++) {
				var li = document.createElement("li");
				var userType = autho(datalist[i].professor.authType, datalist[i].professor.orgAuth, datalist[i].professor.authStatus);
				var os = "";
				if(datalist[i].professor.title) {
					if(datalist[i].professor.orgName) {
						os = datalist[i].professor.title + "，" + datalist[i].professor.orgName;
					} else {
						os = datalist[i].professor.title;
					}
				} else {
					if(datalist[i].professor.office) {
						if(datalist[i].professor.orgName) {
							os = datalist[i].professor.office + "，" + datalist[i].professor.orgName;
						} else {
							os = datalist[i].professor.office;
						}
					} else {
						if(datalist[i].professor.orgName) {
							os = datalist[i].professor.orgName;
						}
					}
				}
				var baImg = "../images/default-photo.jpg";
				if(datalist[i].professor.hasHeadImage == 1) {
					baImg = baseUrl + "/images/head/" + datalist[i].professor.id + "_l.jpg";
				}
				var oSub = "";
				if(datalist[i].professor.researchAreas.length) {
					var arr = [];
					for(var n = 0; n < datalist[i].professor.researchAreas.length; n++) {
						arr[n] = datalist[i].professor.researchAreas[n].caption;
					}
					oSub = "研究方向：" + arr.join(",");
				}
				li.setAttribute("data-id", datalist[i].professor.id);
				li.setAttribute("data-flag", 1);
				li.className = "mui-table-view-cell";
				li.innerHTML = '<div class="flexCenter mui-clearfix">' +
					' <div class="madiaHead useHead" style="background-image:url(' + baImg + ')"></div>' +
					'<div class="madiaInfo">' +
					'<p><span class="h1Font">' + datalist[i].professor.name + '</span><em class="authicon ' + userType.sty + '" title="科袖认证专家"></em></p>' +
					'<p class="mui-ellipsis h2Font">' + os + '</p>' +
					'<p class="mui-ellipsis h2Font">' + oSub + '</p>' +
					'</div>' +
					'</div>'
				document.getElementById("likeUser").appendChild(li);
			}
		}
		function detailCmp(datalist) {
			document.getElementById("likeCmp").innerHTML="";
			//console.log(JSON.stringify(datalist))
			var arr=[];
			for(var i in datalist) {
				arr[i]=datalist[i].watchObject;
			}
			mui.ajax(baseUrl+"/ajax/org/qm",{
				data: {
					id:arr,
				},
				dataType: 'json', //数据格式类型
				type: 'get', //http请求类型
				traditional: true,
				success: function(data) {
					if(data.success && data.data != "") {
						var $data=data.data;
						for(var i = 0; i < $data.length; i++) {
							var li = document.createElement("li");
							li.setAttribute("data-id", $data[i].id);
							var oimg = ($data[i].hasOrgLogo) ? baseUrl + "/images/org/" + $data[i].id + ".jpg" : "../images/default-icon.jpg";
							var oAuth = ($data[i].authStatus == 3) ? 'authicon-com-ok' : '';
							var orgName = ($data[i].forShort) ? $data[i].forShort : $data[i].name;
							var orgType = ($data[i].orgType == '2') ? "上市企业" : "";
							var orgOther = ($data[i].industry) ? $data[i].industry.replace(/,/gi, " | ") : "";
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead companyHead">' +
								'<div class="boxBlock"><img class="boxBlockimg companyImg" src="' + oimg + '"></div>' +
								'</div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis h1Font">' + orgName + '<em class="authicon ' + oAuth + '" title="科袖认证企业"></em></p>' +
								'<p class="mui-ellipsis h2Font"><span id="">' + orgType + '</span> <span id="">' + orgOther + '</span></p>' +
								'</div>' +
								'</div>'
							document.getElementById("likeCmp").appendChild(li);
						}
					}
				},
				error:  function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle); 
				}
			});
		}
		function detailPat(datalist) {
			document.getElementById("likePat").innerHTML="";
			//console.log(JSON.stringify(datalist))
			var arr=[];
			for(var i in datalist) {
				arr[i]=datalist[i].watchObject;
			}
			mui.ajax(baseUrl+"/ajax/ppatent/qm",{
				data: {
					id:arr,
				},
				dataType: 'json', //数据格式类型
				type: 'get', //http请求类型
				traditional: true,
				success: function(data) {
					if(data.success && data.data != "") {
						var $data=data.data;
						for(var i = 0; i < $data.length; i++) {
							var li = document.createElement("li");
							li.setAttribute("data-id", $data[i].id);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead patentHead"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis-2 h1Font">' + $data[i].name + '</p>' +
								'<p class="mui-ellipsis h2Font">' + $data[i].authors.substring(0, $data[i].authors.length - 1) + '</p>' +
								'</div>' +
								'</div>'
							document.getElementById("likePat").appendChild(li);
						}
					}
				},
				error:  function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle); 
				}
			});
		}
		function detailPer(datalist) {
			document.getElementById("likePer").innerHTML="";
			//console.log(JSON.stringify(datalist))
			var arr=[];
			for(var i in datalist) {
				arr[i]=datalist[i].watchObject;
			}
			mui.ajax(baseUrl+"/ajax/ppaper/qm",{
				data: {
					id:arr,
				},
				dataType: 'json', //数据格式类型
				type: 'get', //http请求类型
				traditional: true,
				success: function(data) {
					if(data.success && data.data != "") {
						var $data=data.data;
						for(var i = 0; i < $data.length; i++) {
							var li = document.createElement("li");
							li.setAttribute("data-id", $data[i].id);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead artHead"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis-2 h1Font">' + $data[i].name + '</p>' +
								'<p class="mui-ellipsis h2Font">' + $data[i].authors.substring(0, $data[i].authors.length - 1) + '</p>' +
								'</div>' +
								'</div>'
							document.getElementById("likePer").appendChild(li);
						}
					}
				},
				error:  function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle); 
				}
			});
		}
		function detailRes(datalist) {
			document.getElementById("likeRes").innerHTML="";
			//console.log(JSON.stringify(datalist))
			for(var i = 0; i < datalist.length; i++) {
				var $data = datalist[i].resource;
				var namepo, userType;
				if($data.resourceType == 1) {
					namepo = $data.editProfessor.name;
					userType = autho($data.editProfessor.authType, $data.editProfessor.orgAuth, $data.editProfessor.authStatus);
				} else {
					userType = {};
					if($data.organization.forShort){
						namepo = $data.organization.forShort;
					}else{
						namepo = $data.organization.name;
					}
					
					if($data.organization.authStatus == 3) {
						userType.sty = "authicon-com-ok"
					} else {
						userType.sty = "e"
					}
				}
				var rImg = "../images/default-resource.jpg";
				if($data.images.length) {
					rImg = baseUrl + "/data/resource/" + $data.images[0].imageSrc;
				}
				var li = document.createElement("li");
				li.setAttribute("data-id", $data.resourceId);
				li.setAttribute("data-flag", 2);
				li.className = "mui-table-view-cell";
				li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
					' <div class="madiaHead resouseHead" style="background-image:url(' + rImg + ')"></div>' +
					'<div class="madiaInfo OmadiaInfo">' +
					'<p class="mui-ellipsis h1Font">' + $data.resourceName + '</p>' +
					'<p><span class="h2Font">' + namepo + '</span><em class="authicon ' + userType.sty + '" title="科袖认证专家"></em></p>' +
					'<p class="mui-ellipsis-2 h2Font">用途：' + $data.supportedServices + '</p>' +
					'</div>' +
					'</div>'
				document.getElementById("likeRes").appendChild(li);
			}
		}
		function detailArt(datalist) {
			document.getElementById("likeArt").innerHTML="";
			//console.log(JSON.stringify(datalist))
			for(var i = 0; i < datalist.length; i++) {
				var dataItem = datalist[i].article;
				var of ;
				if(dataItem.articleType == 1) { of = 1;
				} else { of = 2;
				}
				var arImg = "../images/default-artical.jpg";
				if(dataItem.articleImg) {
					arImg = baseUrl + "/data/article/" + dataItem.articleImg
				}
				var title = dataItem.articleTitle;
				var name = ""
				var li = document.createElement("li");
				if( of == 1) {
					var userType = autho(dataItem.professor.authType, dataItem.professor.orgAuth, dataItem.professor.authStatus);
					li.setAttribute("owner-id", dataItem.professor.id);
					li.setAttribute("data-type", 1);
					name = dataItem.professor.name;
				} else {
					var userType = {};
					if(dataItem.organization.authStatus == 3) {
						userType.sty = 'authicon-com-ok'
					} else {
						userType.sty = "e"
					}
					li.setAttribute("owner-id", dataItem.organization.id);
					li.setAttribute("data-type", 2);
					if(dataItem.organization.forShort){
						name = dataItem.organization.forShort;
					}else{
						name = dataItem.organization.name;
					}
					
				}
				li.setAttribute("data-id", dataItem.articleId);
				li.setAttribute("data-flag", 3);
				li.className = "mui-table-view-cell";
				li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
					'<div class="madiaHead artHead" style="background-image:url(' + arImg + ')"></div>' +
					'<div class="madiaInfo OmadiaInfo">' +
					'<p class="mui-ellipsis-2 h1Font">' + title + '</p>' +
					'<p><span class="h2Font" style="margin-right:10px">'+name+'</span><span class="time">'+commenTime(dataItem.publishTime)+'</span></p>'+
					'</div>' +
					'</div>'
				document.getElementById("likeArt").appendChild(li);

			}
		}
	
	})
});