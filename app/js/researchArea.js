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
		var professId = this.getAttribute("data-id");
		var authentication = this.getAttribute("authentication");
		var authType = this.getAttribute("authType");
		console.log(authentication)
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/userInforShow.html", 'userInforShow.html', {}, {
			proid: professId
		});

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

		var otherIn = "";
		if(item.title) {
			if(item.orgName) {
				otherIn = item.title + "，" + item.orgName;
			} else {
				otherIn = item.title;
			}
		} else {
			if(item.office) {
				if(item.orgName) {
					otherIn = item.office + "，" + item.orgName;
				} else {
					otherIn = item.office;
				}
			} else {
				if(item.orgName) {
					otherIn = item.orgName;
				}
			}
		}
		var typeTname = '';
		var oSty = autho(item.authType, item.orgAuth, item.authStatus);
		typeTname='<em class="authicon ' + oSty.sty + '"></em>'
		

		var li = document.createElement('li');
		li.className = 'mui-table-view-cell';
		li.setAttribute("data-id", item.id);
		li.setAttribute("authentication", item.authentication);
		li.setAttribute("authType", item.authType);
		li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">'+
					'<div class="madiaHead useHead" style="background-image:url(' + img + ')"></div>'+
					'<div class="madiaInfo">'+
						'<p><span class="h1Font">' + item.name + typeTname + '</p>'+
						'<p class="mui-ellipsis-2 h2Font">'+ otherIn +'</p>'+
					'</div></div>';
		table.appendChild(li, table.firstChild);

	});
}