//搜索首页
var ifdiv = false;
var bigClass = 1,
	allPages = 1; // 总页数;
var key = "",
	subject = "",
	industry = "",
	province = "",
	address = "",
	authentication = "",
	pageSize = 0,
	pageNo = 1;
var showblock = document.getElementById("li_show");
var selectblock = document.getElementById("div_select");
var searchVal = document.getElementById("searchval");
var table = document.body.querySelector('.list');
var yyhy = document.getElementById("yyhy");
var xsly = document.getElementById("xsly");
var subjectid = document.getElementById("subjectid");
var industryid = document.getElementById("industryid");
var nodatabox = document.getElementById("nodatabox");

mui.init({
		pullRefresh: {
			container: '#pullrefresh3',
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh,
				//auto:true
			}
		}
});

function pullupRefresh() {
	pageNo = ++pageNo;
	console.log(pageNo)
	key = searchVal.value;
	setTimeout(function() {
		expert2(key, subject, industry, province, address, authentication, 10, pageNo)
	}, 1000);
	mui('#pullrefresh3').pullRefresh().refresh(true);
}


/*地区搜索*/
window.addEventListener('closesearch', function(event) {
	province = event.detail.province;
	address = event.detail.address;
	if(address == "全省") {
		address = "";
		document.getElementById("addressid").innerText = province;
	}else{
		document.getElementById("addressid").innerText = address;
	}
	if(province == "全国") {
		province = "";
		address = "";
		document.getElementById("addressid").innerText = "全国";
	}
	/*console.log(key);
	console.log(subject);
	console.log(industry);
	console.log(address);
	console.log(province);
	console.log(authentication);*/
	plus.nativeUI.showWaiting();
	expert(key, subject, industry, province, address, authentication, 10, 1);
})

mui.plusReady(function(){
	
	/*点击专家和资源列表*/
	mui('.list').on('tap','a',function(){
		var id=this.getAttribute("data-id");
		plus.nativeUI.showWaiting();//显示原生等待框
		if(bigClass==1){
			plus.webview.create("../html/proinforbrow.html",'proinforbrow.html',{},{proid:id});
		}else{
			plus.webview.create("../html/resinforbrow.html",'resinforbrow.html',{},{resourceId:id});	
		}
	  
	})
	
	var self = plus.webview.currentWebview();
	if(self.key==undefined){
		self.key="";
	}else{
		key=self.key;
		searchVal.value=key;
	}
	if(self.subject==undefined){
		self.subject="学术领域";
	}else{
		subject=self.subject;
		subjectid.innerText = self.subject;
		searchVal.setAttribute("placeholder","输入专家姓名、研究方向等关键字");
	}
	
    bigClass=self.bigClass;
    if(bigClass==1){
    	selectblock.innerText='专家';
    }else{
    	selectblock.innerText='资源';
    }
    
	
    expert(key, subject, industry, province, address, authentication, 10, 1);	
})

/*搜专家搜资源的下拉选择框*/
selectblock.addEventListener('tap', function() {
	showblock.style.display = 'block';
});

mui("#li_show").on('tap', 'li', function() {
	pageNo = 1
	bigClass = this.getAttribute("data-num");
	if(bigClass==1){
		searchVal.setAttribute("placeholder","输入专家姓名、研究方向等关键字");
	}else{
		searchVal.setAttribute("placeholder","输入资源名称、应用用途等关键字");
	}
	selectblock.innerHTML = this.innerHTML;
	showblock.style.display = 'none';
	plus.nativeUI.showWaiting();
	expert(key, subject, industry, province, address, authentication, 10, 1);
});

/*按键字搜索*/
searchval.addEventListener("keyup", function() {
	var e = event || window.event || arguments.caller.arguments[0];
	if(e.keyCode == 13) {
		pageNo = 1
		key = searchVal.value;
		plus.nativeUI.showWaiting();
		expert(key, subject, industry, province, address, authentication, 10, 1);
	}
})

/*应用行业*/
mui(".yyhy").on('tap', 'a', function() {
	pageNo = 1
	key = searchVal.value;
	industry = this.innerText;
	industryid.innerText = industry;
	document.querySelector('#yyhy li a.active').classList.remove('active');
	this.classList.add("active");
	if(industry == "不限") {
		industry = "";
		industryid.innerText ="应用行业";
	}
	plus.nativeUI.showWaiting();
	mui('.mui-popover').popover('hide');
	/*console.log(key);
	console.log(subject);
	console.log(industry);
	console.log(address);
	console.log(province);
	console.log(authentication);*/
	expert(key, subject, industry, province, address, authentication, 10, 1);
});

