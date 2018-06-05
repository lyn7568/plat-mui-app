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
		var pullRefreshEl;
		var rows =10,
			currentIndex,
			currentSelf,
			watchO={
				watchTime:"",
				watchObjId:"",
			};
		var oAjax = function(url, dataS, otype, oFun,beforeFun,completeFun) {
				mui.ajax(baseUrl+url,{
					dataType: 'json',
					type: otype,
					data: dataS,
					traditional: true,
					beforeSend: beforeFun,
					success: function(res) {
						if(res.success) {
							oFun(res)
						}
					},
					complete:completeFun
		            
				});
			},	
			insertNodata = function (targetE,newStr) {
	            var parent = document.getElementById(targetE).parentNode;
	            var kong = document.createElement("div");
	            kong.className = "con-kong";
	            kong.innerHTML ='<div class="picbox picNull"></div>'+
				            '<div class="txtbox">暂时没有符合该搜索条件的内容</div>'
	            if(newStr){
	            	kong.querySelector(".txtbox").innerHTML = newStr;
	            }
	            if (parent.firstChild.className == "con-kong") {
	                return
	            } else {
	                parent.insertBefore(kong,parent.firstChild);
	            }
	
	        },
	        removeNodata = function (targetE) {
	            var parent = document.getElementById(targetE).parentNode;
	            if (parent.firstChild.className == "con-kong") {
	                parent.removeChild(parent.firstChild);
	            } else {
	                return
	            }
	        },
			collectSorts=function(tabIndex,type){
				var aimId="",newStr=""
				oAjax("/ajax/watch/proList",{//我关注的列表
					"professorId": userId,
					"watchType":type,
					"createTime": watchO.watchTime,
					"watchObject":watchO.watchObjId,
					"rows":rows
				}, "GET", function(res){
					plus.nativeUI.closeWaiting();
					plus.webview.currentWebview().show("fade-in", 150);
					var $info = res.data;
					var arr=[];
					if($info.length > 0) {
						$("#"+aimId).show()
						watchO.watchTime = $info[$info.length - 1].createTime;
						watchO.watchObjId = $info[$info.length - 1].watchObject;
						for(var i in $info) {
							arr[i]=$info[i].watchObject;
						}
					}
					if(type==1){
	                	aimId="likeUser"
	                	newStr="您还未关注任何专家"
	                	detailPro(arr,aimId);
	                }else if(type==2){
	                	aimId="likeRes"
	                	newStr="您还未收藏任何资源"
	                	detailRes(arr,aimId);
					}else if(type==3){
						aimId="likeArt"
						newStr="您还未收藏任何文章"
						detailArt(arr,aimId);
					}else if(type==4){
						aimId="likePat"
						newStr="您还未收藏任何专利"
						detailPat(arr,aimId);
					}else if(type==5){
						aimId="likePer"
						newStr="您还未收藏任何论文"
						detailPer(arr,aimId);
					}else if(type==6){
						aimId="likeCmp"
						newStr="您还未关注任何企业"
						detailCmp(arr,aimId);
					}else if(type==7){
						aimId="likeDemand"
						newStr="您还未收藏任何需求"
						detailDemand(arr,aimId);
					}else if(type==10){
						aimId="likeSer"
						newStr="您还未收藏任何服务"
						detailService(arr,aimId);
					}
					if (currentIndex != tabIndex) {
		                currentIndex = tabIndex;
		                mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function ($_index, pullRefreshEl) {
		                    if ($_index == tabIndex) {
		                        currentSelf = mui(pullRefreshEl).pullToRefresh({
		                            up: {
		                                callback: function () {
		                                	if(currentSelf.loading){
			                                    setTimeout(function () {
			                                         collectSorts(tabIndex,type)
			                                         currentSelf.endPullUpToRefresh();
			                                    }, 1000);
		                                    }
		                                }
		                            }
		                        });
		                    }
		                })
		            }
					var liLen=document.getElementById(aimId).querySelectorAll("li").length;
	                removeNodata(aimId);
	                if($info.length == 0 && liLen == 0 ){
	                	$("#"+aimId).hide()
	                    insertNodata(aimId,newStr);
	                }
					if ($info.length < rows) {
                        currentSelf.endPullUpToRefresh(true);
                    }else {
                        currentSelf.endPullUpToRefresh(false);
                    }
				})
			},
			detailPro=function(arr,obj) {
				oAjax("/ajax/professor/qm",{
					id:arr,
				},"get",function(data){
					var dataStr=data.data;
					for(var i = 0; i < dataStr.length; i++) {
						var userType = autho(dataStr[i].authType, dataStr[i].orgAuth, dataStr[i].authStatus);
						var os = "";
						if(dataStr[i].title) {
							if(dataStr[i].orgName) {
								os = dataStr[i].title + "，" + dataStr[i].orgName;
							} else {
								os = dataStr[i].title;
							}
						} else {
							if(dataStr[i].office) {
								if(dataStr[i].orgName) {
									os = dataStr[i].office + "，" + dataStr[i].orgName;
								} else {
									os = dataStr[i].office;
								}
							} else {
								if(dataStr[i].orgName) {
									os = dataStr[i].orgName;
								}
							}
						}
						var baImg = "../images/default-photo.jpg";
						if(dataStr[i].hasHeadImage == 1) {
							baImg = baseUrl+"/images/head/" + dataStr[i].id + "_l.jpg";
						}
						
						var li = document.createElement("li");
						li.setAttribute("data-id", dataStr[i].id);
						li.setAttribute("data-flag", 1);
						li.className = "mui-table-view-cell flexCenter";
						li.innerHTML =
							' <div class="madiaHead useHead" style="background-image:url(' + baImg + ')"></div>' +
							'<div class="madiaInfo">' +
							'<p><span class="h1Font">' + dataStr[i].name + '</span><em class="authicon ' + userType.sty + '"></em></p>' +
							'<p class="mui-ellipsis h2Font">' + os + '</p>' +
							'</div>'
						document.getElementById(obj).appendChild(li);
					}
				});
			},
			detailCmp=function(arr,obj) {
				oAjax("/ajax/org/qm",{
					id:arr,
				},"get",function(data){
					var dataStr=data.data;
					for(var i = 0; i < dataStr.length; i++) {
						var li = document.createElement("li");
						li.setAttribute("data-id", dataStr[i].id);
						var oimg = (dataStr[i].hasOrgLogo) ?baseUrl+"/images/org/" + dataStr[i].id + ".jpg" : "../images/default-icon.jpg";
						var oAuth = (dataStr[i].authStatus == 3) ? 'authicon-com-ok' : '';
						var orgName = (dataStr[i].forShort) ? dataStr[i].forShort : dataStr[i].name;
						var orgType = (dataStr[i].orgType == '2') ? "上市企业" : "";
						var orgOther = (dataStr[i].industry) ? dataStr[i].industry.replace(/,/gi, " | ") : "";
						li.className = "mui-table-view-cell flexCenter OflexCenter";
						li.innerHTML = 
							'<div class="madiaHead companyHead">' +
							'<div class="boxBlock"><img class="boxBlockimg companyImg" src="' + oimg + '"></div>' +
							'</div>' +
							'<div class="madiaInfo OmadiaInfo">' +
							'<p class="mui-ellipsis h1Font">' + orgName + '<em class="authicon ' + oAuth + '" title="科袖认证企业"></em></p>' +
							'<p class="mui-ellipsis h2Font"><span id="">' + orgType + '</span> <span id="">' + orgOther + '</span></p>' +
							'</div>'
						document.getElementById(obj).appendChild(li);
					}
				});
			},
			detailPat=function(arr,obj) {
				oAjax("/ajax/ppatent/qm",{
					id:arr,
				},"get",function(data){
					var $data=data.data;
					for(var i = 0; i < $data.length; i++) {
						var li = document.createElement("li");
							li.setAttribute("data-id", $data[i].id);
							li.className = "mui-table-view-cell flexCenter OflexCenter";
							li.innerHTML = 
								'<div class="madiaHead patentHead"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis-2 h1Font">' + $data[i].name + '</p>' +
								'<p class="mui-ellipsis h2Font">' + $data[i].authors.substring(0, $data[i].authors.length - 1) + '</p>' +
								'</div>'
						document.getElementById(obj).appendChild(li);
					}
				});
			},
			detailPer=function(arr,obj) {
				oAjax("/ajax/ppaper/qm",{
					id:arr,
				},"get",function(data){
					var $data=data.data;
					for(var i = 0; i < $data.length; i++) {
						var li = document.createElement("li");
						li.setAttribute("data-id", $data[i].id);
						li.className = "mui-table-view-cell flexCenter OflexCenter";
						li.innerHTML = 
							'<div class="madiaHead paperHead"></div>' +
							'<div class="madiaInfo OmadiaInfo">' +
							'<p class="mui-ellipsis-2 h1Font">' + $data[i].name + '</p>' +
							'<p class="mui-ellipsis h2Font">' + $data[i].authors.substring(0, $data[i].authors.length - 1) + '</p>' +
							'</div>'
						document.getElementById(obj).appendChild(li);
					}
				});
			},
			detailRes=function(arr,obj) {
				oAjax("/ajax/resource/qm",{
					id:arr,
				},"get",function(data){
					var dataItem=data.data;
					for(var i = 0; i < dataItem.length; i++) {
						var dataStr=dataItem[i]
						var rImg = "../images/default-resource.jpg";
						if(dataStr.images.length) {
							rImg = baseUrl+"/data/resource/" + dataStr.images[0].imageSrc;
						}
						var li = document.createElement("li");
						li.setAttribute("data-id", dataStr.resourceId);
						li.setAttribute("data-flag", 2);
						li.className = "mui-table-view-cell flexCenter OflexCenter";
						li.innerHTML =
							' <div class="madiaHead resouseHead" style="background-image:url(' + rImg + ')"></div>' +
							'<div class="madiaInfo OmadiaInfo">' +
							'<p class="mui-ellipsis h1Font">' + dataStr.resourceName + '</p>' +
							'<p><span class="h2Font ownerName"></span><em class="authicon ownerSty"></em></p>' +
							'<p class="mui-ellipsis h2Font">用途：' + dataStr.supportedServices + '</p>' +
							'</div>'
						var $itemlist = $(li);
						document.getElementById(obj).appendChild(li);
						if(dataStr.resourceType=="1"){
							proSigInfo(dataStr.professorId,$itemlist)
						}else if(dataStr.resourceType=="2"){
							orgSigInfo(dataStr.orgId,$itemlist)
						}
					}
				});
			},
			detailArt=function (arr,obj) {
				oAjax("/ajax/article/qm",{
					id:arr,
				},"get",function(data){
					var dataStr=data.data;
					for(var i = 0; i < dataStr.length; i++) {
						var dataItem=dataStr[i]
						var arImg = "../images/default-artical.jpg";
						if(dataItem.articleImg) {
							arImg =baseUrl+"/data/article/" + dataItem.articleImg
						}
						var li = document.createElement("li");
						li.setAttribute("data-id", dataItem.articleId);
						li.setAttribute("data-flag", 3);
						li.className = "mui-table-view-cell flexCenter OflexCenter";
						li.innerHTML = 
							'<div class="madiaHead artHead" style="background-image:url(' + arImg + ')"></div>' +
							'<div class="madiaInfo OmadiaInfo">' +
							'<p class="mui-ellipsis-2 h1Font">' + dataItem.articleTitle + '</p>' +
							'<p><span class="h2Font ownerName" style="margin-right:10px"></span><span class="time">'+commenTime(dataItem.publishTime)+'</span></p>'+
							'</div>'
						var $itemlist = $(li);
						document.getElementById(obj).appendChild(li);
						if(dataItem.articleType=="1"){
							proSigInfo(dataItem.ownerId,$itemlist)
						}else if(dataItem.articleType=="2"){
							orgSigInfo(dataItem.ownerId,$itemlist)
						}else if(dataItem.articleType=="3"){
							platSigInfo(dataItem.ownerId,$itemlist)
						}
					}
				});
			},
			detailDemand=function(arr,obj) {
				oAjax("/ajax/demand/qm",{
					id:arr,
				},"get",function(data){
					var $data=data.data;
					for(var i = 0; i < $data.length; i++) {
						var li = document.createElement("li");
						li.setAttribute("data-id",$data[i].id);
						li.className = "mui-table-view-cell flexCenter OflexCenter";
						var strCon='';
						strCon+='<div class="madiaInfo">'
						strCon+='<p class="h1Font mui-ellipsis-2">'+ $data[i].title +'</p>'
						strCon+='<div class="showli mui-ellipsis">'
						
						if($data[i].city){ strCon+='<span>'+$data[i].city+'</span>' }
						if($data[i].duration!=0){ strCon+='<span>预期 '+demandDuration[$data[i].duration]+'</span>' }
						if($data[i].cost!=0){ strCon+='<span>预算 '+demandCost[$data[i].cost]+'</span>' }
						if($data[i].invalidDay){ strCon+='<span>有效期至 '+TimeTr($data[i].invalidDay)+'</span>' }
						
						strCon+='</div></div>'
						
						li.innerHTML = strCon
						document.getElementById(obj).appendChild(li);
					}
					
				});
			}
			detailService=function(arr,obj) {
				oAjax("/ajax/ware/qm",{
					id:arr,
				},"get",function(data){
					console.log(data)
					var dataItem=data.data;
					for(var i = 0; i < dataItem.length; i++) {
						var dataStr=dataItem[i]
						var cnt="", rImg = "../images/default-service.jpg";
						if(dataStr.images) {
							var subs = strToAry(dataStr.images)
							if(subs.length > 0) {
								rImg=baseUrl+"/data/ware" + subs[0]
							}
						}
						if(dataStr.cnt){
							cnt="内容："+dataStr.cnt
						}
						var li = document.createElement("li");
						li.setAttribute("data-id", dataStr.resourceId);
						li.setAttribute("data-flag", 2);
						li.className = "mui-table-view-cell flexCenter OflexCenter";
						li.innerHTML =
							' <div class="madiaHead resouseHead" style="background-image:url(' + rImg + ')"></div>' +
							'<div class="madiaInfo OmadiaInfo">' +
							'<p class="mui-ellipsis h1Font">' + dataStr.name + '</p>' +
							'<p><span class="h2Font ownerName"></span><em class="authicon ownerSty"></em></p>' +
							'<p class="mui-ellipsis h2Font">'+ cnt+'</p>' +
							'</div>'
						var $itemlist = $(li);
						document.getElementById(obj).appendChild(li);
						if(dataStr.category=="1"){
							proSigInfo(dataStr.owner,$itemlist)
						}else if(dataStr.category=="2"){
							orgSigInfo(dataStr.owner,$itemlist)
						}
						
					}
				});
			},
			proSigInfo=function(id,$list){
				oAjax("/ajax/professor/baseInfo/"+id,{
				}, "get", function(data){
					var userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
					$list.find(".ownerName").html(data.data.name)
					$list.find(".ownerSty").addClass(userType.sty)
				});
			},
			orgSigInfo=function(id,$list){
				oAjax("/ajax/org/" + id,{
				}, "get", function(data){
					var name=data.data.name;
					if(data.data.forShort){
						name=data.data.forShort
					}
					$list.find(".ownerName").html(name)
					if(data.data.authStatus == 3){
						$list.find(".ownerSty").addClass("authicon-com-ok")
					}
				});
			},
			platSigInfo=function(id,$list){
				oAjax("/ajax/platform/info",{
					id:id
				}, "get", function(data){
					var name=data.data.name;
					$list.find(".ownerName").html(name)
				});
			},
			tabToFun=function($this){
				var htm=$this.getAttribute("href")
				var type=$this.getAttribute("rel");
				var obj = document.querySelectorAll(".mui-scroll .mui-control-item")
				var cuIndex=0
				for (var i = 0; i<obj.length; i++) {
					if (obj[i] == $this) { 
						cuIndex = i; 
					} 
				} 
				mui.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function ($_index, pullRefreshEl) {
	                var freshId = pullRefreshEl.getAttribute("data-pullToRefresh");
	                if(freshId) {
	                    pullRefreshEl.removeAttribute("data-pullToRefresh");
	                }
	            });
				watchO={
					watchTime:"",
					watchObjId:"",
				};
				$(htm).find("ul.mui-table-view").html("")
				collectSorts(cuIndex,type)
			},
			bindClickFun=function(){
				//左滑及右滑
				document.querySelector('#slider').addEventListener('slide', function(event) {
					var $this = document.querySelector(".mui-scroll .mui-active")
					tabToFun($this)
				});
				//点击
				document.querySelector('#slider').addEventListener('tap', function(event) {
					var $this = document.querySelector(".mui-scroll .mui-active")
					tabToFun($this)
				});
				
				mui("#likeUser").on("tap", "li", function() {
					var id = this.getAttribute("data-id");
					plus.nativeUI.showWaiting(); //显示原生等待框
					plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
						proid: id
					});
				})
				mui("#likeSer").on("tap", "li", function() {
					var serviceId = this.getAttribute("data-id");
					plus.nativeUI.showWaiting();
					plus.webview.create("../html/serviceShow.html", 'serviceShow.html', {}, {
						serviceId: serviceId
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
					plus.nativeUI.showWaiting();
					plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
						articleId: id
					});
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
				mui("#likeDemand").on("tap", "li", function() {
					var id = this.getAttribute("data-id");
					plus.nativeUI.showWaiting();
					plus.webview.create("../html/needShow.html", 'needShow.html', {}, {
						"demanid": id
					});
				})
			}
		collectSorts(0,1)
		bindClickFun()
	})
});