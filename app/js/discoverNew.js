(function($) {
	//阻尼系数
	var arr=[];
	var key1 = [];
	var m = 0;
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	$('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	$.ready(function() {
		$.plusReady(function() {
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
					fullName: "前沿动态",
					shortName: "前沿"
				},
				"4": {
					fullName: "学术经验",
					shortName: "经验"
				},
				"5": {
					fullName: "分析检测",
					shortName: "检测"
				},
				"6": {
					fullName: "会议培训",
					shortName: "会议"
				},
				"7": {
					fullName: "科袖访谈",
					shortName: "访谈"
				},
				"8": {
					fullName: "招聘招生",
					shortName: "招聘"
				},
				"9": {
					fullName: "重大新闻",
					shortName: "新闻"
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
				document.getElementsByClassName("mui-control-item")[n].style.paddingLeft = (oWidth - 4.5 * 45) / 9 + "px";
				document.getElementsByClassName("mui-control-item")[n].style.paddingRight = (oWidth - 4.5 * 45) / 9 + "px";
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
				},
				colum: {
					"a": "", //最新文章
					"3": 3, //前沿动态
					"4": 4, //学术经验
					"5": 5, //检测分析
					"6": 6, //会议培训
					"7": 7, //科袖访谈
					"8": 8 //招聘招生
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
						async: false,
						success: function(data) {
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
									
									var self = this;
									//self.refresh(true);
									setTimeout(function() {
										var ul = self.element.querySelector('.mui-table-view');
										ul.innerHTML = "";
										key1[m].endPullUpToRefresh(true);
										if(index == 0) {
											_this.pageNo.a = 1;
											_this.colum.a = ""
											$D({
												"fun": ob.createFragment,
												data: {
													col: 9,
													pageNo: 1
												},
												flag: 1,
												url: "/ajax/article/find"
											});
										} else {
											_this.pageNo[index] = 1;
											_this.colum[index + 2] = index + 2;
										}

										$D({
											"fun": _this.createFragment,
											data: {
												col: index ? _this.colum[index + 2] : _this.colum.a,
												pageNo: 1,
												exclude:arr
											},
											url: "/ajax/article/find"
										});
									}, 1000);
									self.endPullDownToRefresh();
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
											_this.colum[index + 2] = index + 2;
										}
										//var ul = self.element.querySelector('.mui-table-view');						
										$D({
											"fun": _this.createFragment,
											data: {
												col: index ? _this.colum[index + 2] : _this.colum.a,
												pageNo: pa,
												exclude:arr
											},
											url: "/ajax/article/find"
										});
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

				},
				proName: function(data) {
					if(data.success) {
						this.innerHTML = data.data.name;
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
				createFragment: function(data) {
					if(data.success) {
						var $data = data.data.data;
						if(arguments[1]) {
							if($data.length > 1) {
								$data.length = 1;
							}
						}
						for(var i = 0; i < $data.length; i++) {
							var of ;
							if($data[i].articleType == 1) { of = 1;
							} else { of = 2;
							}
							var arImg = "../images/default-artical.jpg";
							if($data[i].articleImg) {
								arImg = baseUrl + "/data/article/" + $data[i].articleImg
							}
							var title = $data[i].articleTitle;
							var colSpan = "";
							if(m == 0) {
								if(arguments[1]) {
									colSpan = '<span class="column">置顶</span>'
								} else {
									if($data[i].colNum != 0){	
											colSpan = "<span class='column columnOther'>" + columnType[$data[i].colNum].shortName + "</span>"
									}
								}
							}
							var li = document.createElement("li");
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
							if(arguments[1]) {
								if(document.getElementsByTagName("ul")[m].children[0]) {
									document.getElementsByTagName("ul")[m].insertBefore(li, document.getElementsByTagName("ul")[m].children[0])
								} else {
									if(arr.length==6) {
										arr[5]=$data[i].articleId;
									}else{
										arr.push($data[i].articleId);
									}
									
									document.getElementsByTagName("ul")[m].appendChild(li);
								}
							} else {
								document.getElementsByTagName("ul")[m].appendChild(li);
							}
							if( of == 1) {
								li.setAttribute("owner-id", $data[i].professorId);
								li.setAttribute("data-type", 1);
								$D({
									data: {},
									fun: ob.proName,
									url: "/ajax/professor/editBaseInfo/" + $data[i].professorId,
									sele: li.getElementsByClassName("nameSpan")[0]
								});
							} else {
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
						if(!arguments[1]) {
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
				if($this.innerHTML == "前沿动态") {
					m = 1;
				} else if($this.innerHTML == "学术经验") {
					m = 2;
				} else if($this.innerHTML == "检测分析") {
					m = 3;
				} else if($this.innerHTML == "会议培训") {
					m = 4;
				} else if($this.innerHTML == "科袖访谈") {
					m = 5;
				} else if($this.innerHTML == "招聘招生") {
					m = 6;
				} else if($this.innerHTML == "最新文章") {
					m = 0;
				}
				if(!$this.getAttribute("flag")) {

					$this.setAttribute("flag", 1);

					$D({
						"fun": ob.createFragment,
						data: {
							col: m + 2,
							pageNo: 1
						},
						url: "/ajax/article/find"
					});
				}
			})
			$.ajax(baseUrl + "/data/inc/col_bannerApp.html?ttt=" + new Date().getTime(), {
				dataType: 'html', //服务器返回json格式数据
				type: "get", //HTTP请求类型
				timeout: 10000, //超时时间设置为10秒；
				traditional: true,
				async: false,
				success: function(data) {
					//alert(JSON.stringify(data))
					document.getElementById("slider1").innerHTML = data;
					for(var i=1;i<6;i++) {
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
				},
				error: function(xhr, type, errorThrown) {
					//plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
			
			$D({
				"fun": ob.createFragment,
				data: {
					col: 9,
					pageNo: 1
				},
				flag: 1,
				url: "/ajax/article/find"
			});
			console.log(arr)
			$D({
				"fun": ob.createFragment,
				data: {
					col: "",
					pageNo: ob.pageNo.a,
					exclude:arr
				},
				url: "/ajax/article/find"
			});
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
