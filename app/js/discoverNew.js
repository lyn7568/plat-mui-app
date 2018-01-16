(function($) {
	//阻尼系数
	var arr = [];
	var key1 = [];
	var m = 0;
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	var colum = {
		"a": "", //最新文章
		"3": 3, //前沿动态
		"4": 7, //学术经验
		"5": 10,
		"6": 4, //检测分析
		"7": 5, //会议培训
		"8": 6, //科袖访谈
		"9": 8 //招聘招生
	}
	var pullObj = {
		"0": 0,
		"1": 0,
		"2": 0,
		"3": 0,
		"4": 0,
		"5": 0,
		"6": 0,
		"7": 0,
		"8": 0
	}
	var QAtime, QAid, QArows = 2,fTime,fId,fEx;
	$.ready(function() {
		$.plusReady(function() {
			var userid = plus.storage.getItem('userid');
			var userN =  plus.storage.getItem('name');
			/*登陆*/
			window.addEventListener('loginIn', function(event) {
				userid = event.detail.id;
				document.getElementsByClassName("unlogin")[0].classList.add("displayNone")
				document.getElementsByClassName("onlogin")[0].classList.remove("displayNone")
				userInfo();
				var web4 = plus.webview.getLaunchWebview();
				mui.fire(web4, "newId", {
					rd: 3
				});
			});
			window.addEventListener('exitOut', function(event) {
				userid = event.detail.id;
				document.getElementsByClassName("unlogin")[0].classList.remove("displayNone")
				document.getElementsByClassName("onlogin")[0].classList.add("displayNone")
				var web4 = plus.webview.getLaunchWebview();
				mui.fire(web4, "newId", {
					rd: 2
				});
			});
			if(userid && userid != null && userid != "null") {
				userInfo();
			}else{
				document.getElementsByClassName("unlogin")[0].classList.remove("displayNone")
				document.getElementsByClassName("onlogin")[0].classList.add("displayNone")
			}		
			var columnType = {
				"1": {
					fullName: "个人原创",
					shortName: "原创"
				},
				"2": {
					fullName: "企业原创",
					shortName: "原创"
				},
				"3": {
					fullName: "科研",
					shortName: "科研"
				},
				"4": {
					fullName: "智库",
					shortName: "智库"
				},
				"5": {
					fullName: "检测",
					shortName: "检测"
				},
				"6": {
					fullName: "会议",
					shortName: "会议"
				},
				"7": {
					fullName: "企业",
					shortName: "企业"
				},
				"8": {
					fullName: "招聘",
					shortName: "招聘"
				},

				"9": {
					fullName: "新闻",
					shortName: "新闻"
				},
				"10": {
					fullName: "问答",
					shortName: "问答"
				}
			}
			var oWidth = getViewportSize().width;

			function getViewportSize() {
				return {
					width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
					height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
				};
			}
			for(var n = 0; n < 7; n++) {
				document.getElementsByClassName("mui-control-item")[n].style.paddingLeft = (oWidth - 5.25 * 30) / 9 + "px";
				document.getElementsByClassName("mui-control-item")[n].style.paddingRight = (oWidth - 5.25 * 30) / 9 + "px";
			}

			function Discover(obj) {
				return new Discover.prototype.Init(obj);
			}
			Discover.prototype = {
				pageNo: {
					"a": 1,
					"1": 1,
					"2": 1,
					"3": 1,
					"4": 1,
					"5": 1,
					"6": 1,
					"7": 1,
					"8": 1,
				},
				colum: {
					"a": "", //最新文章
					"3": 3, //前沿动态
					"4": 7, //学术经验
					"5": 10,
					"6": 4, //检测分析
					"7": 5, //会议培训
					"8": 6, //科袖访谈
					"9": 8 //招聘招生
				},
				constructor: Discover,
				Init: function(obj) {
					if(obj) {
						this.ajax(obj)
					}
				},
				ajax: function(obj) {
					$.ajax(baseUrl + obj.url, {
						data: obj.data,
						dataType: 'json', //服务器返回json格式数据
						type: "get", //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						traditional: true,
						async: true,
						success: function(data) {
							console.log(JSON.stringify(data) + obj.url)
							if(obj.sele) {
								obj.fun.call(obj.sele, data);
							} else {
								obj.fun(data, obj.flag);
							}
						},
						error: function(xhr, type, errorThrown) {
							plus.nativeUI.toast("服务器链接超时", toastStyle);
						}
					});
				},
				bindEvent: function() {
					//循环初始化所有下拉刷新，上拉加载。
					var _this = this
					$.each(document.querySelectorAll('.mui-slider-group .mui-scroll'), function(index, pullRefreshEl) {
						key1[index] = $(pullRefreshEl).pullToRefresh({
							down: {
								callback: function() {
									console.log(new Date().getTime() + "a")
									var self = this;
									//self.refresh(true);
									setTimeout(function() {
										var ul = self.element.querySelector('.mui-table-view');
										ul.innerHTML = "";
										key1[m].endPullUpToRefresh(true);
										if(index == 0) {
											pullObj["0"] = 1;
											_this.pageNo.a = 1;
											_this.colum.a = "";
											$.ajax(baseUrl + "/data/inc/col_bannerApp.html?ttt=" + new Date().getTime(), {
												dataType: 'html', //服务器返回json格式数据
												type: "get", //HTTP请求类型
												timeout: 10000, //超时时间设置为10秒；
												traditional: true,
												async: true,
												success: function(data) {
													document.getElementById("slider1").parentNode.removeChild(document.getElementById("slider1"));
													var odiv = document.createElement("div");
													odiv.id = "slider1";
													odiv.className = "mui-slider columnImg";
													document.getElementById("dd").insertBefore(odiv, document.getElementById("list"))
													document.getElementById("slider1").innerHTML = data;
													arr = [];
													for(var i = 0; i < 5; i++) {
														arr.push(document.getElementById("slider1").getElementsByClassName("mui-slider-item")[i].getAttribute("data-id"));
													}
													var slider = $("#slider1");
													slider.slider({
														interval: 5000
													});
													$("#slider1").on("tap", "a", function() {
														plus.nativeUI.showWaiting();
														var id = this.parentNode.getAttribute("data-id");
														var col = this.parentNode.getAttribute("col-id");
														aiticl(id)
														addClick1(col);
													})
													$D({
														"fun": ob.createFragment,
														data: {
															col: 9,
															pageNo: 1
														},
														flag: 1,
														url: "/ajax/article/find"
													});
												}
											});

										} else {
											pullObj[index] = 1;
											_this.pageNo[index] = 1;

											_this.colum[index + 2] = index + 2;

											console.log(new Date().getTime() + "b");
											if(m == 3) {
												$D({
													"fun": _this.QA,
													data: {
														rows: QArows
													},
													url: "/ajax/question/answer/byTime"
												});
                                            } else if(m == 0) {
                                                $D({
                                                    "fun": _this.createFragment,
                                                    data: {
                                                        rows:QArows,
                                                        ex: fEx
                                                    },
                                                    url: "/ajax/found/index"
                                                });
                                            } else {
												$D({
													"fun": _this.createFragment,
													data: {
														col: index ? colum[m + 2] : _this.colum.a,
														pageNo: 1,
														exclude: arr,
													},
													url: "/ajax/article/find"
												});
											}
										}
									}, 1000);

									console.log(new Date().getTime() + "c")
								}

							},
							up: {
								callback: function() {
									var self = this;
									setTimeout(function() {
										var pa;
										if(index == 0) {
											pa = ++_this.pageNo.a;
											_this.colum.a = ""
										} else {
											pa = ++_this.pageNo[index];
										}
										//var ul = self.element.querySelector('.mui-table-view');
										if(m == 3) {
											$D({
												"fun": _this.QA,
												data: {
													time: QAtime,
													id: QAid,
													rows: QArows
												},
												url: "/ajax/question/answer/byTime"
											});
										} else if(m == 0) {
                                            $D({
                                                "fun": _this.createFragment,
                                                data: {
                                                    time:fTime,
													id:fId,
													rows:QArows,
                                                    ex: fEx
                                                },
                                                url: "/ajax/found/index"
                                            });
										} else {
											$D({
												"fun": _this.createFragment,
												data: {
													col: index ? colum[m + 2] : _this.colum.a,
													pageNo: pa,
													exclude: arr
												},
												url: "/ajax/article/find"
											});
										}
									}, 1000);
								}
							}
						});
					});

					mui("#slider").on("tap", "li", function() {
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
					mui("#questionItem").on("tap", "li", function() {
						var id = this.getAttribute("data-id");
						plus.nativeUI.showWaiting();
						plus.webview.create("../html/qa-answer-show.html", 'qa-answer-show.html', {}, {
							anid: id
						});
					})
					document.getElementsByClassName("unlogin")[0].addEventListener("tap", function() {
						mui.openWindow({
							url: '../html/login.html',
							id: 'login.html'
						})
					})
					document.getElementById("my-q&a").addEventListener("tap", function() {
						if(userid && userid != null && userid != "null") {
							plus.nativeUI.showWaiting();
							plus.webview.create("../html/qa-my-wenda.html", "qa-my-wenda.html", {}, {
							});
						}else{
							mui.openWindow({
								url: '../html/login.html',
								id: 'login.html'
							})	
						}
					})
					document.getElementById("goQu").addEventListener("tap", function() {
						if(userid && userid != null && userid != "null") {
							plus.nativeUI.showWaiting();
							plus.webview.create("../html/qa-going-q-01.html", "qa-going-q-01.html", {}, {
							});
						}else{
							mui.openWindow({
								url: '../html/login.html',
								id: 'login.html'
							})	
						}
					})
					document.getElementById("goAn").addEventListener("tap", function() {
						mui.openWindow({
							url: "../html/qa-waiting-a.html",
							id: "qa-waiting-a.html",
							show: {
								aniShow: "slide-in-right"
							}
						});
					})
				},
				proName: function(data) {
					console.log("xmtt")
					if(data.success) {
						this.innerHTML = data.data.name;
					}
				},
				proinfo: function(res) {
						var dataStr = res.data
						var baImg = "../images/default-photo.jpg";
						if(dataStr.hasHeadImage == 1) {
							baImg = baseUrl + "/images/head/" + dataStr.id + "_l.jpg";
						}
						var userType = autho(dataStr.authType, dataStr.orgAuth, dataStr.authStatus);
						var os = "";
						if(dataStr.title) {
							if(dataStr.orgName) {
								os = dataStr.title + "，" + dataStr.orgName;
							} else {
								os = dataStr.title;
							}
						} else {
							if(dataStr.office) {
								if(dataStr.orgName) {
									os = dataStr.office + "，" + dataStr.orgName;
								} else {
									os = dataStr.office;
								}
							} else {
								if(dataStr.orgName) {
									os = dataStr.orgName;
								}
							}
						}
						var str = '<div class="owner-head useHead" style="background-image:url(' + baImg + ')"></div>' +
							'<div class="owner-info">' +
							'<div class="owner-name"><span class="h1Font">' + dataStr.name + '</span><em class="authicon ' + userType.sty + '" title="' + userType.title + '"></em></div>' +
							'<div class="owner-tit mui-ellipsis h2Font">' + os + '</div>' +
							'</div>'

						this.innerHTML=str;
				},
				questioninfo: function(res) {
					if(res.success) {
						this.innerHTML=res.data.title
					}
				},
				orgName: function(data) {
					if(data.success) {
						if(data.data.forShort) {
							this.innerHTML = data.data.forShort;
						} else {
							this.innerHTML = data.data.name;
						}

					}
				},
                questionModule:function(dataStr, liStr) {
                    var baImg = "../images/default-q&a.jpg";
                    var subs = new Array();
                    if(dataStr.img) {
                        if(dataStr.img.indexOf(',')) {
                            subs = dataStr.img.split(',');
                        } else {
                            subs[0] = dataStr.img;
                        }
                        baImg = baseUrl + "/data/question"+ subs[0];
                    }
                    var hd = "";
                    if (dataStr.replyCount > 0) {
                        hd = '<span>' + dataStr.replyCount + ' 回答</span>'
                    }
                    liStr.setAttribute("data-id", dataStr.id);
                    liStr.className = "mui-table-view-cell";
                    liStr.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
                        '<div class="madiaHead qa-Head" style="background-image:url(' + baImg + ')"></div>' +
                        '<div class="madiaInfo OmadiaInfo">' +
                        '<p class="mui-ellipsis-2 h1Font">' + dataStr.title + '</p>' +
                        '<p class="show-item mui-ellipsis h2Font">' + hd + '<span>N 关注</span></p>' +
                        '</div></div>'
                },
				leaveMsgCount: function(data) {
					if(data.success) {
						if(data.data > 0) {
							this.innerHTML = data.data + "留言"
						}
					}
				},
				createFragment: function(data) {
					if(data.success) {
						var $data = data.data.data;
						if(m==0){
                            if (arguments[1]) {
                                fEx = $data[0].articleId;
                                if ($data.length > 1) {
                                    $data.length = 1;
                                }
                            } else {
                                $data = data.data;
                                if ($data.length > 0) {
                                    fTime = $data[$data.length - 1].tm;
                                    fId = $data[$data.length - 1].id;
                                }
                            }
						}

						for(var i = 0; i < $data.length; i++) {
							var of ;
							if($data[i].articleType == 1 || $data[i].ctype == "1") { of = 1;
							} else { of = 2;
                            }
                            var arImg = "../images/default-artical.jpg";


                            if (m == 0 && !arguments[1]) {
                                if ($data[i].img) {
                                    arImg = baseUrl + "/data/article/" + $data[i].img.replace(".", "_s.")
                                }
                            } else {
                                if ($data[i].articleImg) {
                                    arImg = baseUrl + "/data/article/" + $data[i].articleImg.replace(".", "_s.")
                                }
                            }
							var title = $data[i].articleTitle;
							var colSpan = "";
							if(m == 0) {
								if(arguments[1]) {

									colSpan = '<span class="column">置顶</span>'
								} else {

									if(pullObj["0"] == 1) {

										key1[m].endPullDownToRefresh();
										pullObj[m] = 0;
									}
									if($data[i].col != 0) {
										colSpan = "<span class='column columnOther'>" + columnType[$data[i].col].shortName + "</span>"
									}
								}
							} else {
								if(pullObj[m] == 1) {
									key1[m].endPullDownToRefresh();
									pullObj[m] = 0;
								}
							}
							var li = document.createElement("li");
                            if (m == 0 && !arguments[1]) {
                            	if ($data[i].ctype == "3" ){
                                    $D({
                                        data: {id:$data[i].id},
                                        fun: ob.questionModule,
                                        url: "/ajax/question/qo",
                                        sele: li
                                    });
								}else {
                                    li.setAttribute("data-id", $data[i].id);
                                    li.setAttribute("data-flag", 3);
                                    li.className = "mui-table-view-cell flexCenter OflexCenter";
                                    li.innerHTML = '<div class="madiaHead artHead" style="background-image:url(' + arImg + ')"></div>' +
                                        '<div class="madiaInfo OmadiaInfo">' +
                                        '<p class="mui-ellipsis-2 h1Font">' + $data[i].title + '</p>' +
                                        '<p class="h2Font mui-ellipsis">' + colSpan +
                                        '<span class="nameSpan" style="margin-right:10px"></span>' +
                                        '<span class="time">' + commenTime($data[i].tm) + '</span>' +
                                        '</p>' +
                                        '</div>'
								}
                            } else {
                                li.setAttribute("data-id", $data[i].articleId);
                                li.setAttribute("data-flag", 3);
                                li.className = "mui-table-view-cell flexCenter OflexCenter";
                                li.innerHTML = '<div class="madiaHead artHead" style="background-image:url(' + arImg + ')"></div>' +
                                    '<div class="madiaInfo OmadiaInfo">' +
                                    '<p class="mui-ellipsis-2 h1Font">' + title + '</p>' +
                                    '<p class="h2Font mui-ellipsis">' + colSpan +
                                    '<span class="nameSpan" style="margin-right:10px"></span>' +
                                    '<span class="time">' + commenTime($data[i].publishTime) + '</span>' +
                                    '</p>' +
                                    '</div>'
                            }
							if(arguments[1]) {
								if(document.getElementsByTagName("ul")[m].children[0]) {
									document.getElementsByTagName("ul")[m].insertBefore(li, document.getElementsByTagName("ul")[m].children[0])
								} else {
									document.getElementsByTagName("ul")[m].appendChild(li);
								}
							} else {
								document.getElementsByTagName("ul")[m].appendChild(li);
							}

							if( of == 1) {
                            	if (m==0 && !arguments[1]){
                                    li.setAttribute("owner-id", $data[i].uid);
                                    li.setAttribute("data-type", 1);
                                    $D({
                                        data: {},
                                        fun: ob.proName,
                                        url: "/ajax/professor/editBaseInfo/" +$data[i].uid,
                                        sele: li.getElementsByClassName("nameSpan")[0]
                                    });
								}else{
                                    li.setAttribute("owner-id", $data[i].professorId);
                                    li.setAttribute("data-type", 1);
                                    $D({
                                        data: {},
                                        fun: ob.proName,
                                        url: "/ajax/professor/editBaseInfo/" + $data[i].professorId,
                                        sele: li.getElementsByClassName("nameSpan")[0]
                                    });
								}
							} else {
                            	if (m==0&& !arguments[1]){
                                    li.setAttribute("owner-id", $data[i].uid);
                                    li.setAttribute("data-type", 2);
                                    $D({
                                        data: {},
                                        fun: ob.orgName,
                                        url: "/ajax/org/" + $data[i].uid,
                                        sele: li.getElementsByClassName("nameSpan")[0]
                                    });
								}else{
                                    li.setAttribute("owner-id", $data[i].orgId);
                                    li.setAttribute("data-type", 2);
                                    $D({
                                        data: {},
                                        fun: ob.orgName,
                                        url: "/ajax/org/" + $data[i].orgId,
                                        sele: li.getElementsByClassName("nameSpan")[0]
                                    });
								}
							}
						}

						if(arguments[1]) {
							// arr.push($data[0].articleId);
							// console.log(arr + "   273");
							// $D({
							// 	"fun": ob.createFragment,
							// 	data: {
							// 		col: "",
							// 		pageNo: 1,
							// 		exclude: arr
							// 	},
							// 	url: "/ajax/article/find"
							// });
                            $D({
                                "fun": ob.createFragment,
                                data: {
                                    rows:QArows,
                                    ex: fEx
                                },
                                url: "/ajax/found/index"
                            });

						}
						if(!arguments[1]&&m!=0) {
							document.getElementsByClassName("nodatabox")[m].classList.add("displayNone");
							if(data.data.data.length == 0) {
								document.getElementsByClassName("nodatabox")[m].classList.remove("displayNone");
								key1[m].endPullUpToRefresh(true);
								return;
							}
							if(data.data.pageNo < Math.ceil(data.data.total / data.data.pageSize)) {
								key1[m].refresh(true);
								key1[m].endPullUpToRefresh(false);
							} else {
								key1[m].endPullUpToRefresh(true);
							}
						}else{
                            var liLen=document.getElementsByTagName("ul")[m].querySelectorAll("li").length;
                            if($data.length == 0&&liLen==0 ) {
                                document.getElementsByClassName("nodatabox")[m].classList.remove("displayNone");
                                key1[m].endPullUpToRefresh(true);
                                return;
                            }
                            if($data.length < QArows) {
                                key1[m].endPullUpToRefresh(true);
                            } else {
                                key1[m].refresh(true);
                                key1[m].endPullUpToRefresh(false);
                            }
						}
					}
				},
				QA: function(data) {
					if(data.success) {
						var $data = data.data;
						if($data.length > 0) {
							QAtime = $data[$data.length - 1].createTime;
							QAid = $data[$data.length - 1].id;
						}
						if(arguments[1]) {
							if($data.length > 1) {
								$data.length = 1;
							}
						}
						for(var i = 0; i < $data.length; i++) {
							if(pullObj[m] == 1) {
								key1[m].endPullDownToRefresh();
								pullObj[m] = 0;
							}
							var liStr = document.createElement("li");
							liStr.className = "mui-table-view-cell";
							liStr.setAttribute("data-id", $data[i].id);
							var hd = "",
								hl = "";
							if($data[i].agree > 0) {
								hd = '<span>' + $data[i].agree + ' 赞</span>'
							}
							liStr.setAttribute("data-id", $data[i].id);
							liStr.className = "mui-table-view-cell";
							liStr.innerHTML = '<div class="madiaInfo">' +
								'<p class="h1Font mui-ellipsis-2 qa-question"></p>'+
								'<div class="flexCenter qa-owner"></div>' +
								'<p class="qa-con mui-ellipsis-5">' + $data[i].cnt + '</p>' +
								'<div class="showli mui-ellipsis">' +
								'<span>' + commenTime($data[i].createTime) + '</span>' + hd + '<span class="leaveMsgCount"></span>' +
								'</div>' +
								'</div>'
							document.getElementsByTagName("ul")[m].appendChild(liStr);
							$D({
								data: {},
								fun: ob.proinfo,
								url: "/ajax/professor/editBaseInfo/" + $data[i].uid,
								sele: liStr.getElementsByClassName("qa-owner")[0]
							});
							$D({
								data: {
									"id": $data[i].qid
								},
								fun: ob.questioninfo,
								url: "/ajax/question/qo",
								sele: liStr.getElementsByClassName("qa-question")[0]
							});
							$D({
								data: {
									sid: $data[i].id,
									stype: "4"
								},
								fun: ob.leaveMsgCount,
								url: "/ajax/leavemsg/count",
								//todo 留言数量的this
								sele: liStr.getElementsByClassName("leaveMsgCount")[0]
							})
						}
						document.getElementsByClassName("nodatabox")[m].classList.add("displayNone");
						var liLen=document.getElementsByTagName("ul")[m].querySelectorAll("li").length;
						if($data.length == 0&&liLen==0 ) {
							document.getElementsByClassName("nodatabox")[m].classList.remove("displayNone");
							key1[m].endPullUpToRefresh(true);
							return;
						}
						if($data.length < QArows) {
							key1[m].endPullUpToRefresh(true);
						} else {
							key1[m].refresh(true);
							key1[m].endPullUpToRefresh(false);
						}
					}
				}
			}
			Discover.prototype.Init.prototype = Discover.prototype;
			var $D = Discover;
			$D().bindEvent();
			var ob = $D();
			//alert(ob.createFragment)

			document.querySelector('#slider').addEventListener('slide', function(event) {

				var $this = document.querySelector(".mui-scroll .mui-active");
				if($this.innerHTML == "科研") {
					m = 1;
				} else if($this.innerHTML == "企业") {
					m = 2;
				} else if($this.innerHTML == "智库") {
					m = 4;
				} else if($this.innerHTML == "检测") {
					m = 5;
				} else if($this.innerHTML == "会议") {
					m = 6;
				} else if($this.innerHTML == "招聘") {
					m = 7;
				} else if($this.innerHTML == "推荐") {
					m = 0;
				} else if($this.innerHTML == "问答") {
					m = 3
				}
				if(!$this.getAttribute("flag")) {

					$this.setAttribute("flag", 1);
					console.log(colum[m + 2] + " 99999")
					if(m == 3) {
						$D({
							"fun": ob.QA,
							data: {
								rows: QArows
							},
							url: "/ajax/question/answer/byTime"
						});
					} else {
						$D({
							"fun": ob.createFragment,
							data: {
								col: colum[m + 2],
								pageNo: 1
							},
							url: "/ajax/article/find"
						});
					}
				}
			})
			$.ajax(baseUrl + "/data/inc/col_bannerApp.html?ttt=" + new Date().getTime(), {
				dataType: 'html', //服务器返回json格式数据
				type: "get", //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				traditional: true,
				async: true,
				success: function(data) {
					//alert(JSON.stringify(data))
					document.getElementById("slider1").innerHTML = data;
					for(var i = 0; i < 5; i++) {
						arr.push(document.getElementById("slider1").getElementsByClassName("mui-slider-item")[i].getAttribute("data-id"));
					}
					$D({
						"fun": ob.createFragment,
						data: {
							col: 9,
							pageNo: 1
						},
						flag: 1,
						url: "/ajax/article/find",
					});
					var slider = $("#slider1");
					slider.slider({
						interval: 5000
					});
					$("#slider1").on("tap", "a", function() {
						plus.nativeUI.showWaiting();
						var id = this.parentNode.getAttribute("data-id");
						var col = this.parentNode.getAttribute("col-id");
						aiticl(id)
						addClick1(col);
					})
				},
				error: function(xhr, type, errorThrown) {
					//plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
			function userInfo(){
				$.ajax({
					type:"get",
					url:baseUrl+"/ajax/professor/editBaseInfo/" + userid,
					async:true,
					success:function(res){
						if(res.success){
							document.getElementsByClassName("unlogin")[0].classList.add("displayNone")
							document.getElementsByClassName("onlogin")[0].classList.remove("displayNone")
							var baImg = "../images/default-photo.jpg";
							if(res.data.hasHeadImage == 1) {
								baImg = baseUrl + "/images/head/" + res.data.id + "_l.jpg";
							}
							var str='<div class="flexCenter madiaBlock">'+
										'<div class="madiaHead useHead" style="background-image:url(' + baImg + ')"></div>'+
										'<div class="madiaInfo h1Font">'+
											'<span class="mui-pull-left">'+res.data.name+'</span>'+
											'<span class="rightword">我的回答</span>'+
										'</div>'+
									'</div>'
							document.getElementById("my-q&a").innerHTML=str;
						}
					}
				});
			}
			
			function addClick1(colId) {
				$.ajax(baseUrl + "/ajax/operation/statist/bannerClick", {
					dataType: 'json', //服务器返回json格式数据
					type: "post", //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					data: {
						"id": colId
					},
					traditional: true,
					async: true,
					success: function(data) {
						if(data.success) {}
					}
				});
			}

			function aiticl(id) {
				$.ajax(baseUrl + "/ajax/article/query", {
					dataType: 'json', //服务器返回json格式数据
					type: "get", //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					data: {
						"articleId": id
					},
					traditional: true,
					async: true,
					success: function(data) {
						if(data.success) {
							var ownerid;
							if(data.data.articleType == 1) {
								ownerid = data.data.professorId;
								plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
									articleId: id,
									ownerid: ownerid,
								});
							} else {
								ownerid = data.data.orgId
								plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
									articleId: id,
									ownerid: ownerid,
									oFlag: 1
								});
							}
						}

					},
					error: function(xhr, type, errorThrown) {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				});
			}
		})
	})
})(mui)