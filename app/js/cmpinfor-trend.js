var id = "C77464E135424983A9918A75E7391DE3";
var comName,comImg,comAuth;
mui.ready(function() {
	mui.plusReady(function() {
		/*按钮点击切换*/
		mui(".cmpClassNum").on("tap","li",function(){
			var oStringText=this.innerText;
			var arr=new Array();
			arr[0]=plus.webview.getWebviewById("cmpinfor-basic.html");
			arr[1]=plus.webview.getWebviewById("cmpinfor-trend.html");			
			arr[2]=plus.webview.getWebviewById("cmpinfor-staff.html");
			if(oStringText=="介绍"){
				arr[0].show();
			}else if(oStringText=="动态"){
				return;
			}else if(oStringText=="员工"){
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
						//console.log(JSON.stringify(data));
						var $data = data.data;
						var orgType;
						document.getElementById("companyName").innerText = $data.name;
						comName=$data.name;
						if($data.hasOrgLogo) {
							document.getElementById("oimg").src = baseUrl + "/images/org/" + $data.id + ".jpg";
							comImg=baseUrl + "/images/org/" + $data.id + ".jpg";
						} else {
							document.getElementById("oimg").src = "../images/default-icon.jpg";
							comImg="../images/default-icon.jpg";
						}
						/*企业标识*/
						if($data.authStatus == 3) {
							document.getElementById("authFlag").classList.add("authicon-com-ok");
							comAuth='authicon-com-ok';
						} else {
							document.getElementById("authFlag").classList.add("authicon-com-no");
							comAuth="authicon-com-no";
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
function companyArticle() {
	mui.plusReady(function() {
		mui.ajax(baseUrl + "/ajax/article/qaOrg", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"orgId": id
			},
			success: function(data, textState) {
				if(data.success) {
					console.log(comName);
					console.log(comImg);
					console.log(comAuth);
					/*if(num*pageSize<=data.data.total){						
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
					}else{
						if(num==1){
							mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
						}else{
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
							return;
						}
					}*/
					var $data = data.data;
					console.log(JSON.stringify(data));
					dUserHtml($data,comName,comImg,comAuth);
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
		console.log(arguments[1])
		var li = document.createElement("li");
		li.className = "mui-table-view-cell"
		/*var oString = '<div class="table-item-media mui-clearfix">'
		oString += '<div class="table-item-logo cmplogo" style="background-image:url('+arguments[2]+')">'
		oString += '<div class="table-item-name mui-clearfix positionR"><span>'+arguments[1]+'</span><em class="authicon '+arguments[3]+'"></em></div>'
		oString += '</div>'
		oString += '<div class="flexCenter table-item-cell">'
		oString += '<div class="table-item-img artical-default"></div>'
		oString += '<div class="table-item-body">'
		oString += '<p class="listtit mui-ellipsis-2">'+obj[i].articleTitle+'</p>'
		oString += '</div></div>'
		oString += '<div><em class="cmpLable articalLabel">文章</em>'
		oString += '<span class="timeLabel">'+obj[i].createTime+'</span></div>'*/
		var oString ='<div class="table-item-media mui-clearfix">'
				        	oString+='<div class="table-item-logo cmplogo" style="background-image:url('+arguments[2]+')"></div>'
				        	oString+='<div class="table-item-name mui-clearfix positionR"><span>'+arguments[1]+'</span><em class="authicon '+arguments[3]+'"></em></div>'
				        oString+='</div>'
				        oString+='<div class="flexCenter table-item-cell">'
				        	oString+='<div class="table-item-img artical-default" style="background-image('+obj[i].articleImg+')"></div>'
							oString+='<div class="table-item-body">'
								oString+='<p class="listtit mui-ellipsis-2">'+obj[i].articleTitle+'</p>'
							oString+='</div>'
				        oString+='</div>'
				       oString+= '<div>'
				        	oString+='<em class="cmpLable articalLabel">文章</em>'
				        	oString+='<span class="timeLabel">'+timeGeshi(obj[i].createTime)+'</span>'
				        oString+="</div>"
		li.innerHTML = oString;
		document.getElementById("trend").appendChild(li);
	}

}
/*时间格式转换*/
function timeGeshi(otm) {
			var otme = otm.substring(0, 4) + "年" + otm.substring(4, 6) + "月" + otm.substring(6, 8) + "日";
			return otme;
		}