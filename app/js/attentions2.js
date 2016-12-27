//我的关注
var allPages = 1, // 总页数;
	pageSize = 0,
	pageNo = 1;
var table = document.body.querySelector('.list');
var nodatabox1 = document.getElementById("nodatabox1");

mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh,
		    //auto:true
		}
	}
});

function pullupRefresh() {
	pageNo = ++pageNo;
	console.log(pageNo);
	setTimeout(function() {
		expert2(pageNo, 10)
	}, 1000);
}

if(mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().pulldownLoading();
		}, 500);
	});
} else {
	mui.ready(function() {
		mui('#pullrefresh').pullRefresh().pulldownLoading();
	});
}



mui.plusReady(function(){
	mui('.list').on('tap','a',function(){
		var id=this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/resinforbrow.html",'resinforbrow.html',{},{resourceId:id});
	})
})

getOneExpert(1, 10);	

/*获取第一页资源数据*/
function getOneExpert(pageNo, pageSize) {
	mui.plusReady(function() {
		var userId = plus.storage.getItem('userid');
		mui.ajax(baseUrl + '/ajax/watch/qaPro', {
			data: {
				"professorId": userId,
				"watchType": 2,
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
				//mui('#pullrefresh').pullRefresh().refresh(true); //重置上拉加载
				if(data.success && data.data.data != "") {
					var datalist = data.data.data;
					datalistEach(datalist);
					mui('#pullrefresh').pullRefresh().refresh(true);
					
	                if(data.data.total<data.data.pageSize){
	                	mui('#pullrefresh').pullRefresh().disablePullupToRefresh(); //没有数据禁止上拉刷新	
	                }
				}else {
					nodatabox1.style.display = 'block';
					mui('#pullrefresh').pullRefresh().disablePullupToRefresh(); //没有数据禁止上拉刷新
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
					"watchType": 2,
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
							mui('#pullrefresh').pullRefresh().disablePullupToRefresh(); //没有数据禁止上拉刷新	
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

/*资源数据遍历*/
function datalistEach(datalistd) {
	mui.each(datalistd, function(index, item) {
       
		/*获取头像*/
		if(item.resource.images.length) {
			var img = baseUrl + "/images/resource/" + item.resource.resourceId + ".jpg";
		} else {
			var img = "../images/default-resource.jpg";
		}
		
		/*判断用户是否认证*/
		var icont = '';
		if(item.resource.professor.authType) {
			icont='<em class="mui-icon iconfont icon-vip authicon-cu"> </em>';
		} else {
			if(item.resource.professor.authStatus) {
				if(item.resource.professor.authentication == 1) {
					icont='<em class="mui-icon iconfont icon-renzheng authicon-mana"><span>科研</span></em>';
				} else if(item.resource.professor.authentication == 2) {
					icont='<em class="mui-icon iconfont icon-renzheng authicon-staff"><span>企业</span></em>';
				} else {
					icont='<em class="mui-icon iconfont icon-renzheng authicon-stu"><span>学生</span></em>';
				}
			}
		}

		var title = item.resource.professor.title || "";
		var office = item.resource.professor.office || "";
		var orgName = item.resource.professor.orgName || "";
		var address = item.resource.professor.address || "";

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

		li.innerHTML = '<a class="proinfor" data-id="' + item.resource.resourceId + '"' +
			'<p><div class="mui-media-object mui-pull-left ResImgBox"><img class="resImg" src="' + img + '"></div></p>' +
			'<div class="mui-media-body">' +
			'<span class="listtit">' + item.resource.resourceName + '</span>' +
			'<p class="mui-ellipsis listtit2">' + item.resource.supportedServices + '</p>' +
			'<span class="listtit">' + item.resource.professor.name + icont + '</span>' +
			'<p class="listtit3"><span>' + title + '</span><span>' + office + '</span><span>' + orgName + '</span><span>' + address + '</span></p>' +
			'</div></a></li>';
		table.appendChild(li, table.firstChild);
		
	});
}
