var num=1;
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
	num++;
	setTimeout(function() {
		UnauthorizedUser(20,num);
	}, 1000);
	
}
mui.ready(function() {
		mui.plusReady(function() {
			var dd1=plus.webview.getWebviewById("cmpinfor-index.html");
			var id = dd1.orgId;			
			/*企业基本信息*/
			function companyMessage() {
				mui.ajax(baseUrl + "/ajax/org/" + id, {
					dataType: 'json', //数据格式类型
					type: 'GET', //http请求类型
					timeout: 10000, //超时设置
					success: function(data) {
						if(data.success) {
							//console.log(JSON.stringify(data));
							var $data = data.data;
							var orgType;
							document.getElementById("companyName").innerText = $data.name;
							if($data.hasOrgLogo) {
								document.getElementById("oimg").src = baseUrl + "/images/org/" + $data.id + ".jpg";
							} else {
								document.getElementById("oimg").src = "../images/default-icon.jpg";
							}
							/*企业标识*/
							if($data.authStatus == 3) {
								document.getElementById("authFlag").classList.add("authicon-com-ok");
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
					arr[1].show();
				} else if(oStringText == "员工") {
					return;
				}
			})
			companyMessage();
			UnauthorizedUser(20,1);
		})
	})
	/*获取企业认证的用户*/
function UnauthorizedUser(pageSize,pageNum) {
	mui.plusReady(function() {
		var dd1=plus.webview.getWebviewById("cmpinfor-index.html");			
		var id = dd1.orgId;				
		mui.ajax(baseUrl + "/ajax/professor/pqOrgAuth", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"orgId": id,
				"orgAuth": 1,
				"pageSize": pageSize,
				"pageNo": pageNum
			},
			success: function(data, textState) {
				if(data.success) {
					if(num*pageSize<=data.data.total){						
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}else{
						if(num==1){
							mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
						}else{
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
							return;
						}
					}
					var $data = data.data.data;
					dUserHtml($data);
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
function dUserHtml(obj) {
	for(var i = 0; i < obj.length; i++) {
		var img;
		var oSty = autho(obj[i].authType, obj[i].orgAuth, obj[i].authStatus);
		(obj[i].hasHeadImage == 1) ? img = baseUrl + "/images/head/" + obj[i].id + "_l.jpg": img = "../images/default-photo.jpg";
		var li = document.createElement("li");
		li.className = "mui-table-view-cell mui-media flexCenter"
		if(obj[i].authType==1){
			li.setAttribute("professorId",obj[i].id);
		}
		var oString = '<p class="flexImg"><img class="mui-media-object headimg headRadius" src="' + img + '"></p>'
		oString += '<div class="mui-media-body flexTit">'
		oString += '<p class="listtit positionR"><span>' + obj[i].name + '</span><em class="authicon ' + oSty.sty + '"></em></p>'
		oString += '<p class="listtit2">' + personalInformation(obj[i]) + '</p>'
		if(obj[i].authType) {
			oString += '<p class="listtit3 mui-ellipsis">' + research(obj[i].researchAreas) + '</p>'
		}
		oString += '</div>'
		li.innerHTML = oString;
		document.getElementById("stflist").appendChild(li);
	}

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
/*职位职称所在机构，部门，地址等等*/
function personalInformation($person) {
	var arr1 = [$person.title, $person.office, $person.department, $person.orgName, $person.address];
	var arr = new Array();
	var arr2 = new Array();
	var n = 0;
	for(var i = 0; i < arr1.length; i++) {
		if(arr1[i]) {
			arr.push(arr1[i]);
			if(arr1[i] == arr1[arr1.length - 1]) {
				n = 1;
			}
		}
	}
	if(n == 1) {
		for(var i = 0; i < arr.length - 1; i++) {
			arr2.push(arr[i]);
		}
		return arr2.join() + " | " + arr[arr.length - 1];
	} else {
		return arr.join();
	}

}

function research(ob) {
	var oArry = new Array();
	for(var i = 0; i < ob.length; i++) {
		oArry.push(ob[i].caption);
	}
	return oArry.join("、");
}
/*专家跳转页面*/
mui("#stflist").on("tap","li[professorId]",function(){
	var proId=this.getAttribute("professorId");
		plus.nativeUI.showWaiting(); //显示原生等待框
		plus.webview.create("../html/proinforbrow.html", 'proinforbrow.html', {}, {
			proid: proId
		});
})
