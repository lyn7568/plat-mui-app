

var stt;


mui.plusReady(function() {
	console.log(JSON.stringify(module))
	mui('#articleContent').on('tap','a',function(){
		plus.runtime.openURL( this.href);
	});
	module.lWord(plus.webview.currentWebview().articleId, 1);
	var ffl=false;
	var oCurren = {
		self: plus.webview.currentWebview(),
		userid: plus.storage.getItem('userid'),
		login: function() {
			mui.openWindow({
				url: '../html/login.html',
				id: '../html/login.html',
				show: {
					aniShow: "slide-in-bottom"
				},
				extras: {
					ourl: plus.webview.currentWebview().id
				}
			});
		}
	}
	
	var oArticleModule = {
		articleId: oCurren.self.articleId,
//		oFlag: oCurren.self.oFlag,
//		oWner: oCurren.self.ownerid,
		oAjaxGet: function(url, obj, oType, oFun) {
			mui.ajax(url, {
				data: obj,
				dataType: 'json', //服务器返回json格式数据
				type: oType, //HTTP请求类型//超时时间设置为10秒；
				traditional: true,
				success: function(data) {
					if(data.success) {
						oFun(data.data);
					} else {
						//alert(JSON.stringify(data));
					}
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		},
		queryFileAtach:function(){
			oArticleModule.oAjaxGet(baseUrl + "/ajax/article/files/byArticleId",{
				"id":oArticleModule.articleId
			}, "get", function(data){
				if(data){
					if(data.length>0){
						document.getElementsByClassName('atachList')[0].style.display='block';
					}
				}
			});
		},
		articleMess: function($data) {
			plus.nativeUI.closeWaiting();
			plus.webview.currentWebview().show("slide-in-right", 150);
			console.log(JSON.stringify($data));
			document.getElementById("articleName").innerHTML = $data.articleTitle;
			if($data.articleType=='1'){
				oArticleModule.oFlag = 1;
				oArticleModule.oWner=$data.ownerId;
			}else if($data.articleType=='2') {
				oArticleModule.oFlag = 2;
				oArticleModule.oWner=$data.ownerId;
			}else if($data.articleType=='3') {
				oArticleModule.oFlag = 3;
				oArticleModule.oWner=$data.ownerId;
			}
			if($data.articleImg){
				stt = $data.articleImg.substring(0, 9);
			}
			if($data.articleContent) {
				document.getElementById("articleContent").innerHTML = $data.articleContent;
				var oImg = document.getElementById("articleContent").getElementsByTagName("img");
				for(var i = 0; i < oImg.length; i++) {
					(function(n) {
						var att = oImg[n].src.substr(7);
						oImg[n].setAttribute("src", baseUrl + att);
					})(i);
				}
			}
			if($data.subject) {
				document.getElementsByClassName("tagList")[0].style.display = "block";
				var arr = $data.subject.split(",");
				for(var i in arr) {
					var oLi = document.createElement("li");
					oLi.innerHTML = '<span class="h2Font">' + arr[i] + '</span>'
					document.getElementsByClassName("tagList")[0].appendChild(oLi);
				}
			}
			document.getElementById("snum").innerHTML = $data.articleAgree;
			if($data.articleType == '1') {
				oArticleModule.oAjaxGet(baseUrl + "/ajax/article/ralateArticles", {
					"keys": arr,
					"professorId": oArticleModule.oWner,
					"articleId": oArticleModule.articleId,
					"rows": 5
				}, "get", oArticleModule.correlationArticle);
			} else if($data.articleType == '2') {
				oArticleModule.oAjaxGet(baseUrl + "/ajax/article/ralateArticles", {
					"keys": arr,
					"orgId": oArticleModule.oWner,
					"articleId": oArticleModule.articleId,
					"rows": 5
				}, "get", oArticleModule.correlationArticle);
			} else if($data.articleType == '3') {
				oArticleModule.oAjaxGet(baseUrl + "/ajax/article/ralateArticles", {
					"keys": arr,
					"orgId": oArticleModule.oWner,
					"articleId": oArticleModule.articleId,
					"rows": 5
				}, "get", oArticleModule.correlationArticle);
			}

			document.getElementById("oTime").innerHTML = commenTime($data.publishTime);
			
			if(oArticleModule.oFlag == 1) {
				if(plus.storage.getItem('userid') == oArticleModule.oWner) {
					document.getElementById('attBtn').style.display = "none";
				}
				mui('#personAL').on('tap', '#messImg,#name', function() {
					var id = oArticleModule.oWner;
					plus.nativeUI.showWaiting(); //显示原生等待框
					plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
						proid: id
					}); //后台创建webview并打开show.html
				})
				/*查询是否关注专家*/
				if(oCurren.userid)
				oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/hasWatch", {
					"watchObject": oArticleModule.oWner,
					'professorId': oCurren.userid
				}, "get", oArticleModule.attentionGetExpert);
				/*个人发布文章信息*/
				oArticleModule.oAjaxGet(baseUrl + "/ajax/professor/editBaseInfo/" + oArticleModule.oWner, "", "get", oArticleModule.professorMess);
			} else if(oArticleModule.oFlag == 2) {
				/*企业发布文章信息*/
				oArticleModule.oAjaxGet(baseUrl + "/ajax/org/" + oArticleModule.oWner, "", "get", oArticleModule.business);
				//document.getElementById('attBtn').style.display = "none";
				companylist();
				if(oCurren.userid)
				oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/hasWatch", {
					"watchObject": oArticleModule.oWner,
					'professorId': oCurren.userid
				}, "get", oArticleModule.attentionGetExpert);
			} else if(oArticleModule.oFlag == 3){
				document.getElementById('attBtn').style.display = "none";
				oArticleModule.oAjaxGet(baseUrl + "/ajax/platform/info", {id:oArticleModule.oWner}, "get", oArticleModule.platform);
			}
			
		},
		professorMess: function($data) {
			document.getElementById('name').innerHTML = $data.name;
			if($data.hasHeadImage == 1) {
				document.getElementById("messImg").style.backgroundImage = "url(" + baseUrl + "/images/head/" + $data.id + "_l.jpg" + ")";
			}
			var userType = autho($data.authType, $data.orgAuth, $data.authStatus);
			document.getElementById("auth").classList.add(userType.sty);
		},
		business: function($data) {
			if($data.forShort){
				document.getElementById('name').innerHTML = $data.forShort;
			}else{
				document.getElementById('name').innerHTML = $data.name;
			}
			document.getElementById("messImg").classList.add("cmpHead2");
			document.getElementById("messImg").innerHTML='<div class="boxBlock"><img class="boxBlockimg" id="companyImg" src="../images/default-icon.jpg"></div>'
			if($data.hasOrgLogo) {
				document.getElementById("companyImg").src= baseUrl + "/images/org/" + $data.id + ".jpg";
			}
			if($data.authStatus==3){
				document.getElementById("auth").classList.add("authicon-com-ok");
			}
			mui('#personAL').on('tap', '#messImg,#name', function() {
				mui.openWindow({
					url: '../html/cmpInforShow.html',
					id: 'cmpInforShow.html',
					show: {
						autoShow: false,
						aniShow: "slide-in-right",
					},
					extras: {
						cmpId: oArticleModule.oWner,
					}
				});
			})
			if(!$data.colMgr && !$data.resMgr) {
				oArticleModule.correlationProduct();
			}
			if($data.colMgr) {
				oArticleModule.queryFileAtach();
			}
		},
		platform: function($data) {
			console.log(JSON.stringify($data));
			document.getElementById('name').innerHTML = $data.name;
			document.getElementById("messImg").classList.add("cmpHead2");
			document.getElementById("messImg").innerHTML='<div class="boxBlock"><img class="boxBlockimg" id="platImg" src="../images/default-icon.jpg"></div>'
			if($data.logo) {
				document.getElementById("platImg").src= baseUrl + "/data/platform" + $data.logo;
			}
		},
		correlationExpert: function() {
			oArticleModule.oAjaxGet(baseUrl + "/ajax/article/ralatePro", {
				"articleId": oArticleModule.articleId
			}, "get", function($data){
				if($data.length == 0) {
					return;
				}
				document.getElementById("correlationExpert").style.display = "block";
				for(var i = 0; i < $data.length; i++) {
					(function(n) {
						oArticleModule.oAjaxGet(baseUrl + "/ajax/professor/editBaseInfo/" + $data[n].professorId, "", "get", oArticleModule.expertList);
					})(i)
	
				}
			})
		},
		expertList: function($data) {
			var os = "";
			if($data.title) {
				if($data.orgName) {
					os = $data.title + "，" + $data.orgName;
				} else {
					os = $data.title;
				}
			} else {
				if($data.office) {
					if($data.orgName) {
						os = $data.office + "，" + $data.orgName;
					} else {
						os = $data.office;
					}
				} else {
					if($data.orgName) {
						os = $data.orgName;
					}
				}
			}
			var baImg = "../images/default-photo.jpg";
			if($data.hasHeadImage == 1) {
				baImg = baseUrl + "/images/head/" + $data.id + "_l.jpg";
			}
			var userType = autho($data.authType, $data.orgAuth, $data.authStatus);
			var li = document.createElement("li");
			li.className = "mui-table-view-cell";
			li.setAttribute("data-id", $data.id);
			li.innerHTML = '<div class="flexCenter mui-clearfix">' +
				'<div class="madiaHead useHead" style="background-image:url(' + baImg + ')"></div>' +
				'<div class="madiaInfo">' +
				'<p><span class="h1Font">' + $data.name + '</span><em class="authicon ' + userType.sty + '"></em></p>' +
				'<p class="mui-ellipsis h2Font">' + os + '</p>' +
				'</div>' +
				'</div>'
			document.getElementById("expertList").appendChild(li);
		},
		correlationResource: function() {
			oArticleModule.oAjaxGet(baseUrl + "/ajax/article/ralateRes", {
				"articleId": oArticleModule.articleId
			}, "get", function($data){
				if($data.length == 0) {
					return;
				}
				document.getElementById("resource").style.display = "block";
				for(var i = 0; i < $data.length; i++) {
					oArticleModule.oAjaxGet(baseUrl + "/ajax/resource/queryOne", {
						"resourceId": $data[i].resourceId
					}, "get", oArticleModule.rsourceList);
				}
			})
		},
		rsourceList: function($data) {
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
			if($data.images.length>0){
				rImg = baseUrl + "/data/resource/" + $data.images[0].imageSrc;
			}
			var li = document.createElement("li");
			li.setAttribute("data-id", $data.resourceId);
			li.className = "mui-table-view-cell";
			li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
				' <div class="madiaHead resouseHead" style="background-image:url(' + rImg + ')"></div>' +
				'<div class="madiaInfo OmadiaInfo">' +
				'<p class="mui-ellipsis-2 h1Font">' + $data.resourceName + '</p>' +
				'<p><span class="h2Font">' + namepo + '</span><em class="authicon ' + userType.sty + '" title="科袖认证专家"></em></p>' +
				'</div>' +
				'</div>'
			document.getElementById("resourceList").appendChild(li);
		},
		correlationService: function() {
			oArticleModule.oAjaxGet(baseUrl + "/ajax/ware/byArticle",{
				"id": oArticleModule.articleId,
				"rows":5
			}, "get", function(res){
				console.log(JSON.stringify(res));
				var $data=res
				if($data.length == 0) {
					return;
				}
				document.getElementById("correlationService").style.display = "block";
				for(var i = 0; i < $data.length; i++) {
					var cnt="", rImg="../images/default-service.jpg"
					if($data[i].images) {
						var subs = strToAry($data[i].images)
						if(subs.length > 0) {
							rImg=baseUrl+"/data/ware" + subs[0]
						}
					}
					if($data.cnt){
						cnt="内容："+$data.cnt
					}
					var li = document.createElement("li");
					li.setAttribute("data-id",$data[i].id);
					li.className = "mui-table-view-cell";
					li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
						' <div class="madiaHead resouseHead" style="background-image:url(' + rImg + ')"></div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis-2 h1Font">' + $data[i].name + '</p>' +
						'<p><span class="h2Font ownerName"></span><em class="authicon ownerSty"></em></p>' +
//						'<p class="mui-ellipsis h2Font">' + cnt + '</p>' +
						'</div>' +
						'</div>'
					document.getElementById("serviceList").appendChild(li);
					var $li=$(li)
					if($data[i].category==1){
						oArticleModule.proSigInfo($data[i].owner,$li)
					}else{
						oArticleModule.orgSigInfo($data[i].owner,$li)
					}
				}
			});
		},
		correlationProduct: function() {
			oArticleModule.oAjaxGet(baseUrl + "/ajax/article/product",{
				"id": oArticleModule.articleId,
				"rows":5
			}, "get", function(res){
				var $data=res
				console.log(JSON.stringify(res));
				if($data.length == 0) {
					return;
				}
				document.getElementById("correlationProduct").style.display = "block";
				for(var i = 0; i < $data.length; i++) {
					oArticleModule.oAjaxGet(baseUrl + "/ajax/product/qo", {
						"id": $data[i].product
					}, "get", oArticleModule.productList);
				}
			});
		},
		productList: function($data) {
			var cnt="", rImg="../images/default-product.jpg"
			if($data.images) {
				var subs = strToAry($data.images)
				if(subs.length > 0) {
					rImg=baseUrl+"/data/product" + subs[0]
				}
			}
			if($data.cnt){
				cnt="简介："+$data.cnt
			}
			var li = document.createElement("li");
			li.setAttribute("data-id",$data.id);
			li.className = "mui-table-view-cell";
			li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
				' <div class="madiaHead resouseHead" style="background-image:url(' + rImg + ')"></div>' +
				'<div class="madiaInfo OmadiaInfo">' +
				'<p class="mui-ellipsis-2 h1Font">' + $data.name + '</p>' +
				'<p><span class="h2Font ownerName"></span><em class="authicon ownerSty"></em></p>' +
				'</div>' +
				'</div>'
			document.getElementById("productList").appendChild(li);
			var $li=$(li)
			oArticleModule.orgSigInfo($data.owner,$li)
		},
		correlationArticle: function($data) {
			if($data.total) {
				if($data.data.length == 0) {
					return;
				}
			}else{
				if($data.length == 0) {
					return;
				}
			}
			var oo=1;
			if($data.total) {
				var $data=$data.data;
				console.log(JSON.stringify($data))
				document.getElementById('newarticle').style.display = "block";
				oo=0;
			}else{
				document.getElementById('article').style.display = "block";
				
			}
			
			for(var i = 0; i < $data.length; i++) {
				var ourl, of,dataSt;
				if($data[i].articleType == '1') {
					ourl = baseUrl + "/ajax/professor/editBaseInfo/" + $data[i].ownerId; of = 1;
				} else if($data[i].articleType == '2'){
					ourl = baseUrl + "/ajax/org/" + $data[i].ownerId; of = 2;
				} else if($data[i].articleType == '3'){
					ourl = baseUrl + "/ajax/platform/info"; of = 3;
					dataSt ={ id:$data[i].ownerId };
				}
				var arImg = "../images/default-artical.jpg";
				if($data[i].articleImg) {
					arImg = baseUrl + "/data/article/" + $data[i].articleImg
				}
				var title = $data[i].articleTitle;
				mui.ajax(ourl, {
					dataType: 'json', //服务器返回json格式数据
					data: dataSt,
					type: "get", //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					async: false,
					traditional: true,
					success: function(data) {
						if(data.success) {
							var namepo=""
							var li = document.createElement("li");
							if( of == 1) {
								namepo = data.data.name;
								var userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
								li.setAttribute("owner-id", data.data.id);
								li.setAttribute("data-type", 1);
							} else if(of == 2){
								if(data.data.forShort){
									namepo = data.data.forShort;
								}else{
									namepo = data.data.name;
								}
								var userType = {};
								if(data.data.authStatus == 3) {
									userType.sty = 'authicon-com-ok'
								} else {
									userType.sty = "e"
								}
								li.setAttribute("owner-id", data.data.id);
								li.setAttribute("data-type", 2);
							}else if(of == 3){
								namepo = data.data.name;
								
								li.setAttribute("owner-id", data.data.id);
								li.setAttribute("data-type", 3);
							}
							li.setAttribute("data-id", $data[i].articleId);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead artHead" style="background-image:url(' + arImg + ')"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis-2 h1Font">' + title + '</p>' +
								'<p><span class="h2Font" style="margin-right:10px">'+namepo+'</span><span class="time">'+commenTime($data[i].publishTime)+'</span></p>'+
								'</div>' +
								'</div>'
							
							if(oo==0){
								document.getElementById("newarticleList").appendChild(li)
							}else{
								document.getElementById("articleList").appendChild(li);
							}
						}
					},
					error: function(xhr, type, errorThrown) {
						//异常处理；
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				});
			}
		},
		thumbsUp: function($data) {
			document.getElementById("snum").innerHTML = Number(document.getElementById("snum").innerHTML) + 1;
			document.getElementsByClassName("thumbBtn")[0].classList.add("thumbedBtn");
		},
		thumbs: function($data) {

			if($data) {
				document.getElementsByClassName("thumbBtn")[0].classList.add("thumbedBtn");
			}
		},
		attentionGetExpert: function($data) {
			if($data) {
				document.getElementsByClassName("attenSpan")[0].classList.add("attenedSpan");
				document.getElementsByClassName("attenSpan")[0].innerText = "已关注";
			}
		},
		attentionPostExpert: function($data) {
			document.getElementsByClassName("attenSpan")[0].classList.add("attenedSpan");
			document.getElementsByClassName("attenSpan")[0].innerText = "已关注";
		},
		attentionNoPostExpert: function($data) {
			document.getElementsByClassName("attenSpan")[0].classList.remove("attenedSpan");
			document.getElementsByClassName("attenSpan")[0].innerText = "关注";
		},
		storeGetUp: function($data) {
			if($data) {
				document.getElementsByClassName("icon-shoucang")[0].classList.add("icon-yishoucang");
			}
		},
		storePostUp: function($data) {
			plus.nativeUI.toast("收藏成功", toastStyle);
			document.getElementsByClassName("icon-shoucang")[0].classList.add("icon-yishoucang");
			console.log(document.getElementsByClassName("icon-shoucang")[0].className);
		},
		storeDeleteUp: function($data) {
			plus.nativeUI.toast("已取消收藏", toastStyle);
			document.getElementsByClassName("icon-shoucang")[0].classList.remove("icon-yishoucang");
		},
		proSigInfo:function(id,$list){
			oArticleModule.oAjaxGet(baseUrl + "/ajax/professor/baseInfo/"+id,{
			}, "get", function(data){
				var datas=data
				var userType = autho(datas.authType, datas.orgAuth, datas.authStatus);
				$list.find(".ownerName").html(datas.name)
				$list.find(".ownerSty").addClass(userType.sty)
			});
		},
		orgSigInfo:function(id,$list){
			oArticleModule.oAjaxGet(baseUrl + "/ajax/org/" + id,{
			}, "get", function(data){
				var datas=data
				var name=datas.name;
				if(datas.forShort){
					name=datas.forShort
				}
				$list.find(".ownerName").html(name)
				if(datas.authStatus == 3){
					$list.find(".ownerSty").addClass("authicon-com-ok")
				}
			});
		}
		
	}
	pageViewLog(oArticleModule.articleId, 3)
	wlog("article", oArticleModule.articleId, "2")
	/*文章详细内容*/
	oArticleModule.oAjaxGet(baseUrl + "/ajax/article/query", {
		articleId: oArticleModule.articleId
	}, "get", oArticleModule.articleMess);
	
	oArticleModule.oAjaxGet(baseUrl + "/ajax/article/find", {
		"pageSize":5,
		"exclude":oArticleModule.articleId
	}, "get", oArticleModule.correlationArticle);
	oArticleModule.correlationExpert();
	oArticleModule.correlationResource();
	oArticleModule.correlationService();
	oArticleModule.correlationProduct()
	//相关企业
	function companylist() {
		mui.ajax(baseUrl+"/ajax/article/ralateOrg",{
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		data: {
			"articleId": oArticleModule.articleId,
		},
		timeout: 10000, //超时设置
		success: function(data) {
			if(data.success) {
				
				var $data=data.data;
				if($data.length) {
					document.getElementById("bus").style.display="block";
				}
				for(var i=0;i<$data.length;i++) {
					angleBus.call($data[i])
				}
			}
		},
		error: function() {
			$.MsgBox.Alert('提示', '服务器请求失败')
		}
	});
	}
	function angleBus() {
		mui.ajax(baseUrl+"/ajax/org/" +this.orgId,{
			type: "GET",
			timeout: 10000,
			dataType: "json",
			context: document.getElementById("busList"),
			success: function(data) {
				if(data.success) {
					busfil.call(this,data.data);
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				$.MsgBox.Alert('提示', '服务器请求失败')
			}
		})
	}
	function busfil($data) {				
				var li = document.createElement("li");
					li.setAttribute("data-id", $data.id);
					var oimg = ($data.hasOrgLogo) ? baseUrl + "/images/org/" + $data.id + ".jpg" : "../images/default-icon.jpg";
					var oAuth = ($data.authStatus == 3) ? 'authicon-com-ok' : '';
					var orgName = ($data.forShort) ? $data.forShort : $data.name;
					var orgType = ($data.orgType == '2') ? "上市企业" : "";
					var orgOther = ($data.industry) ? $data.industry.replace(/,/gi, " | ") : "";
					li.className = "mui-table-view-cell";
					li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
						'<div class="madiaHead companyHead">' +
						'<div class="boxBlock" style="width:88px;height:58px;"><img class="boxBlockimg companyImg" src="' + oimg + '"></div>' +
						'</div>' +
						'<div class="madiaInfo OmadiaInfo">' +
						'<p class="mui-ellipsis h1Font">' + orgName + '<em class="authicon ' + oAuth + '" title="科袖认证企业"></em></p>' +
						'<p class="mui-ellipsis h2Font"><span id="">' + orgType + '</span> <span id="">' + orgOther + '</span></p>' +
						'</div>' +
						'</div>'
					this.appendChild(li);

}
	mui('#expertList').on('tap', 'li', function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting(); //显示原生等待框
		plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
			proid: id
		});
	})
	mui('#busList').on('tap', 'li', function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting(); //显示原生等待框
		plus.webview.create("../html/cmpInforShow.html", 'cmpInforShow.html', {}, {
			cmpId: id
		});
	})
	
	/*资源浏览*/
	mui('#resourceList').on('tap', 'li', function() {
		var resouId = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
			resourceId: resouId
		});
	})
	mui("#serviceList").on('tap', 'li', function() {
		var serviceId = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/serviceShow.html", 'serviceShow.html', {}, {
			serviceId: serviceId
		});
	})
	mui("#productList").on('tap', 'li', function() {
		var Id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/productShow.html", 'productShow.html', {}, {
			productId: Id
		});
	})
	mui('#articleList,#newarticleList').on('tap', 'li', function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		var webviewShow=plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
			articleId: id
		});
		webviewShow.addEventListener("loaded", function() {
			setTimeout(function(){plus.webview.currentWebview().close()},1000)
			
		}, false);

	});
	document.getElementsByClassName("thumbBtn")[0].addEventListener("tap", function() {
		var oClsNm = document.getElementById("snum").parentNode.className;
		if(oClsNm == 'thumbBtn thumbedBtn')
			return;
		oCurren.userid = plus.storage.getItem('userid');
		if(oCurren.userid) {
			oArticleModule.oAjaxGet(baseUrl + "/ajax/article/agree", {
				"articleId": oArticleModule.articleId,
				'operateId': oCurren.userid,
				"uname":plus.storage.getItem('name')
			}, "post", oArticleModule.thumbsUp);
		} else {
			oCurren.login();
		}
	})
	/*查询是否点赞,登录状态下查询否则不查*/
	if(oCurren.userid) {
		oArticleModule.oAjaxGet(baseUrl + "/ajax/article/isAgree", {
			"articleId": oArticleModule.articleId,
			'operateId': oCurren.userid
		}, "get", oArticleModule.thumbs);
		/*查询是否收藏文章*/
		oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/hasWatch", {
			"watchObject": oArticleModule.articleId,
			'professorId': oCurren.userid
		}, "get", oArticleModule.storeGetUp);

	}
	/*自定义事件*/
	window.addEventListener("newId", function(event) {
		oCurren.userid = plus.storage.getItem('userid');
		if(oCurren.userid == oArticleModule.oWner) {
			document.getElementById('attBtn').style.display = "none";
		}
		
			/*查询是否关注专家*/
		oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/hasWatch", {
			"watchObject": oArticleModule.oWner,
			'professorId': oCurren.userid
		}, "get", oArticleModule.attentionGetExpert);
		
		oArticleModule.oAjaxGet(baseUrl + "/ajax/article/isAgree", {
			"articleId": oArticleModule.articleId,
			'operateId': oCurren.userid
		}, "get", oArticleModule.thumbs);
		/*查询是否收藏文章*/
		oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/hasWatch", {
			"watchObject": oArticleModule.articleId,
			'professorId': oCurren.userid
		}, "get", oArticleModule.storeGetUp);
		module.init.init();
	})

	document.getElementsByClassName("attenSpan")[0].addEventListener("tap", function() {
		var oClsNm = document.getElementsByClassName("attenSpan")[0].className;
		oCurren.userid = plus.storage.getItem('userid');
		if(oCurren.userid) {
			var $info={};
			if(oArticleModule.oFlag == 1) {
				$info={
					"watchObject": oArticleModule.oWner,
					'professorId': oCurren.userid
				}
			}else{
				$info={
					"watchObject": oArticleModule.oWner,
					'professorId': oCurren.userid
				}
			}
			if(oClsNm == 'mui-icon attenSpan attenedSpan') {
				oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/delete",$info , "post", oArticleModule.attentionNoPostExpert);
			} else {
				$info.uname=plus.storage.getItem('name');
				if(oArticleModule.oFlag == 1) {
					$info.watchType=6;
				}else{
					$info.watchType=1;
				}
				oArticleModule.oAjaxGet(baseUrl + "/ajax/watch", $info, "post", oArticleModule.attentionPostExpert);
			}
		} else {
			oCurren.login();
		}
	})
	/*收藏文章*/
	//  
	document.getElementById('atto').addEventListener("tap", function() {
		var oClsNm = document.getElementsByClassName("icon-shoucang")[0].className;
		oCurren.userid = plus.storage.getItem('userid');
		if(oCurren.userid) {
			if(oClsNm == 'mui-icon iconfontnew icon-shoucang icon-yishoucang') {
				oArticleModule.oAjaxGet(baseUrl + "/ajax/watch/delete", {
					"watchObject": oArticleModule.articleId,
					'professorId': oCurren.userid
				}, "post", oArticleModule.storeDeleteUp);
			} else {
				oArticleModule.oAjaxGet(baseUrl + "/ajax/watch", {
					"watchObject": oArticleModule.articleId,
					'professorId': oCurren.userid,
					"watchType": 3,
					"uname": plus.storage.getItem('name')
				}, "post", oArticleModule.storePostUp);
			}
		} else {
			oCurren.login();
		}
	})
	
	/*微信及微信朋友圈分享专家*/
	var auths, shares;
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
	});
	mui("#shareBlock").on("tap", "li", function() {
		document.getElementById("shareBlock").style.display = "none";
		document.getElementById("maskBlack").style.display = "none";
		var oFen = this.getElementsByTagName("span")[0].innerHTML;
		if(oFen == "微信好友") {
			if(!weixinClient()) {
					return;
				}
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneSession", {
					content: document.getElementById("articleContent").innerText.substring(0, 70),
					title: document.getElementById("articleName").innerHTML,
					href: baseUrl + "/e/a.html?id=" + oArticleModule.articleId,
					thumbs: [baseUrl + "/data/article/" + stt + oArticleModule.articleId + "_s.jpg"]
				});
			}
		} else if(oFen == "微信朋友圈") {
			if(!weixinClient()) {
					return;
				}
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneTimeline", {
					content: document.getElementById("articleContent").innerText.substring(0, 70),
					title: document.getElementById("articleName").innerHTML,
					href: baseUrl + "/e/a.html?id=" + oArticleModule.articleId,
					thumbs: [baseUrl + "/data/article/" + stt + oArticleModule.articleId + "_s.jpg"]
				});
			}
		} else if(oFen == "新浪微博") {
			var share = buildShareService("sinaweibo");
			if(share) {
				shareMessage(share, "sinaweibo", {
					content: document.getElementById("articleName").innerHTML+baseUrl + "/e/a.html?id=" + oArticleModule.articleId
				});
			}
		}

	})

	function buildShareService(ttt) {
		var share = shares[ttt];
		if(share) {
			if(share.authenticated) {
				console.log("---已授权---");
			} else {
				console.log("---未授权---");
				share.authorize(function() {
					console.log('授权成功...')
				}, function(e) {
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
			if(plus.storage.getItem('userid')) {
				shareAddIntegral(3);
			}

		}, function(e) {
			console.log(JSON.stringify(e))
			plus.nativeUI.closeWaiting();
			if(e.code == -2) {
			
			}
		});
	}

	mui(".tagList").on("tap", "li", function() {
		 plus.nativeUI.showWaiting();
		var web = plus.webview.create("../html/searchListNew2.html?content=6", "../html/searchListNew2.html", {}, {
			key: this.getElementsByTagName("span")[0].innerHTML,
			qiFlag: 3
		}); 
	})
	
	moreMes();
	function moreMes(){
		document.getElementById("BtnMore").addEventListener("tap",function(){
			var oUrl=baseUrl + "/images/logo180.png";
			plus.nativeUI.showWaiting(); //显示原生等待框
		var webviewShow = plus.webview.create("../html/moreItem.html", 'moreItem.html', {}, {
			proid: oArticleModule.articleId,
			name:"article",
			data:{
					content: document.getElementById("articleContent").innerText.substring(0, 70),
					title: document.getElementById("articleName").innerHTML,
					href: baseUrl + "/e/a.html?id=" + oArticleModule.articleId,
					thumbs: [baseUrl + "/data/article/" + stt + oArticleModule.articleId + "_s.jpg"]
				},
			weiboData:{
					content: document.getElementById("articleName").innerHTML+baseUrl + "/e/a.html?id=" + oArticleModule.articleId
				}
		})
		})
	}
	document.getElementsByClassName("topback")[0].addEventListener("tap",function(){
			var web = plus.webview.getWebviewById("cmpInforShow.html");
			var web1 = plus.webview.getWebviewById("cmpInforShow-article.html");
			if(!web1){
				if(web) 
				mui.fire(web, "newId",{
									rd: 1
							});
			}
			
	})
});