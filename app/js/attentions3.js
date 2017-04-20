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
		    //auto:true
		}
	}
});

function pullupRefresh() {
	pageNo = ++pageNo;
	setTimeout(function() {
		expert2(pageNo, 20)
	}, 1000);
	mui('#pullrefresh').pullRefresh().refresh(true);
}

/*function pulldownRefresh() {
	setTimeout(function() {
		getOneExpert(1, 10);	
	    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
	}, 1000);
}*/





mui.plusReady(function(){
	mui('.list').on('tap','a',function(){
		var id=this.getAttribute("data-id");
		var datatype = this.getAttribute("data-type");
	var ownerid = this.getAttribute("owner-id");
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
	} 
	})
})

getOneExpert(1, 20);	

/*获取第一页资源数据*/
function getOneExpert(pageNo, pageSize) {
	mui.plusReady(function() {
		var userId = plus.storage.getItem('userid');
		mui.ajax(baseUrl + '/ajax/watch/qaPro', {
			data: {
				"professorId": userId,
				"watchType": 3,
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
					"watchType": 3,
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
						 mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
						if(pageNo >= allPages) {
							mui('#pullrefresh').pullRefresh().disablePullupToRefresh(); //没有数据禁止上拉刷新	
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
		if(item.article.articleImg) {
			var img = baseUrl + "/data/article/"+ item.article.articleImg;
		} else {
			var img = "../images/default-artical.jpg";
		}
		var puId,oName,icont = '';
		if(item.article.articleType==1){
			puId=item.article.professorId;
			oName=item.article.professor.name;
			icont='<em class="mui-icon iconfont icon-vip authicon-cu"> </em>';
		}else{
			puId=item.article.orgId;
			oName=item.article.organization.name;
			if(item.article.organization.authStatus==3){
				icont='<em class="mui-icon iconfont authicon authicon-com-ok"></em>';
			}
		}
		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media'; 
		li.innerHTML = '<a class="proinfor"  owner-id="'+puId+'" data-type="'+item.article.articleType+'" data-id="' + item.article.articleId + '">' +
			'<p><div class="mui-media-object mui-pull-left ResImgBox"><img class="resImg" src="' + img + '"></div></p>' +
			'<div class="mui-media-body">' +
			'<div class="listtit">' + item.article.articleTitle + '</div>' +
			'<span class="listtit">' + oName + icont + '</span>' +
			'</div></a></li>';
		table.appendChild(li, table.firstChild)
		
	});
}
