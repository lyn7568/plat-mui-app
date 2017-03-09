var orderKey, subject = "",
	industry = "",
	demandAim = "",
	sortType = "";
mui.init({
	pullRefresh: {
		container: '#pullrefresht',
		up: {
			height: 50,
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

function pullupRefresh() {
	setTimeout(function() {
		personalMessage(orderKey)
	}, 1000);
}
mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var industryid = document.getElementById("headck2");
	var subjectid = document.getElementById("headck3");
	personalMessage();
	/*需求目的*/
	mui("#middlePopover1").on('tap', '.mui-navigate-right', function(e) {
		plus.nativeUI.showWaiting(); //显示等待框
		if(this.innerHTML == "不限") {
			document.getElementById("headck1").innerHTML = "需求目的"
		} else {
			document.getElementById("headck1").innerHTML = this.innerHTML;
		}
		document.querySelector('.mui-backdrop').style.display = 'none';
		document.getElementById("middlePopover1").style.display = 'none';
		//去掉样式类mui-active,要不然会多点击一次
		document.getElementById("middlePopover1").classList.remove('mui-active');
		if(this.innerText == "技术咨询") {
			demandAim = 1;
		} else if(this.innerText == "资源咨询") {
			demandAim = 2;
		} else if(this.innerText == "其他事务") {
			demandAim = 3;
		} else {
			demandAim = "";
		}

		mui('#pullrefresht').pullRefresh().refresh(true);
		personalMessage(0);
		plus.nativeUI.closeWaiting(); //关闭等待框
	});
	/*时间排序*/
	mui("#middlePopover4").on('tap', '.mui-navigate-right', function(e) {
		plus.nativeUI.showWaiting(); //显示等待框
		document.getElementById("headck4").innerHTML = this.innerHTML;
		document.querySelector('.mui-backdrop').style.display = 'none';
		document.getElementById("middlePopover4").style.display = 'none';
		//去掉样式类mui-active,要不然会多点击一次
		document.getElementById("middlePopover4").classList.remove('mui-active');
		if(this.innerText == "按最新发布时间排序") {
			sortType = 0;
		} else if(this.innerText == "按最早发布时间排序") {
			sortType = 1;
		}
		mui('#pullrefresht').pullRefresh().refresh(true);
		personalMessage(0);
		plus.nativeUI.closeWaiting(); //关闭等待框
	});
	/*热门行业*/
	mui(".yyhy").on('tap', 'a', function() {
		industry = this.innerText;
		industryid.innerText = industry;
		document.querySelector('#yyhy li a.active').classList.remove('active');
		this.classList.add("active");
		if(industry == "不限") {
			industry = "";
			industryid.innerText = "热门行业";
		}
		plus.nativeUI.showWaiting();
		mui('.mui-popover').popover('hide');
		mui('#pullrefresht').pullRefresh().refresh(true);
		console.log(industry);
		personalMessage(0);
	});
	/*热门领域*/
	mui(".xsly").on('tap', 'a', function() {
		subject = this.innerText;
		subjectid.innerText = subject;
		document.querySelector('#xsly li a.active').classList.remove('active');
		this.classList.add("active");
		if(subject == "不限") {
			subject = "";
			subjectid.innerText = "热门领域";
		}
		plus.nativeUI.showWaiting();
		mui('.mui-popover').popover('hide');
		mui('#pullrefresht').pullRefresh().refresh(true);
		personalMessage(0);
	});
	/*进入needSure.html*/
	mui(".tableList").on('tap', 'li', function() {
		var oDemandId = this.getAttribute("demandId");
		mui.openWindow({
			url: '../html/needSure.html',
			id: '../html/needSure.html',
			show: {
				autoShow: false,
				aniShow: "slide-in-right",
			},
			extras: {
					deman:oDemandId
			},
		});
	});
});

function personalMessage(a) {

	mui.plusReady(function() {
		var ws = plus.webview.currentWebview();
		var c = new Object();
		c.sortType = sortType;
		c.demandAim = demandAim;
		c.industry = industry;
		c.rows = 10;
		if(a) {
			c.orderKey = a
		}
		mui.ajax(baseUrl + "/ajax/demand/ql", {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			data: c,
			success: function(data) {
				if(data.success) {
					console.log(JSON.stringify(data));
					plus.nativeUI.closeWaiting();
					ws.show("slide-in-right", 150);
					if(!a) {
						document.getElementsByClassName("tableList")[0].innerHTML = ""
					}
					if(data.data.length == 0) {
						mui('#pullrefresht').pullRefresh().disablePullupToRefresh(true);
						return;
					}

					var datalist = data.data;
					datalistEach(datalist);
					orderKey = data.data[data.data.length - 1].orderKey;
					if(data.data.length == 10) {
						mui('#pullrefresht').pullRefresh().endPullupToRefresh(false); /*能上拉*/
					} else {
						mui('#pullrefresht').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				mui('#pullrefresht').pullRefresh().endPullupToRefresh(true);
				return;
			}
		});
	})
}

function datalistEach(datalist) {
	mui.each(datalist, function(index, ite) {
		item = ite.professor;
		/*获取头像*/
		if(item.hasHeadImage == 1) {
			var img = baseUrl + "/images/head/" + item.id + "_l.jpg";
		} else {
			var img = "../images/default-photo.jpg";
		}

		var title = "";
		var office = "";
		var orgName = "";
		var address = "";
		if(item.title && item.office && item.orgName && item.address) {
			title = item.title + "，";
			office = item.office + "，";
			orgName = item.orgName + " | ";
			address = item.address;
		} else if(!item.title && item.office && item.orgName && item.address) {
			office = item.office + "，";
			orgName = item.orgName + " | ";
			address = item.address;
		} else if(item.title && !item.office && item.orgName && item.address) {
			title = item.title + "，";
			orgName = item.orgName + " | ";
			address = item.address;
		} else if(item.title && item.office && !item.orgName && item.address) {
			title = item.title + "，";
			office = item.office + " | ";
			address = item.address;
		} else if(item.title && item.office && item.orgName && !item.address) {
			title = item.title + "，";
			office = item.office + "，";
			orgName = item.orgName;
		} else if(!item.title && !item.office && item.orgName && item.address) {
			orgName = item.orgName + " | ";
			address = item.address;
		} else if(!item.title && item.office && !item.orgName && item.address) {
			office = item.office + " | ";
			address = item.address;
		} else if(!item.title && item.office && item.orgName && !item.address) {
			office = item.office + "，";
			orgName = item.orgName;
		} else if(item.title && !item.office && !item.orgName && item.address) {
			title = item.title + " | ";
			address = item.address;
		} else if(item.title && !item.office && item.orgName && !item.address) {
			office = item.title + "，";
			address = item.orgName;
		} else if(item.title && item.office && !item.orgName && !item.address) {
			title = item.title + "，";
			office = item.office;
		} else if(!item.title && !item.office && !item.orgName && item.address) {
			address = item.address;
		} else if(!item.title && !item.office && item.orgName && !item.address) {
			orgName = item.orgName;
		} else if(!item.title && item.office && !item.orgName && !item.address) {
			office = item.office;
		} else if(item.title && !item.office && !item.orgName && !item.address) {
			title = item.title;
		}
		var typeTname = '';
		if(item.authType) {
			typeTname = '<em class="mui-icon iconfont icon-vip authicon-cu"> </em>';
		} else {
			if(item.authStatus) {
				if(item.authentication == 1) {
					typeTname = '<em class="mui-icon iconfont icon-renzheng authicon-mana"></em>';
				} else if(item.authentication == 2) {
					typeTname = '<em class="mui-icon iconfont icon-renzheng authicon-staff"></em>';
				} else {
					typeTname = '<em class="mui-icon iconfont icon-renzheng authicon-stu"></em>';
				}
			}
		}
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media';
		li.setAttribute("demandId", ite.demandId);
		var oCreateTime = ite.createTime.substr(0, 4) + "-" + ite.createTime.substr(4, 2) + "-" + ite.createTime.substr(6, 2) + " " + ite.createTime.substr(8, 2) + ":" + ite.createTime.substr(10, 2);
		var odemand, odemandAim;
		(ite.demandType == 1) ? odemand = "个人": odemand = "企业";
		(ite.demandAim == 1) ? odemandAim = "技术": (ite.demandAim == 2) ? odemandAim = "资源" : odemandAim = "其他";
		var oString = '<div class="coutopicbox"><span class="coutheme mui-ellipsis mui-pull-left">' + ite.demandTitle + '</span>'
		oString += '<div class="coustatus mui-pull-right">'
		oString += '<span class="aimlabel">' + odemand + '</span>'
		oString += '<span class="aimlabel">' + odemandAim + '</span></div></div>'
		oString += '<a class="proinfor itemBtn">' <!-- displayNone-->
		oString += '<img class="mui-media-object mui-pull-left headimg headRadius" src="' + img + '">'
		oString += '<div class="mui-media-body">'
		oString += '<span class="listtit">' + item.name + ' ' + typeTname + ''
		oString += '<span class="thistime">' + oCreateTime + '</span></span>'
		oString += '<p class="listtit2">'
		oString += '<span>' + title + '</span><span>' + office + '</span><span>' + orgName + '</span><span>' + address + '</span></p>'
		oString += '<p class="listtit3 mui-ellipsis">' + ite.demandContent + '</p></div></a>'
		li.innerHTML = oString;
		document.getElementsByClassName("tableList")[0].appendChild(li);

	});
}

mui.plusReady(function() {
	//应用行业
	var yyhy = document.getElementById("yyhy");
	var xsly = document.getElementById("xsly");
	mui.ajax(baseUrl + '/ajax/dataDict/qaDictCode', {
		data: {
			"dictCode": "INDUSTRY"
		},
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		timeout: 10000,
		success: function(data) {
			var finallist = '<li class="mui-table-view-cell mui-col-xs-5"><a class="active">不限</a></li>';
			//			console.log(data.success)
			//			console.log(JSON.stringify(data.data))
			if(data.success && data.data != "") {
				mui.each(data.data, function(i, n) {
					finallist += '<li class="mui-table-view-cell mui-col-xs-5"><a >' + n.caption + '</a></li>';
				});
				yyhy.innerHTML = finallist;
			}

		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});
	//学术领域
	mui.ajax(baseUrl + '/ajax/dataDict/qaDictCode', {
		data: {
			"dictCode": "SUBJECT"
		},
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		timeout: 10000,
		success: function(data) {
			var finallist = '<li class="mui-table-view-cell mui-col-xs-5"><a class="active" >不限</a></li>';
			//console.log(data.success)
			//console.log(JSON.stringify(data.data))
			if(data.success && data.data != "") {
				mui.each(data.data, function(i, n) {
					finallist += '<li class="mui-table-view-cell mui-col-xs-5"><a >' + n.caption + '</a></li>';
				});
				xsly.innerHTML = finallist;
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
		}
	});

})