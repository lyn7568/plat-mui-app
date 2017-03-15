var createTime = "";
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

function pullupRefresh() {
	setTimeout(function() {
		personalMessage(createTime)
	}, 1000);
}
mui.plusReady(function() {
	var userid = plus.storage.getItem('userid');
	var wd = plus.webview.getWebviewById("researchAreaHead.html");
	document.getElementById("researchArea").innerText = wd.dataCaption;
	personalMessage();
	/*进入为学术领域点赞人的浏览页面*/
	mui("#table").on('tap', 'li', function() {
		var professId = this.getAttribute("professorId");
		var authentication = this.getAttribute("authentication");
		var authType = this.getAttribute("authType");
		console.log(authentication)
		plus.nativeUI.showWaiting();
		if(authType == 1) {
			//plus.webview.close("proinforbrow.html");
			plus.webview.create("../html/proinforbrow.html", 'proinforbrow.html', {}, {
				proid: professId
			});
		} else {
			if(authentication == 1) {
				plus.webview.create("../html/researcherProw.html", 'researcherProw.html', {}, {
					proid: professId
				});
			} else if(authentication == 2) {
				plus.webview.create("../html/companybrowse.html", 'companybrowse.html', {}, {
					proid: professId
				});
			} else if(authentication == 3) {
				plus.webview.create("../html/studentbrowse.html", 'studentbrowse.html', {}, {
					proid: professId
				});
			}
		}

	});
});

function personalMessage(a) {

	mui.plusReady(function() {
		var ws = plus.webview.getWebviewById("researchAreaHead.html");
		var c = new Object();
		c.professorId = ws.professorId;
		c.caption = ws.dataCaption
		c.rows = 10;
		if(a) {
			c.createTime = a
		}
		mui.ajax(baseUrl + "/ajax/researchAreaLog/ql", {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			data: c,
			success: function(data) {
				if(data.success) {					
					plus.nativeUI.closeWaiting();
					ws.show("slide-in-right", 150);
					if(!a) {
						if(data.data.length == 0) {
							document.getElementsByClassName("littip")[0].style.display = "none";
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
							return;
						}
					} else {
						if(data.data.length == 0) {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
							return;
						}
					}
					var table = document.getElementById("table");
					var datalist = data.data;
					datalistEach(datalist);
					createTime = data.data[data.data.length - 1].createTime;
					if(data.data.length == 10) {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); /*能上拉*/
					} else {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
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
			if(item.authStatus==3) {
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
		li.setAttribute("professorId", item.id);
		li.setAttribute("authentication", item.authentication);
		li.setAttribute("authType", item.authType);
		li.innerHTML = '<a class="proinfor" data-id="' + item.id + '"' +
			'<p><img class="mui-media-object mui-pull-left headimg headRadius" src="' + img + '"></p>' +
			'<div class="mui-media-body">' +
			'<span class="listtit">' + item.name + typeTname + '</span>' +
			'<p class="listtit2"><span>' + title + '</span><span>' + office + '</span><span>' + orgName + '</span><span>' + address + '</span></p>' +
			'</div></a></li>';

		table.appendChild(li, table.firstChild);

	});
}