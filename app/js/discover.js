//发现模块
var pageIndex = 1; // 页数
var allPages = 1; // 总页数
var discoverBox = document.body.querySelector('#discoverBox');

/*点击列表*/
mui('#discoverBox').on('tap', '.newsurl', function() {
	var id = $(this).attr("data-id");
	var datatype = $(this).attr("data-type");
	var ownerid = $(this).attr("owner-id");
	if(datatype == 1) {
		mui.openWindow({
			url: '../html/professorArticle.html',
			id: 'html/professorArticle.html',
			show: {
				autoShow: false,
				aniShow: "slide-in-right",
			},
			extras: {
				articleId: id,
				ownerid: ownerid,
			}
		});
	}else if(datatype == 2){
		mui.openWindow({
			url: '../html/professorArticle.html',
			id: 'html/professorArticle.html',
			show: {
				autoShow: false,
				aniShow: "slide-in-right",
			},
			extras: {
				articleId: id,
				ownerid: ownerid,
				oFlag:1
			}
		});
	} else if(datatype == 3) {
		mui.openWindow({
			url: '../html/resinforbrow.html',
			id: 'html/resinforbrow.html',
			show: {
				autoShow: false,
				aniShow: "slide-in-right",
			},
			extras: {
				resourceId: id,
			}
		});
	}
});

/*点击头像*/
mui('#discoverBox').on('tap', '.gouserurl', function() {
	var id = $(this).parents(".mui-table-view-cell").find(".userurl").attr("data-id");
	var datatype = $(this).parents(".mui-table-view-cell").find(".newsurl").attr("data-type");
	var iftauth = $(this).parents(".mui-table-view-cell").find(".userurl").attr("data-iftauth");
	//alert(datatype)
	if(datatype == 1 || datatype == 3) {
		mui.openWindow({
			url: '../html/proinforbrow.html',
			id: 'html/proinforbrow.html',
			show: {
				autoShow: false,
				aniShow: "slide-in-right",
			},
			extras: {
				proid: id,
			}
		});
	} else if(datatype == 2) {
		if(iftauth == 3) {
			mui.openWindow({
				url: '../html/cmpinfor-index.html',
				id: 'cmpinfor-index.html',
				show: {
					autoShow: false,
					aniShow: "slide-in-right",
				},
				extras: {
					orgId: id,
				}
			});
		} else {
			mui.openWindow({
				url: '../html/cmpinfor-Unindex.html',
				id: 'cmpinfor-Unindex.html',
				show: {
					autoShow: false,
					aniShow: "slide-in-right",
				},
				extras: {
					orgId: id,
					flag: 0
				}
			});
		}
	}
});

/*页面数据初始化*/
getOnePase();

mui.init({
	pullRefresh: {
		container: '#pullrefresh2',
		up: {
			contentrefresh: '正在加载...',
			//auto:true,
			//height:100, 
			callback: pullupRefresh
		}
	}
});

function pullupRefresh() {
	pageIndex = ++pageIndex;
	setTimeout(function() {
		getaData()
	}, 1000);
}
/*时间转换*/
function Time(dealtime) {
	var s = dealtime;
	var m = s.substr(4, 2);
	var d = s.substr(6, 2);
	var formatTime = m.replace(/\b(0+)/gi, "") + "月" + d + "日";
	return formatTime;
}