/*学术领域*/
mui(".xsly").on('tap', 'a', function() {
	pageNo = 1
	key = searchVal.value;
	subject = this.innerText;
	subjectid.innerText = subject;
	document.querySelector('#xsly li a.active').classList.remove('active');
	this.classList.add("active");
	if(subject == "不限") {
		subject = "";
		subjectid.innerText="学术领域";
	}
	/*	console.log(key);
		console.log(subject);
		console.log(industry);
		console.log(address);
		console.log(province);
		console.log(authentication);*/
	plus.nativeUI.showWaiting();
	mui('.mui-popover').popover('hide');
	expert(key, subject, industry, province, address, authentication, 10, 1);
});

/*初始化数据*/
function expert(key, subject, industry, province, address, authentication, pageSize, pageNo) {
		//console.log(bigClass)
	if(bigClass == 1) {
		mui.ajax(baseUrl + '/ajax/professor/pqAPP', {
			data: {
				"key": key,
				"subject": subject,
				"industry": industry,
				"province": province,
				"address": address,
				"authentication": authentication,
				"pageSize": pageSize,
				"pageNo": pageNo,
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000,
			success: function(data) {
				table.innerHTML = '';
				plus.webview.currentWebview().show("slide-in-right",150);
				plus.nativeUI.closeWaiting();
				var perrid = plus.webview.getWebviewById('../html/search-home.html');
				if(perrid){
				  setTimeout(function() {
					 perrid.close();
				   }, 1000);
				}
				if(data.success && data.data.data != '') {
					//mui('#pullup-container').pullRefresh().enablePullupToRefresh();//启用上拉刷新
					nodatabox.style.display = 'none';
					var datalist = data.data.data;
					console.log(data.data.total)
					datalistEach(datalist);
					mui('#pullrefresh3').pullRefresh().refresh(true);
	                mui('#pullrefresh3').pullRefresh().scrollTo(0,0);
	                if(data.data.total<data.data.pageSize){
	                	mui('#pullrefresh3').pullRefresh().endPullupToRefresh(true);//不能上拉
	                }else{
	                	mui('#pullrefresh3').pullRefresh().endPullupToRefresh(false); //能上拉
	                }
				} else {
					//plus.nativeUI.toast("抱歉，没有找到对应的搜索", toastStyle);
					nodatabox.style.display = 'block';
					mui('#pullrefresh3').pullRefresh().disablePullupToRefresh(); //没有数据禁止上拉刷新
				}
				
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	} else {
		mui.ajax(baseUrl + '/ajax/resource/pqRes', {
			data: {
				"key": key,
				"subject": subject,
				"industry": industry,
				"province": province,
				"address": address,
				"authentication": authentication,
				"pageSize": pageSize,
				"pageNo": pageNo,
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000,
			success: function(data) {
				table.innerHTML = '';
				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("slide-in-right",150);
				var perrid = plus.webview.getWebviewById('../html/search-home.html');
				if(perrid){
				  setTimeout(function() {
					 perrid.close();
				   }, 1000);
				}
				if(data.success && data.data.data != '') {
					//mui('#pullup-container').pullRefresh().enablePullupToRefresh();//启用上拉刷新
					console.log(data.data.total)
					nodatabox.style.display = 'none';
					var datalist = data.data.data;
					resourcesEach(datalist);
					mui('#pullrefresh3').pullRefresh().refresh(true);
	                mui('#pullrefresh3').pullRefresh().scrollTo(0,0,0);
	                if(data.data.total<data.data.pageSize){
	                	mui('#pullrefresh3').pullRefresh().endPullupToRefresh(true);//不能上拉
	                }else{
	                	mui('#pullrefresh3').pullRefresh().endPullupToRefresh(false); //能上拉
	                }
				} else {
					//plus.nativeUI.toast("抱歉，没有找到对应的搜索", toastStyle);
					nodatabox.style.display = 'block';
					mui('#pullrefresh3').pullRefresh().disablePullupToRefresh(); //没有数据禁止上拉刷新
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	}
	
	

}

/*上拉刷新数据*/
function expert2(key, subject, industry, province, address, authentication, pageSize, pageNo) {
	//console.log(pageNo)
	//console.log(bigClass);
	console.log(pageNo);
	if(bigClass == 1) {
		mui.ajax(baseUrl + '/ajax/professor/pqAPP', {
			data: {
				"key": key,
				"subject": subject,
				"industry": industry,
				"province": province,
				"address": address,
				"authentication": authentication,
				"pageSize": pageSize,
				"pageNo": pageNo,
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000,
			success: function(data) {
				plus.nativeUI.closeWaiting();
				if(data.success && data.data.data != '') {
					nodatabox.style.display = 'none';
					mui('#pullrefresh3').pullRefresh().enablePullupToRefresh(); //启用上拉刷新
					var datalist = data.data.data;
					var dice1 = data.data.total; //总条数
					var dice2 = data.data.pageSize; //每页条数
					console.log(dice1);
					console.log(dice2);
					allPages = Math.ceil(dice1 / dice2);
					if(allPages == 1) { //下拉刷新需要先清空数据
						table.innerHTML = ''; // 在这里清空可以防止刷新时白屏
					}
					console.log(allPages);
					var datalist = data.data.data;
					datalistEach(datalist);
					mui('#pullrefresh3').pullRefresh().refresh(true);//重置上拉加载
					if(pageNo < allPages) {
						mui('#pullrefresh3').pullRefresh().endPullupToRefresh(false); //能上拉
					} else {
						mui('#pullrefresh3').pullRefresh().endPullupToRefresh(true); //不能上拉
					}

				} else {
					mui('#pullrefresh3').pullRefresh().disablePullupToRefresh(); //没有数据禁止上拉刷新
					table.innerHTML = '';
					//plus.nativeUI.toast("抱歉，没有找到对应的搜索", toastStyle);
					nodatabox.style.display = 'block';
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				mui('#pullrefresh3').pullRefresh().endPullupToRefresh(true);
			}
		});
	} else {
		mui.ajax(baseUrl + '/ajax/resource/pqRes', {
			data: {
				"key": key,
				"subject": subject,
				"industry": industry,
				"province": province,
				"address": address,
				"authentication": authentication,
				"pageSize": pageSize,
				"pageNo": pageNo,
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000,
			success: function(data) {
				plus.nativeUI.closeWaiting();
				if(data.success && data.data.data != '') {
					nodatabox.style.display = 'none';
					mui('#pullrefresh3').pullRefresh().enablePullupToRefresh(); //启用上拉刷新
					var datalist = data.data.data;
					var dice1 = data.data.total; //总条数
					var dice2 = data.data.pageSize; //每页条数
					allPages = Math.ceil(dice1 / dice2);
					if(allPages == 1) { //下拉刷新需要先清空数据
						table.innerHTML = ''; // 在这里清空可以防止刷新时白屏
					}
					var datalist = data.data.data;
					resourcesEach(datalist);
					mui('#pullrefresh3').pullRefresh().refresh(true);
					if(pageNo < allPages) {
						mui('#pullrefresh3').pullRefresh().endPullupToRefresh(false); //能上拉
					} else {
						mui('#pullrefresh3').pullRefresh().endPullupToRefresh(true); //不能上拉
					}

				} else {
					mui('#pullrefresh3').pullRefresh().disablePullupToRefresh(); //没有数据禁止上拉刷新
					table.innerHTML = '';
					//plus.nativeUI.toast("抱歉，没有找到对应的搜索", toastStyle);
					nodatabox.style.display = 'block';
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				mui('#pullrefresh3').pullRefresh().endPullupToRefresh(true);
			}
		});
	}
		
}

/*专家数据遍历*/
function datalistEach(datalist) {
	mui.each(datalist, function(index, item) {
		
		
		/*获取头像*/
		if(item.hasHeadImage == 1) {
			var img = baseUrl + "/images/head/" + item.id + "_l.jpg";
		} else {
			var img = "../images/default-photo.jpg";
		}

		/*判断用户是否认证*/
		var icon = '';
		if(item.authType) {
			icon='<em class="mui-icon iconfont icon-vip authicon-cu"> </em>';
		} else {
			if(item.authStatus) {
				if(item.authentication == 1) {
					icon='<em class="mui-icon iconfont icon-renzheng authicon-mana"></em>';
				} else if(item.authentication == 2) {
					icon='<em class="mui-icon iconfont icon-renzheng authicon-staff"></em>';
				} else {
					icon='<em class="mui-icon iconfont icon-renzheng authicon-stu"></em>';
				}
			}
		}
		/*获取研究方向信息*/
		var researchAreas = item.researchAreas;
		var rlist = ''
		for(var n = 0; n < researchAreas.length; n++) {
			rlist = '<span>' + researchAreas[n].caption + '</span>';
		}

		/*获取资源信息*/
		var resources = item.resources;
		var zlist = ''
		for(var m = 0; m < resources.length; m++) {
			zlist = '<span>' + resources[m].resourceName + '</span>';
		}
		
		//var title;
		//(item.title != '') ? title = item.title + " , " : title = '';
		
		var title = item.title || "";
		var office = item.office || "";
		var orgName = item.orgName || "";
		var address = item.address || "";

		if(title != "") {
			title = title + " , ";
		}
		if(office != "") {
			office = office + " , ";
		}
		if(orgName != "") {
			orgName = orgName;
		}
		if(address != "") {
			address = " | " + address;
		}

		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media';

		li.innerHTML = '<a class="proinfor" data-id="'+item.id+'"' +
			'<p><img class="mui-media-object mui-pull-left headimg headRadius" src="' + img + '"></p>' +
			'<div class="mui-media-body">' +
			'<span class="listtit">' + item.name + icon + '</span>' +
			'<p class="listtit2"><span>' + title + '</span><span>' + office + '</span><span>' + orgName + '</span><span>' + address + '</span></p>' +
			'<p class="mui-ellipsis listtit3">' + rlist + '</p>' +
			'<p class="mui-ellipsis listtit3">' + zlist + '</p>' +
			'</div></a></li>';

		table.appendChild(li, table.firstChild);
	});
}

/*资源数据遍历*/
function resourcesEach(datalist) {
	mui.each(datalist, function(index, item) {

		/*获取头像*/
		if(item.images.length) {
			var img = baseUrl + "/images/resource/" + item.resourceId + ".jpg";
		} else {
			var img = "../images/default-resource.jpg";
		}

		/*判断用户是否认证*/
		var icon = '';		
		if(item.professor.authType) {			
			icon='<em class="mui-icon iconfont icon-vip authicon-cu"> </em>';
		} else {
			if(item.professor.authStatus) {
				if(item.professor.authentication == 1) {					
					icon='<em class="mui-icon iconfont icon-renzheng authicon-mana"></em>';
				} else if(item.professor.authentication == 2) {					
					icon='<em class="mui-icon iconfont icon-renzheng authicon-staff"></em>';
				} else {
					icon='<em class="mui-icon iconfont icon-renzheng authicon-stu"></em>';
				}
			}
		}

		var title = item.professor.title || "";
		var office = item.professor.office || "";
		var orgName = item.professor.orgName || "";
		var address = item.professor.address || "";

		if(title != "") {
			title = title + " , ";
		}
		if(office != "") {
			office = office + " , ";
		}
		if(orgName != "") {
			orgName = orgName;
		}
		if(address != "") {
			address = " | " + address;
		}
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media';

		li.innerHTML = '<a class="proinfor" data-id="'+item.resourceId+'"' +
			'<p><div class="mui-media-object mui-pull-left ResImgBox"><img class="resImg" src="' + img + '"></div></p>' +
			'<div class="mui-media-body">' +
			'<span class="listtit">' + item.resourceName + '</span>' +
			'<p class="mui-ellipsis listtit2">' + item.supportedServices + '</p>' +
			'<span class="listtit">' + item.professor.name + icon + '</span>' +
			'<p class="listtit3"><span>' + title + '</span><span>' + office + '</span><span>' + orgName + '</span><span>' + address + '</span></p>' +
			'</div></a></li>';

		table.appendChild(li, table.firstChild);
	});
}

mui.plusReady(function(){
//应用行业
mui.ajax(baseUrl + '/ajax/dataDict/qaDictCode', {
	data: {
		"dictCode": "INDUSTRY"
	},
	dataType: 'json', //数据格式类型
	type: 'GET', //http请求类型
	timeout: 10000,
	success: function(data) {
		var finallist = '<li class="mui-table-view-cell mui-col-xs-5"><a class="active">不限</a></li>';
		console.log(data.success)
		console.log(JSON.stringify(data.data))
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
		mui("#xsly li a").each(function () {
			if(this.innerText==subject){
				document.querySelector('#xsly li a.active').classList.remove('active');
				this.classList.add("active");
			}
		});
	},
	error: function() {
		plus.nativeUI.toast("服务器链接超时", toastStyle);
	}
});

})

	
