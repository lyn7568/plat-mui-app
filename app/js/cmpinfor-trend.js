var createTime = "";
var n = 1;
var comName, comImg, comAuth;
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
	n++;
	setTimeout(function() {
		companyArticle(createTime)
	}, 1000);
}
mui.ready(function() {
		mui.plusReady(function() {
		var dd=plus.webview.getWebviewById("cmpinfor-Unindex.html");
		var dd1=plus.webview.getWebviewById("cmpinfor-index.html");
		if(dd==null){
			var id = dd1.orgId;
			var oflag=dd1.flag;
		}
		if(dd1==null){
			var id = dd.orgId;
			var oflag=dd.flag;
		}
		if(oflag==0){
		document.getElementsByClassName("aa")[0].style.width="50%";
		document.getElementsByClassName("aa")[1].style.width="50%";
		document.getElementsByClassName("aa")[2].style.display="none";
		}
			/*按钮点击切换*/
			mui(".cmpClassNum").on("tap", "li", function() {
				var oStringText = this.innerText;
				var arr = new Array();
				arr[0] = plus.webview.getWebviewById("cmpinfor-basic.html");
				arr[1] = plus.webview.getWebviewById("cmpinfor-trend.html");
				arr[2] = plus.webview.getWebviewById("cmpinfor-staff.html");
				if(oStringText == "介绍") {
					arr[0].show();
				} else if(oStringText == "动态") {
					return;
				} else if(oStringText == "员工") {
					arr[2].show();
				}
			})

			function companyMessage() {
				mui.ajax(baseUrl + "/ajax/org/" + id, {
					dataType: 'json', //数据格式类型
					type: 'GET', //http请求类型
					timeout: 10000, //超时设置
					success: function(data) {
						if(data.success) {
							var $data = data.data;
							var orgType;
							document.getElementById("companyName").innerText = $data.name;
							if($data.forShort){
								comName = $data.forShort;
							}else{
								comName = $data.name;
							}
							
							if($data.hasOrgLogo) {
								document.getElementById("oimg").src = baseUrl + "/images/org/" + $data.id + ".jpg";
								comImg = baseUrl + "/images/org/" + $data.id + ".jpg";
							} else {
								document.getElementById("oimg").src = "../images/default-icon.jpg";
								comImg = "../images/default-icon.jpg";
							}
							/*企业标识*/
							if($data.authStatus == 3) {
								document.getElementById("authFlag").classList.add("authicon-com-ok");
								comAuth = 'authicon-com-ok';
							} else {
								document.getElementById("authFlag").classList.add("authicon-com-no");
								comAuth = "authicon-com-no";
							}
							/*企业类型*/
							if($data.orgType) {
								switch($data.orgType) {
									case '2':
										orgType = "国有企业";
										break;
									case '3':
										orgType = "上市企业";
										break;
									case '4':
										orgType = "合资企业";
										break;
									case '5':
										orgType = "私人企业";
										break;
									case '6':
										orgType = "外资企业";
										break;
									default:
										orgType = "初创企业";
										break;
								}
								document.getElementById("orgType").innerText = orgType;
							}
							/*所在城市*/
							if($data.city) {
								document.getElementById("ocity").innerText = $data.city;
							} else {
								document.getElementById("ocity").parentNode.removeChild(document.getElementById("ocity"));
							}

						}
					},
					error: function() {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
						return;
					}
				});
			}
			companyMessage();
			companyArticle();
		});
	})
	/*获取企业文章*/
function companyArticle(oj) {
	mui.plusReady(function() {
		var dd=plus.webview.getWebviewById("cmpinfor-Unindex.html");
		var dd1=plus.webview.getWebviewById("cmpinfor-index.html");
		if(dd==null){
			var id = dd1.orgId;
			var oflag=dd1.flag;
		}
		if(dd1==null){
			var id = dd.orgId;
			var oflag=dd.flag;
		}
		var obj = new Object();
		obj.orgId = id;
		obj.rows = 20;
		if(oj) {
			obj.modifyTime = createTime;
		}
		mui.ajax(baseUrl + "/ajax/article/qlOrg", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: obj,
			success: function(data, textState) {
				if(data.success) {
					var $data = data.data;
					//console.log(JSON.stringify(data));
					if(n == 1) {
						if($data.length < 20 && $data.length > 0) {
							mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
						} else if($data.length == 0) {
							mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
							return;
						}
					} else {
						if(data.data.length == 20) {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); /*能上拉*/
						} else if($data.length < 20 && $data.length > 0) {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
						} else if($data.length == 0) {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
							return;
						}
					}
					createTime = data.data[data.data.length - 1].createTime;
					dUserHtml($data, comName, comImg, comAuth);
				}
			},
			error: function(XMLHttpRequest, textStats, errorThrown) {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		})
	})
}
/*企业文章html*/
function dUserHtml(obj) {
	for(var i = 0; i < obj.length; i++) {
		var li = document.createElement("li");
		li.className = "mui-table-view-cell"
		var oString = '<div class="table-item-media mui-clearfix">'
		oString += '<div class="table-item-logo cmplogo" style="background-image:url(' + arguments[2] + ')"></div>'
		oString += '<div class="table-item-name mui-clearfix positionR"><span>' + arguments[1] + '</span><em class="authicon ' + arguments[3] + '"></em></div>'
		oString += '</div>'
		oString += '<div class="flexCenter table-item-cell articl" articleId="'+obj[i].articleId+'">'
		if(obj[i].articleImg) {
			oString += '<div class="table-item-img artical-default" style="background-image:url(' + baseUrl + '/data/article/' + obj[i].articleImg + ')"></div>'
		} else {
			oString += '<div class="table-item-img artical-default"></div>'
		}
		oString += '<div class="table-item-body">'
		oString += '<p class="listtit mui-ellipsis-2">' + obj[i].articleTitle + '</p>'
		oString += '</div>'
		oString += '</div>'
		oString += '<div>'
		oString += '<em class="cmpLable articalLabel">文章</em>'
		oString += '<span class="timeLabel">' + timeGeshi(obj[i].createTime) + '</span>'
		oString += "</div>"
		li.innerHTML = oString;
		document.getElementById("trend").appendChild(li);
	}

}
/*时间格式转换*/
function timeGeshi(otm) {
	var otme = otm.substring(0, 4) + "年" + otm.substring(4, 6) + "月" + otm.substring(6, 8) + "日";
	return otme;
}
/*进入文章详细页面*/
	mui("#trend").on('tap', '.articl', function() {
		var dd=plus.webview.getWebviewById("cmpinfor-Unindex.html");
		var dd1=plus.webview.getWebviewById("cmpinfor-index.html");
		if(dd==null){
			var id = dd1.orgId;
			var oflag=dd1.flag;
		}
		if(dd1==null){
			var id = dd.orgId;
			var oflag=dd.flag;
		}
		var artId = this.getAttribute("articleId");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/professorArticle.html", 'professorArticle.html', {}, {
			articleId: artId,
			ownerid:id,
			oFlag:1
		});
	});