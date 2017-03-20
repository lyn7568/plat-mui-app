//我的关注
var allPages = 1, // 总页数;
	pageSize = 0,
	pageNo = 1;
var table = document.body.querySelector('.list');
var nodatabox1 = document.getElementById("nodatabox1");

mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		/*down: {
				callback: pulldownRefresh
			  },*/
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh,
		   // auto:true
		}
	}
});

function pullupRefresh() {
	pageNo = ++pageNo;
	setTimeout(function() {
		expert2(pageNo, 10)
	}, 1000);
	mui('#pullrefresh').pullRefresh().refresh(true);
}

/*function pulldownRefresh() {
	setTimeout(function() {
		getOneExpert(1, 10);	
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
	}, 1000);
}
*/


mui.plusReady(function(){
	mui('.list').on('tap','a',function(){
		var id=this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/proinforbrow.html",'proinforbrow.html',{},{proid:id});
		console.log(id)
	})
})

getOneExpert(1, 10);	

/*获取第一页专家数据*/
function getOneExpert(pageNo, pageSize) {
	mui.plusReady(function() {
		var userId = plus.storage.getItem('userid');
		mui.ajax(baseUrl + '/ajax/watch/qaPro', {
			data: {
				"professorId": userId,
				"watchType": 1,
				"pageNo": pageNo,
				"pageSize": pageSize
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			//timeout: 10000,
			//async:false, 
			success: function(data) {
				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("fade-in", 150);
				table.innerHTML = '';
				mui('#pullrefresh').pullRefresh().refresh(true); //重置上拉加载
				if(data.success && data.data.data != "") {
					var datalist = data.data.data;
					datalistEach(datalist);
					mui('#pullrefresh').pullRefresh().refresh(true);
	                if(data.data.total<data.data.pageSize){
	                	mui('#pullrefresh').pullRefresh().disablePullupToRefresh(); //没有数据禁止上拉刷新	
	                }
				}else {
					mui('#pullrefresh').pullRefresh().disablePullupToRefresh(); //没有数据禁止上拉刷新
					nodatabox1.style.display = 'block';
				}
			
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle); 
			}
		});
	});
}

/*上拉刷新数据*/
function expert2(pageNo, pageSize) {
	mui.plusReady(function() {
			var userId = plus.storage.getItem('userid');
			mui.ajax(baseUrl + '/ajax/watch/qaPro', {
				data: {
					"professorId": userId,
					"watchType": 1,
					"pageNo": pageNo,
					"pageSize": pageSize
				},
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000,
				//async:false,
				success: function(data) {
					
					if(data.success && data.data.data != "") {
						plus.nativeUI.closeWaiting();
						mui('#pullrefresh').pullRefresh().enablePullupToRefresh(); //启用上拉刷新
						var dice1 = data.data.total; //总条数
						var dice2 = data.data.pageSize; //每页条数
						allPages = Math.ceil(dice1 / dice2);
						if(allPages == 1) { //下拉刷新需要先清空数据
							table.innerHTML = ''; // 在这里清空可以防止刷新时白屏
						}
						var datalist = data.data.data;
						datalistEach(datalist);
						mui('#pullrefresh').pullRefresh().refresh(true); //重置上拉加载
						if(pageNo < allPages) {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //能上拉
						} else {
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //不能上拉
							
						}

					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
				}
			});
		});
}

/*专家数据遍历*/
function datalistEach(datalist) {
	mui.each(datalist, function(index, item) {
		/*获取头像*/
		//console.log(JSON.stringify(item));
		if(item.professor.hasHeadImage == 1) {
			var img = baseUrl + "/images/head/" + item.professor.id + "_l.jpg";
		} else {
			var img = "../images/default-photo.jpg";
		}

		/*获取研究方向信息*/
		var researchAreas = item.professor.researchAreas;
		//console.log(JSON.stringify(item.professor.researchAreas))
		var rlist = '';
		for(var n = 0; n < researchAreas.length; n++) {
			//console.log(researchAreas[n].caption);
			rlist += '<span>' + researchAreas[n].caption 
			if(n < researchAreas.length-1){
				rlist += " , "	
			}
			rlist += '</span>';
		}

		/*判断用户是否认证*/
		var icon = '';
		if(item.professor.authType) {
			icon='<em class="mui-icon iconfont icon-vip authicon-cu"> </em>';
		} else {
			if(item.professor.authStatus==3) {
				if(item.professor.authentication == 1) {
					icon='<em class="mui-icon iconfont icon-renzheng authicon-mana"></em>';
				} else if(item.professor.authentication == 2) {
					icon='<em class="mui-icon iconfont icon-renzheng authicon-staff"></em>';
				} else {
					icon='<em class="mui-icon iconfont icon-renzheng authicon-stu"></em>';
				}
			}
		}

		/*获取资源信息*/
		var resources = item.professor.resources;
		var zlist = '';
		for(var m = 0; m < resources.length; m++) {
			//console.log(resources[m].caption);
			zlist += '<span>' + resources[m].resourceName 
			if(m < resources.length-1){
				zlist += " , "	
			}
			zlist += '</span>';
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

		li.innerHTML = '<a class="proinfor" data-id="' + item.professor.id + '"' +
			'<p><img class="mui-media-object mui-pull-left headimg headRadius" src="' + img + '"></p>' +
			'<div class="mui-media-body">' +
			'<span class="listtit">' + item.professor.name + icon + '</span>' +
			'<p class="listtit2"><span>' + title + '</span><span>' + office + '</span><span>' + orgName + '</span><span>' + address + '</span></p>' +
			'<p class="mui-ellipsis listtit3">' + rlist + '</p>' +
			'<p class="mui-ellipsis listtit3">' + zlist + '</p>' +
			'</div></a></li>';

		table.appendChild(li, table.firstChild);
		
	});
}

