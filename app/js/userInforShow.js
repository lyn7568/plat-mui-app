mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var self = plus.webview.currentWebview();
	var ozixun = document.getElementById("consultBtn");
	var proId = self.proid;
	var title="";
	if(userid == proId) {
		document.getElementsByClassName('footbox')[0].style.display = "none";
	}else{
		pageViewLog(proId,1)
	}
	var induSubjectShow = function(obj) {
		if(obj.data != undefined && obj.data.length != 0) {
			var subs = new Array();
			if(obj.data.indexOf(',')) {
				subs = obj.data.split(',');
			} else {
				subs[0] = obj.data;
			}
			if(subs.length > 0) {
				var html = [];
				for(var i = 0; i < subs.length; i++) {
					html.push("<li>" + subs[i] + "</li>");
				};
				document.getElementById(obj.selector).innerHTML = html.join('');
			}
		}
	}
	var resear = "";
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
				if(userid != proId) {
					if(isAgree) {
						var showDiv = "<div class='listbox'><div class='listbrowse mui-ellipsis' dataCaption=" + $data.caption + "><span class='like'>" + $data.count + "</span>" + $data.caption + "</div><span class=' mui-icon iconfont plusbtn  icon-appreciate' data-pid='" + $data.professorId + "' data-caption='" + $data.caption + "' data-isagree='" + isAgree + "' ></span><div class='likenum'dataCaption=" + $data.caption + ">";
					} else {
						var showDiv = "<div class='listbox'><div class='listbrowse mui-ellipsis' dataCaption=" + $data.caption + "><span class='like'>" + $data.count + "</span>" + $data.caption + "</div><span class=' mui-icon iconfont plusbtn icon-appreciatefill' data-pid='" + $data.professorId + "' data-caption='" + $data.caption + "' data-isagree='" + isAgree + "' ></span><div class='likenum'dataCaption=" + $data.caption + ">";
					}
				} else {
					var showDiv = "<div class='listbox'><div class='listbrowse mui-ellipsis'dataCaption=" + $data.caption + "><span class='like'>" + $data.count + "</span>" + $data.caption + "</div><div class='likenum' dataCaption=" + $data.caption + ">"
				}
				if($photos.length < 4) {
					for(var j = 0; j < $photos.length; ++j) {
						if($photos[j].img) {
							showDiv += "<span class='likepeople userRadius'><img class='like-h' src='" + baseUrl + "/images/head/" + $photos[j].id + "_m.jpg'></span>";
						} else {
							showDiv += "<span class='likepeople userRadius'><img class='like-h' src='../images/default-photo.jpg'></span>";
						}
					}
				} else {
					for(var j = $photos.length - 2; j < $photos.length; ++j) {
						if($photos[j].img) {
							showDiv += "<span class='likepeople userRadius'><img class='like-h' src='" + baseUrl + "/images/head/" + $photos[j].id + "_m.jpg'></span>";
						} else {
							showDiv += "<span class='likepeople userRadius'><img class='like-h' src='../images/default-photo.jpg'></span>";
						}
					}
					showDiv += "<span class='mui-icon iconfont icon-more likepeople likemore userRadius'></span>";
				}
				showDiv += "</div></div></div>";
				html.push(showDiv);
				resear += (i + 1) + "." + $data.caption + " ";
			}
			document.getElementsByClassName("reserachMess")[0].innerHTML = html.join('')
		}
	}
	var authName = "";
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
				document.getElementById("professorName").innerHTML = $data.name;
				document.getElementById("professor").innerHTML = $data.name;
				authName = $data.name;
				//基本信息
				if($data.descp) {
					document.getElementById("descp").innerHTML = $data.descp;
				} else {
					document.getElementById("descp").parentNode.style.display = "none";
					document.getElementById("detailProfessor").style.borderBottomColor="transparent";
				}
				if($data.hasHeadImage) {
					document.getElementsByClassName("headimg")[0].src = baseUrl + "/images/head/" + $data.id + "_l.jpg";
				}
				var oSty = autho($data.authType, $data.orgAuth, $data.authStatus);
				document.getElementById("nameLi").classList.add(oSty.sty);
				var arr = new Array();
				if($data.title) {
					arr.push($data.title);
					title = $data.title;
				} else {
					if($data.office) {
						arr.push($data.office);
					}
				}

				if($data.department) {
					arr.push($data.department);
				}
				
				if(arr.length) {
					document.getElementById("tMess").innerHTML = arr.join("，")
				}
				if($data.orgName) {
					document.getElementById("tMess2").innerHTML = $data.orgName;
				}

				if($data.address) {
					document.getElementById("address").innerHTML = '<em class="mui-icon iconfontnew icon-address"></em> ' + $data.address;
				}

				//学术领域
				if($data.subject) {
					induSubjectShow({
						data: $data.subject,
						selector: "subjectlist"
					});
				} else {
					document.getElementById("professorInfosubject").style.display = "none";
				}
				//研究方向
				if($data.researchAreas.length) {

					researchAreaShow($data.researchAreas, $data.editResearchAreaLogs);
				} else {
					document.getElementById("professorReserachMess").style.display = "none";
				} 
				//应用行业
				if($data.industry) {
					induSubjectShow({
						data: $data.industry,
						selector: "industry1"
					});
				} else {
					document.getElementById("professorinfoapply").style.display = "none";
				}
				return;
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
	
	var rows = 1
	var oAjax = function(url, dataS, otype, oFun) {
			mui.ajax(baseUrl+url,{
				dataType: 'json',
				type: otype,
				data: dataS,
				traditional: true,
				success: function(res) {
					if(res.success) {
						oFun(res)
					}
				}
			});
		},	
		demandListVal=function() {
			var aimId="demandShow"
			oAjax("/ajax/demand/pq",{
				"state":'1',
				"uid":proId,
				"pageSize":5
			}, "get", function(res){
				console.log(JSON.stringify(res));
				var obj = res.data.data;
				if(obj.length > 0) {
					document.getElementById(aimId).parentNode.parentNode.classList.remove("displayNone");
					for(var i = 0; i < obj.length; i++) {
						var li = document.createElement("li");
						li.setAttribute("data-id",obj[i].id);
						var needDate=obj[i].invalidDay;
						var lastDate=TimeTr(needDate);
						li.className = "mui-table-view-cell";
						var oString = '<div class="madiaInfo">'
							oString += '<p class="h1Font mui-ellipsis-2">'+obj[i].title+'</p>';
							oString += '<p class="h2Font mui-ellipsis-5">'+obj[i].descp+'</p>'
							oString += '<div class="showli mui-ellipsis h3Font">'
							oString += '<span>'+obj[i].province+'</span>'
							if(obj[i].duration!=0){oString += '<span>预期 '+demandDuration[obj[i].duration]+'</span>'}
							if(obj[i].cost!=0){oString += '<span>预算 '+demandCost[obj[i].cost]+'</span>'}
							oString += '<span>有效期至'+lastDate+' </span>'
						    oString += '</div>'
							oString += '</div>'
						li.innerHTML=oString
						document.getElementById(aimId).appendChild(li);
					}
				}
			})
		},
        articalListVal=function(){
			var aimId="articelShow"
			oAjax("/ajax/article/publish",{
				"category": "1",
				"owner":proId,
				"rows": rows
			}, "get", function(res){
				var obj = res.data;
				if(obj.length > 0) {
					document.getElementById(aimId).parentNode.parentNode.classList.remove("displayNone");
			
					for(var i = 0; i < obj.length; i++) {
						var hasImg="../images/default-artical.jpg"
						if(obj[i].articleImg) {
							hasImg=baseUrl+"/data/article/" + obj[i].articleImg
						}
						var li = document.createElement("li");
						li.setAttribute("data-id", obj[i].articleId);
						li.className = "mui-table-view-cell";
						li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
							'<div class="madiaHead resouseHead" style="background-image:url(' + hasImg + ')"></div>' +
							'<div class="madiaInfo OmadiaInfo">' +
							'<p class="mui-ellipsis-2 h1Font">' + obj[i].articleTitle + '</p>' +
							'<p class="h2Font mui-ellipsis"><span class="time">'+commenTime(obj[i].publishTime)+'</span></p>'+
							'</div>' +
							'</div>'
						document.getElementById(aimId).appendChild(li);
					}
				}
			})
		},
		resourceListVal=function(){
			var aimId="resourceShow"
			oAjax("/ajax/resource/publish",{
				"category": "1",
				"owner":proId,
				"rows": rows
			}, "get", function(res){
				var obj = res.data;
				if(obj.length > 0) {
					document.getElementById(aimId).parentNode.parentNode.classList.remove("displayNone");
					for(var i = 0; i < obj.length; i++) {
						var cnt="", hasImg="../images/default-resource.jpg"
						if(obj[i].images.length) {
							hasImg= baseUrl + '/data/resource/' + obj[i].images[0].imageSrc 
						}
						if(obj[i].supportedServices){
							cnt="用途："+ obj[i].supportedServices
						}
						var li = document.createElement("li");
						li.setAttribute("data-id", obj[i].resourceId);
						li.className = "mui-table-view-cell";
						li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
							'<div class="madiaHead resouseHead" style="background-image:url(' + hasImg + ')"></div>' +
							'<div class="madiaInfo OmadiaInfo">' +
							'<p class="mui-ellipsis-2 h1Font">' + obj[i].resourceName + '</p>' +
							'<p class="mui-ellipsis h2Font">' + cnt+ '</p>' +
							'</div>' +
							'</div>'
						document.getElementById(aimId).appendChild(li);
					}
				}
			})
		},
		serviceListVal=function(){
			var aimId="serviceShow"
			oAjax("/ajax/ware/publish",{
				"category":"1",
				"owner":proId,
				"rows": rows
			}, "get", function(res){
				var obj = res.data;
				if(obj.length > 0) {
					document.getElementById(aimId).parentNode.parentNode.classList.remove("displayNone");
					for(var i = 0; i < obj.length; i++) {
						var cnt="", hasImg="../images/default-service.jpg"
						if(obj[i].images) {
							var subs = strToAry(obj[i].images)
							if(subs.length > 0) {
								hasImg=baseUrl+"/data/ware" + subs[0]
							}
						}
						if(obj[i].cnt){
							cnt="内容："+obj[i].cnt
						}
						var li = document.createElement("li");
						li.setAttribute("data-id", obj[i].id);
						li.className = "mui-table-view-cell";
						li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
							'<div class="madiaHead resouseHead" style="background-image:url(' + hasImg + ')"></div>' +
							'<div class="madiaInfo OmadiaInfo">' +
							'<p class="mui-ellipsis-2 h1Font">' + obj[i].name + '</p>' +
							'<p class="mui-ellipsis h2Font">' + cnt+ '</p>' +
							'</div>' +
							'</div>'
						document.getElementById(aimId).appendChild(li);
					}
				}
			})
		},
		patentListVal=function(){
			var aimId="patent"
			oAjax("/ajax/ppatent/professor",{
				"owner":proId,
				"rows": rows
			}, "get", function(res){
				var obj = res.data;
				if(obj.length > 0) {
					document.getElementById(aimId).parentNode.parentNode.classList.remove("displayNone");
					for(var i = 0; i < obj.length; i++) {
						var li = document.createElement("li");
						li.setAttribute("data-id", obj[i].id);
						li.className = "mui-table-view-cell";
						li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
							'<div class="madiaHead patentHead"></div>' +
							'<div class="madiaInfo OmadiaInfo">' +
							'<p class="mui-ellipsis-2 h1Font">' + obj[i].name + '</p>' +
							'<p class="mui-ellipsis h2Font">' + obj[i].authors.substring(0, obj[i].authors.length - 1) + '</p>' +
							'</div>' +
							'</div>'
						document.getElementById(aimId).appendChild(li);
					}
				}
			})
		},
		paperListVal=function(){
			var aimId="paper"
			oAjax("/ajax/ppaper/professor",{
				"owner":proId,
				"rows": rows
			}, "get", function(res){
				var obj = res.data;
				if(obj.length > 0) {
					document.getElementById(aimId).parentNode.parentNode.classList.remove("displayNone");
					for(var i = 0; i < obj.length; i++) {
						var li = document.createElement("li");
							li.setAttribute("data-id", obj[i].id);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead paperHead"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis-2 h1Font">' + obj[i].name + '</p>' +
								'<p class="mui-ellipsis h2Font">' + obj[i].authors.substring(0, obj[i].authors.length - 1) + '</p>' +
								'</div>' +
								'</div>'
						document.getElementById(aimId).appendChild(li);
					}
				}
				
			})
		},
		answerListVal=function(){
        	var aimId="QAShow"
			oAjax("/ajax/question/answer/bySelf",{
                "uid":proId,
                "rows":rows
			}, "get", function(res){
				var obj = res.data;
				if(obj.length > 0) {
					document.getElementById(aimId).parentNode.parentNode.classList.remove("displayNone");
					for(var i = 0; i < obj.length; i++) {
						var hd = "";
		                if (obj[i].agree > 0) {
		                    hd = '<span>赞 ' + obj[i].agree + '</span>'
		                }
						var li = document.createElement("li");
							li.setAttribute("data-id", obj[i].id);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="madiaInfo">' +
			                    '<p class="h1Font mui-ellipsis-2 qa-question"></p>' +
			                    '<div class="flexCenter qa-owner"></div>' +
			                    '<div class="qa-con mui-ellipsis-5">' + listConCut(obj[i].cnt) + '</div>' +
			                    '<div class="showliSpan mui-ellipsis">' +
			                    '<span>' + commenTime(obj[i].createTime) + '</span>' + hd +'<span class="leaveMsgCount"></span>'+
			                    '</div>' +
			                    '</div>'
						document.getElementById(aimId).appendChild(li);
						var $str = $(li);
		                questioninfo(obj[i].qid, $str);
		                proinfo(obj[i].uid, $str);
						leaveMsgCount(obj[i].id, $str);
					}
				}
			})
    	},
    	proinfo=function(pid, $str) {
			oAjax("/ajax/professor/baseInfo/" + pid,{}, "get", function(data){
                var dataStr = data.data
                var baImg = "../images/default-photo.jpg";
                if (dataStr.hasHeadImage == 1) {
                    baImg = baseUrl+"/images/head/" + dataStr.id + "_l.jpg";
                }
                var userType = autho(dataStr.authType, dataStr.orgAuth, dataStr.authStatus);
                var os = "";
                if (dataStr.title) {
                    if (dataStr.orgName) {
                        os = dataStr.title + "，" + dataStr.orgName;
                    } else {
                        os = dataStr.title;
                    }
                } else {
                    if (dataStr.office) {
                        if (dataStr.orgName) {
                            os = dataStr.office + "，" + dataStr.orgName;
                        } else {
                            os = dataStr.office;
                        }
                    } else {
                        if (dataStr.orgName) {
                            os = dataStr.orgName;
                        }
                    }
                }
                var styStr='<em class="authicon ' + userType.sty + '" title="' + userType.title + '"></em>'
				if(userType.sty=="e"){
					styStr=""
				}
				var str = '<div class="owner-head useHead" style="background-image:url(' + baImg + ')"></div>' +
					'<div class="owner-info">' +
					'<div class="owner-name"><span class="h1Font">' + dataStr.name + '</span>'+styStr+'</div>' +
					'<div class="owner-tit mui-ellipsis h2Font" style="margin-top:0;">' + os + '</div>' +
					'</div>'

                $str.find(".qa-owner").html(str)
	        });
	    },
	    questioninfo=function(qid, $str) {
	        oAjax("/ajax/question/qo",{
	        	id:qid
	        }, "get", function(data){
                $str.find(".qa-question").html(data.data.title);
                if(data.data.pageViews>0){
                    $str.find(".qaPageview").html("阅读量 "+data.data.pageViews);
                }else{
                    $str.find(".qaPageview").hide()
                }
	        });
	    },
	    leaveMsgCount=function(id, $str) {
			oAjax("/ajax/leavemsg/count", {
				sid:id,
				stype: "4"
			}, "get", function(data) {
				if(data.success) {
					if(data.data > 0) {
						$str.find(".leaveMsgCount").html("留言 " + data.data);
					}
				}
			})
		},
		queryPubCount=function(){
			oAjax("/ajax/article/count/publish",{//文章总数
				"owner": proId,
				"category":"1"
			}, "GET", function(data){
				if(data.data>rows){
					$("#seeMoreArtical").removeClass("displayNone")
					$("#articalNum").text(data.data);
				}
			});
			oAjax("/ajax/resource/count/publish",{//资源总数
				"owner": proId,
				"category":"1"
			}, "GET", function(data){
				if(data.data>rows){
					$("#seeMoreResource").removeClass("displayNone")
					$("#resourceNum").text(data.data);
				}
			});
			oAjax("/ajax/ware/count/publish",{//服务总数
				"owner": proId,
				"category":"1"
			}, "GET", function(data){
				if(data.data>rows){
					$("#seeMoreService").removeClass("displayNone")
					$("#serviceNum").text(data.data);
				}
			});
			oAjax("/ajax/ppatent/count/publish",{//专利总数
				"owner": proId,
			}, "GET", function(data){
				if(data.data>rows){
					$("#seeMorePatent").removeClass("displayNone")
					$("#patentNum").text(data.data);
				}
			});
			oAjax("/ajax/ppaper/count/publish",{//论文总数
				"owner": proId,
			}, "GET", function(data){
				if(data.data>rows){
					$("#seeMorePaper").removeClass("displayNone")
					$("#paperNum").text(data.data);
				}
			});
			oAjax("/ajax/question/answer/bySelf/count",{//回答总数
				"uid": proId,
			}, "GET", function(data){
				if(data.data>rows){
					$("#seeMoreQA").removeClass("displayNone")
					$("#QANum").text(data.data);
				}
			});
		},
		bindClickFun=function(){
			/*进入个人简介页面*/
			document.getElementById("detailProfessor").addEventListener("tap", function() {
				plus.nativeUI.showWaiting(); //显示原生等待框
				var webviewShow = plus.webview.create("../html/userInforShow-more.html", 'userInforShow-more.html', {}, {
					pId: proId
				})
			})
			
			var clFlag = 1;//点赞
			mui(".reserachMess").on("click", ".plusbtn", function() {
				if(userid && userid != null && userid != "null") {
					if(clFlag) {
						clFlag = 0;
					} else {
						return;
					}
					if(this.getAttribute("data-isagree") > -1) {
						this.classList.remove("icon-appreciatefill");
						this.classList.add("icon-appreciate");
					} else {
						this.classList.add("icon-appreciatefill");
						//this.classlist.remove("plusbtn");
					}
		
					mui.ajax(this.getAttribute("data-isagree") > -1 ? baseUrl + "/ajax/researchArea/unAgree" : baseUrl + "/ajax/researchArea/agree", {
						"type": "POST",
						"data": {
							"targetId": this.getAttribute("data-pid"),
							"targetCaption": this.getAttribute("data-caption"),
							"opId": userid,
							"uname":plus.storage.getItem('name')
						},
						"contentType": "application/x-www-form-urlencoded",
						"success": function($data) {
		
							if($data.success) {
								mui.ajax(baseUrl + "/ajax/professor/info/" + proId, {
									dataType: 'json', //数据格式类型
									type: 'GET', //http请求类型
									timeout: 10000, //超时设置
									success: function(data) {
										clFlag = 1;
										var $data = data.data;
										//研究方向
										document.getElementsByClassName("reserachMess")[0].innerHTML = "";
										if($data.researchAreas.length) {
		
											researchAreaShow($data.researchAreas, $data.editResearchAreaLogs);
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
				} else {
					isLogin();
				}
		
			})
			/*进入研究方向点赞页面*/
			mui("#professorReserachMess").on('tap', '.listbrowse,.likenum', function() {
				var dataCap = this.getAttribute("dataCaption");
				plus.nativeUI.showWaiting();
				plus.webview.close("researchAreaHead.html");
				setTimeout(function() {
					plus.webview.create("../html/researchAreaHead.html", 'researchAreaHead.html', {}, {
						dataCaption: dataCap,
						professorId: proId
					});
				}, 500);
			});
		
			ozixun.addEventListener('tap', function() {
				isLogin();
			});
			var oifAttend=document.getElementById("ifAttend")
			ifcollectionAbout(proId,oifAttend,1);
			document.getElementById('ifAttend').addEventListener("tap", function() {
				if(!userid) {
					mui.openWindow({
						url: '../html/login.html',
						id: '../html/login.html',
						show: {
							aniShow: "slide-in-right"
						},
						extras:{
							ourl:self.id
						}
					});
					return;
				}
				if(this.className == "mui-icon iconfontnew icon-yishoucang") {
					cancelCollectionAbout(proId,this, 1);
				} else {
					collectionAbout(proId,this,1);
				}
		
			})
			mui("#resourceShow").on("tap", "li", function() {
				var resouId = this.getAttribute("data-id");
				plus.nativeUI.showWaiting();
				plus.webview.create("../html/resourceShow.html", 'resourceShow.html', {}, {
					resourceId: resouId
				});
			})
			mui("#serviceShow").on("tap", "li", function() {
				var serviceId = this.getAttribute("data-id");
				plus.nativeUI.showWaiting();
				plus.webview.create("../html/serviceShow.html", 'serviceShow.html', {}, {
					serviceId: serviceId
				});
			})
			mui("#articelShow").on("tap", "li", function() {
				var id = this.getAttribute("data-id");
				var ownerid = this.getAttribute("owner-id");
				plus.nativeUI.showWaiting();
				plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
					articleId: id,
					ownerid: ownerid,
				});
			})
			mui("#paper").on("tap", "li", function() {
				var id = this.getAttribute("data-id");
				plus.nativeUI.showWaiting();
				plus.webview.create("../html/paperShow.html", 'paperShow.html', {}, {
					"paperId": id
				});
			})
			mui("#patent").on("tap", "li", function() {
				var id = this.getAttribute("data-id");
				plus.nativeUI.showWaiting();
				plus.webview.create("../html/patentShow.html", 'patentShow.html', {}, {
					"patentId": id
				});
			})
			mui("#relatePro,#likePro").on("tap", "li", function() {
				var id = this.getAttribute("data-id");
				plus.nativeUI.showWaiting();
				var webviewShow1=plus.webview.create("userInforShow.html", 'userInforShow.html', {}, {
					"proid": id,
				});
//				webviewShow1.addEventListener("loaded", function() {
//					setTimeout(function(){plus.webview.currentWebview().close()},1000)
//				}, false);
			})
			mui("#relateArt").on("tap", "li", function() {
				var id = this.getAttribute("data-id");
				plus.nativeUI.showWaiting();
				plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
					articleId: id
				});
			})
			mui("#demandShow").on("tap","li",function(){
				var dId=this.getAttribute("data-id");
				plus.nativeUI.showWaiting();
				plus.webview.create("../html/needShow.html", 'needShow.html', {}, {
					demanid: dId
				});
			})
			mui("#QAShow").on("tap","li",function(){
				var AId=this.getAttribute("data-id");
				plus.nativeUI.showWaiting();
				plus.webview.create("../html/qa-answer-show.html", 'qa-answer-show.html', {}, {
					"anid":AId
				});
			})
			
			document.getElementById("seeMoreResource").addEventListener("tap", function() {
				plus.nativeUI.showWaiting();
				var webviewShow = plus.webview.create("../html/userresourceList.html", 'userresourceList.html', {}, {
					proid: proId
				})
			})
			document.getElementById("seeMorePatent").addEventListener("tap", function() {
				plus.nativeUI.showWaiting();
				var webviewShow = plus.webview.create("../html/userpatentList.html", 'userpatentList.html', {}, {
					proid: proId,
					authName: authName
				})
			})
			document.getElementById("seeMorePaper").addEventListener("tap", function() {
				plus.nativeUI.showWaiting();
				var webviewShow = plus.webview.create("../html/userpaperList.html", 'userpaperList.html', {}, {
					proid: proId,
					authName: authName
				})
			})
			document.getElementById("seeMoreArtical").addEventListener("tap", function() {
				plus.nativeUI.showWaiting();
				var webviewShow = plus.webview.create("../html/useraiticleList.html", 'useraiticleList.html', {}, {
					proid: proId
				})
			})
			document.getElementById("seeMoreService").addEventListener("tap", function() {
				plus.nativeUI.showWaiting(); 
				var webviewShow = plus.webview.create("../html/userserviceList.html", 'userserviceList.html', {}, {
					proid: proId
				})
			})
			document.getElementById("seeMoreQA").addEventListener("tap", function() {
				plus.nativeUI.showWaiting();
				var webviewShow = plus.webview.create("../html/userQAList.html", 'userQAList.html', {}, {
					proid: proId
				})
			})
			window.addEventListener("newId", function(event) {
				personalMessage();
				userid = plus.storage.getItem('userid')
				if(userid == proId) {
					document.getElementsByClassName('footbox')[0].style.display = "none";
				}
				ifcollectionAbout(proId, '1');
			});
	
		}
	
	personalMessage();
	demandListVal()
	serviceListVal()
	resourceListVal()
	articalListVal()
	patentListVal()
	paperListVal()
	answerListVal()
	relevantExperts();//合作专家
	relevantarticalList();//相关文章
	likeExperts();//感兴趣专家
	bindClickFun()
	queryPubCount();
	
	//合作专家
	function relevantExperts(){
		mui.ajax(baseUrl + "/ajax/professor/coadjutant", {
			"type": "get",
			"dataType" : "json",
			"data" :{"id":proId},
			"success": function(data) {
				if(data.success && data.data) {
					var lengthT;
					if(data.data.length>5){
						lengthT=5;
					}else{
						lengthT=data.data.length
					}
					for(var i = 0; i < lengthT; i++) {
						var ExpId = data.data[i].professorId;
						var paperN=data.data[i].paperCount;
						var patentN=data.data[i].patentCount;
						var liItem=document.createElement("li");
						liItem.className="mui-table-view-cell flexCenter";
						document.getElementById("relatePro").appendChild(liItem);
						relExpertsList(ExpId,paperN,patentN,liItem);
					}
					
				}
			}
		});
	}
	function relExpertsList(Id,numL,numZ,liItem){
		mui.ajax(baseUrl + "/ajax/professor/info/"+Id, {
			"type" :  "GET" ,
			"dataType" : "json",
			"success" : function(data) {
				if (data.success && data.data!=""){
					document.getElementById("relatePro").parentNode.parentNode.classList.remove("displayNone");
					var thisTit,thisImg,copNum=""
					if(data.data.hasHeadImage == 1) {
						thisImg=baseUrl+"/images/head/" + data.data.id + "_l.jpg);"
					}else{
						thisImg="../images/default-photo.jpg);"
					}
					if(numL){
						if(numZ){
							copNum="合作："+numZ+"项专利，"+numL+"篇论文"
						}else{
							copNum="合作："+numL+"篇论文"
						}
					}else{
						if(numZ){
							copNum="合作："+numZ+"项专利"
						}else{
							
						}
					}
					
					if(data.data.title) {
						if(data.data.orgName) {
							thisTit=data.data.title +"，"+ data.data.orgName;
						}else{
							thisTit=data.data.title;
						}
					}else{
						if(data.data.office) {
							if(data.data.orgName) {
								thisTit=data.data.office +"，"+ data.data.orgName;
							}else{
								thisTit=data.data.office;
							}
						}else{
							if(data.data.orgName) {
								thisTit=data.data.orgName;
							}
						}
					}
					var userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
					var itemlist = '<div class="madiaHead useHead" style="background-image:url('+thisImg+')"></div>';
						itemlist += '<div class="madiaInfo">';
						itemlist += '<p><span class="h1Font" id="userName">'+data.data.name+'</span><em class="authicon '+userType.sty+'" title="'+userType.title+'"></em></p>';
						itemlist += '<p class="mui-ellipsis h2Font">'+thisTit+'</p>';
						itemlist += '<p class="h2Font mui-ellipsis">'+copNum+'</p>';
						itemlist += '</div>';
					liItem.innerHTML = itemlist
					liItem.setAttribute("data-id",data.data.id)
				}
			}
		});
	}
	//相关文章信息
	function relevantarticalList(){
		mui.ajax(baseUrl + "/ajax/article/byAssProfessor", {
			"type" :  "GET" ,
			"dataType" : "json",
			"data" :{"id":proId},
			"async":"false",
			"traditional": true, //传数组必须加这个
			"success" : function(data) {
				if (data.success && data.data!=""){
					document.getElementById("relateArt").parentNode.parentNode.classList.remove("displayNone");
					document.getElementById("relateArt").innerHTML="";
					var StrData = data.data
					var lengthT;
					if(data.data.length>5){
						lengthT=5;
					}else{
						lengthT=data.data.length
					}
					for(var i = 0; i < lengthT; i++) {
						(function(n) {
							var imgL="../images/default-artical.jpg";
							if(StrData[i].articleImg){
								imgL=baseUrl+'/data/article/' + StrData[i].articleImg 
							}
							var oURL,oData='';
							if(StrData[i].articleType=='1') {
								oURL="/ajax/professor/baseInfo/"+StrData[i].ownerId;
							}else if(StrData[i].articleType=='2'){
								oURL="/ajax/org/" + StrData[i].ownerId;
							}else if(StrData[i].articleType=='3'){
								oURL="/ajax/platform/info";
								oData={
									id: StrData[i].ownerId 
								}
							}
							mui.ajax(baseUrl + oURL, {
								"type": "GET",
								"data": oData,
								'dataType': "json",
								"success": function(data) {
									if(data.success) {
										var thisName,userType,thisAuth,thisTitle
										if(data.data.forShort){
											thisName=data.data.forShort;
										}else{
											thisName=data.data.name;
										}
										var add = document.createElement("li");
										add.className = "mui-table-view-cell"; 
										add.setAttribute("data-id",StrData[n].articleId);
										add.setAttribute("owner-id", StrData[n].professorId);
										var itemlist = '<div class="flexCenter OflexCenter"><div class="madiaHead artHead" style="background-image:url('+imgL+')"></div>';
											itemlist += '<div class="madiaInfo OmadiaInfo">';
											itemlist += '<p class="mui-ellipsis-2 h1Font" id="usertitle">'+StrData[n].articleTitle+'</p>';
											itemlist += '<p><span class="h2Font" style="margin-right:10px">'+thisName+'</span><span class="time">'+commenTime(StrData[n].publishTime)+'</span></p>';
											itemlist += '</div></div>';
											
										add.innerHTML=itemlist;
										document.getElementById("relateArt").appendChild(add);
									}
								},
								error: function() {
									plus.nativeUI.toast("服务器链接超时", toastStyle);
									return;
								}
							});
						})(i);
					}
				}
			}
		});
	}
    //感兴趣
	function likeExperts(){
		mui.ajax(baseUrl + "/ajax/professor/ralateProfessors", {
			"type": "get",
			"dataType" : "json",
			"data" :{"professorId":proId},
			"success": function(data) {
				if(data.success && data.data) {
					var lengthT;
					if(data.data.length>5){
						lengthT=5;
					}else{
						lengthT=data.data.length
					}
					for(var i = 0; i < lengthT; i++) {
						var ExpId = data.data[i].id;
						likeExpertsList(ExpId);
					}
					
				}
			},
		});
	}
	function likeExpertsList(ExpId){//感兴趣专家
		mui.ajax(baseUrl + "/ajax/professor/info/"+ExpId, {
			"type" :  "GET" ,
			"dataType" : "json",
			"success" : function(data) {
				if (data.success && data.data!=""){
					document.getElementById("likePro").parentNode.parentNode.classList.remove("displayNone");	
					var add = document.createElement("li");
					add.setAttribute("data-id",data.data.id);
					add.className = "mui-table-view-cell flexCenter";
					add.style.minHeight="68px";
					var userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
					var imgL,otherI="";
					if(data.data.hasHeadImage == 1) {
						imgL=baseUrl+'/images/head/' + data.data.id + '_l.jpg';
					}else{
						imgL='../images/default-photo.jpg'
					}
					if(data.data.title) {
						if(data.data.orgName) {
							otherI=data.data.title +"，"+ data.data.orgName;
						}else{
							otherI=data.data.title;
						}
					}else{
						if(data.data.office) {
							if(data.data.orgName) {
								otherI=data.data.office +"，"+ data.data.orgName;
							}else{
								otherI=data.data.office;
							}
						}else{
							if(data.data.orgName) {
								otherI=data.data.orgName;
							}
						}
					}
					var itemlist = '<div class="madiaHead useHead" style="background-image:url('+imgL+')"></div>';
						itemlist += '<div class="madiaInfo">';
						itemlist += '<p class="mui-ellipsis"><span class="h1Font">'+data.data.name+'</span><em class="authicon '+userType.sty+'" title="'+userType.title+'"></em></p>';
						itemlist += '<p class="mui-ellipsis h2Font">'+otherI+'</p>';
						itemlist += '</div>';
					add.innerHTML=itemlist;
					document.getElementById("likePro").appendChild(add);
					
				}
			},
		});
	}

	function isLogin() {
		var userid = plus.storage.getItem('userid');

		if(userid && userid != null && userid != 'null' && userid != undefined && userid != 'undefined') {
			var wechat=plus.webview.getWebviewById('weChat.html');
			var jubao=plus.webview.getWebviewById('jubao.html');
			
			if(wechat) {
				wechat.close();
			}
			if(jubao) {
				jubao.close();
			}
			setTimeout(function() {
				mui.openWindow({
				url: '../html/weChat.html',
				id: 'weChat.html',
				show: {
					autoShow: true,
					aniShow: "slide-in-right",
				},
				extras: {
					professorId: proId,
					flag:1
				}
			})
			},100);
			

		} else {
			mui.openWindow({
				url: '../html/login.html',
				id: '../html/login.html',
				show: {
					aniShow: "slide-in-right"
				},
				extras:{
					ourl:self.id
				}
			});
		}
	}
	
	moreMes();
	function moreMes(){
		document.getElementById("BtnMore").addEventListener("tap",function(){
			var str;
			if(resear) {
				str = "研究方向：" + resear
			}
			plus.nativeUI.showWaiting(); //显示原生等待框
		var webviewShow = plus.webview.create("../html/moreItem.html", 'moreItem.html', {}, {
			proid: proId,
			name:"professor",
			data:{
					content: str,
					title: "【科袖名片】" + authName + " " + title + "",
					href: baseUrl + "/e/p.html?id=" + proId,
					thumbs: [baseUrl + "/images/head/" + proId + "_m.jpg"]
				},
			weiboData:{
					content:  "【科袖名片】" + authName + " " + title + ""+baseUrl + "/e/p.html?id=" + proId
				}
		})
		})
	}

	
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
		var str;
			if(resear) {
				str = "研究方向：" + resear
			}
		if(oFen == "微信好友") {
			if(!weixinClient()) {
					return;
				}
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneSession", {
					content: str,
					title: "【科袖名片】" + authName + " " + title + "",
					href: baseUrl + "/e/p.html?id=" + proId,
					thumbs: [baseUrl + "/images/head/" + proId + "_m.jpg"]
				});
			}
		} else if(oFen == "微信朋友圈") {
			if(!weixinClient()) {
					return;
				}
			var share = buildShareService("weixin");
			if(share) {
				shareMessage(share, "WXSceneSession", {
					content: str,
					title: "【科袖名片】" + authName + " " + title + "",
					href: baseUrl + "/e/p.html?id=" + proId,
					thumbs: [baseUrl + "/images/head/" + proId + "_m.jpg"]
				});
			}
		} else if(oFen == "新浪微博") {
			var share = buildShareService("sinaweibo");
			if(share) {
				shareMessage(share, "sinaweibo", {
					content:  "【科袖名片】" + authName + " " + title + ""+baseUrl + "/e/p.html?id=" + proId
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
					//alert("认证授权失败：" + e.code + " - " + e.message);
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
				shareAddIntegral(1);
			}

		}, function(e) {
			console.log(JSON.stringify(e))
			plus.nativeUI.closeWaiting();
			if(e.code == -2) {
				
			}
		});
	}
	
	mui.previewImage();/*图像预览*/
});