/*获取上拉加载更多数据*/
function getaData() {
	mui.plusReady(function() {
		mui.ajax(baseUrl + '/ajax/article/pqFind', {
			data: {
				"pageNo": pageIndex,
				"pageSize": 20,
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000,
			async: true,
			success: function(data) {
				if(data.success) {
					//console.log("成功");
					var dice1 = data.data.total; //总条数
					var dice2 = data.data.pageSize; //每页条数
					var result = '';
					if(pageIndex == 1) { //下拉刷新需要先清空数据
						table.innerHTML = ''; // 在这里清空可以防止刷新时白屏
					}
					allPages = dice1 / dice2;
					var datalist = data.data.data;
					datalistEach(datalist);
					if(pageIndex < allPages) {
						mui('#pullrefresh2').pullRefresh().endPullupToRefresh(false); /*能上拉*/
					} else {
						mui('#pullrefresh2').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				mui('#pullrefresh2').pullRefresh().endPullupToRefresh(true);
			}
		});
	});
}

/*获取第一页数据*/
function getOnePase() {
	mui.plusReady(function() {
		mui.ajax(baseUrl + '/ajax/article/pqFind', {
			data: {
				"pageNo": 1,
				"pageSize": 20,
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000,
			async: true,
			success: function(data) {
				console.log(data)
				discoverBox.innerHTML = "";
				if(data.success && data.data) {
					plus.nativeUI.closeWaiting();
					var datalist = data.data.data;
					datalistEach(datalist);
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	});
}

/*数据遍历*/
function datalistEach(datalist) {
	mui.each(datalist, function(index, item) {
		var itemlist = '';
		var itemlist = '<li class="mui-table-view-cell">';
		itemlist += '<div class="table-item-media mui-clearfix userurl" >';
		itemlist += '<div class="table-item-logo gouserurl" id="userimg"></div>';
		itemlist += '<div class="table-item-name mui-clearfix positionR"><span id="nameSpan" class="gouserurl"></span><em class="authicon"></em></div>';
		itemlist += '</div><div class="flexCenter table-item-cell newsurl">';
		itemlist += '<div class="table-item-img artical-default" id="newsimg"></div>';
		itemlist += '<div class="table-item-body"><p class="listtit mui-ellipsis-2" id="centent"></p></div>';
		itemlist += '</div><div><em class="cmpLable" id="newstype"></em>';
		itemlist += '<span class="timeLabel" id="time"></span></div></li>';
		$itemlist = $(itemlist);
		$("#discoverBox").append($itemlist);
		var type = item.type;
		$itemlist.find("#centent").text(item.name);
		$itemlist.find("#time").text(Time(item.createTime));
		$itemlist.find(".newsurl").attr("data-id", item.id);
		$itemlist.find(".newsurl").attr("data-type", item.type);
		$itemlist.find(".newsurl").attr("owner-id", item.owner);
		if(item.image) {
			$itemlist.find("#newsimg").attr("style", "background-image: url(" + baseUrl + "/data/article/" + item.image + ");");
		}
		if(type == 1) { //专家文章
			$itemlist.find("#newstype").text("文章");
			$itemlist.find("#newstype").addClass("articalLabel");
			$itemlist.find("#newsimg").addClass("artical-default");
			$itemlist.find("#userimg").addClass("userhead");
			userFun(item.owner, $itemlist);
		} else if(type == 2) { //企业文章
			$itemlist.find("#newstype").text("文章");
			$itemlist.find("#newstype").addClass("articalLabel");
			$itemlist.find("#newsimg").addClass("artical-default");
			$itemlist.find("#userimg").addClass("cmplogo");
			cmpFun(item.owner, $itemlist)
		} else if(type == 3) { //专家资源
			$itemlist.find("#newstype").text("资源");
			$itemlist.find("#newstype").addClass("resourceLabel");
			$itemlist.find("#newsimg").addClass("resource-default");
			$itemlist.find("#userimg").addClass("userhead");
			userFun(item.owner, $itemlist);
		}

	});

}

/*用户信息*/
function userFun(id, $itemlist) {
	mui.ajax(baseUrl + '/ajax/professor/baseInfo/' + id, {
		"type": "get",
		"async": true,
		"success": function(data) {
			console.log(data);
			if(data.success && data.data) {
				$itemlist.find("#nameSpan").text(data.data.name);
				if(data.data.hasHeadImage == 1) {
					$itemlist.find("#userimg").attr("style", "background-image: url(" + baseUrl + "/images/head/" + data.data.id + "_m.jpg);");
				}
				$itemlist.find(".userurl").attr("data-id", data.data.id);
				var userType = autho(data.data.authType, data.data.orgAuth, data.data.authStatus);
				$itemlist.find(".authicon").attr("title", userType.title);
				$itemlist.find(".authicon").addClass(userType.sty);

			}
		},
		"error": function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
}

/*企业用户信息*/
function cmpFun(id, $itemlist) {
	mui.ajax(baseUrl + '/ajax/org/' + id, {
		"type": "get",
		"async": true,
		"success": function(data) {
			console.log(data);
			if(data.success && data.data) {
				if(data.data.forShort) {
					$itemlist.find("#nameSpan").text(data.data.forShort);
				} else {
					$itemlist.find("#nameSpan").text(data.data.name);
				}
				if(data.data.hasOrgLogo) {
					$itemlist.find("#userimg").attr("style", "background-image: url(" + baseUrl + "/images/org/" + data.data.id + ".jpg);");
				}
				$itemlist.find(".userurl").attr("data-id", data.data.id);
				$itemlist.find(".userurl").attr("data-iftauth", data.data.authStatus);
				if(data.data.authStatus==3){
					$itemlist.find(".authicon").addClass("authicon-com-ok").attr("title", "认证企业");;	
				}/*else{
					$itemlist.find(".authicon").addClass("authicon-com-no").attr("title", "未认证企业");;
				}*/
			}
		},
		"error": function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
}

/*标志*/
function autho() {
	if(arguments[0] == 1) {
		return {
			"sty": "authicon-pro",
			"title": "科袖认证专家"
		}
	} else {
		if(arguments[1] == 1) {
			return {
				"sty": "authicon-staff-ok",
				"title": "企业认证员工"
			}
		} else {
			if(arguments[2] == 3) {
				return {
					"sty": "authicon-real",
					"title": "实名认证用户"
				}
			}
		}
	}
}