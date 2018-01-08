	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			up: {
				height: 50,
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			},
			down: {
				auto:true,
				callback: pulldownRefresh
			}
		}
	});
	var Num=1,rows=2,time="",id="";
	function pulldownRefresh() {
		setTimeout(function() {
//			demandOnePase();
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		}, 1500);
	}
	function pullupRefresh() {
		
		setTimeout(function() {
			myConList(time,id);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
		}, 1500);
	
	}
	
	mui.plusReady(function() {
		myConList();
		mui("#questList").on("tap", "li", function() {
			var id = this.getAttribute("data-id");
			plus.nativeUI.showWaiting();
			plus.webview.create("../html/qa-question-show.html", 'qa-question-show.html', {}, {
				quid: id
			});
		})
	})
	function myConList(time,id) {
		mui.plusReady(function() {
			mui.ajax(baseUrl + '/ajax/question', {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				data: {
//					"time":time,
//					"id": id,
//					"rows": rows
				},
				success: function(data) {
					if(data.success) {
						var $info = data.data;
						console.log(JSON.stringify(data))
						if($info.length > 0){
							time = res.data[res.data.length-1].createTime;
							id = res.data[res.data.length-1].id;
							for(var i = 0; i < $info.length; i++) {
								var liStr=document.createElement("li");
								liStr.className="mui-table-view-cell";
								liStr.setAttribute( "data-id",$info[i].id);
								document.getElementById("questList").appendChild(liStr);
								myConHtml($info[i],liStr);
							}
						}
//						if(pageNo < Math.ceil(data.data.total / data.data.pageSize)) {
//							mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); /*能上拉*/
//						} else {
//							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
//						}
					}
				}
			});
		})
	}
	function myConHtml($data,liStr) {
		var baImg = "../images/default-q&a.jpg";
		if(dataStr.img) {
			baImg = baseUrl + dataStr.img;
		}
		var hd = "";
		if(dataStr.replyCount > 0) {
			hd = '<span>' + dataStr.replyCount + ' 回答</span>'
		}
		liStr.className = "mui-table-view-cell";
		liStr.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
			'<div class="madiaHead qa-Head" style="background-image:url(' + baImg + ')"></div>' +
			'<div class="madiaInfo OmadiaInfo">' +
			'<p class="mui-ellipsis-2 h1Font">' + dataStr.title + '</p>' +
			'<p class="show-item mui-ellipsis h2Font">' + hd + '<span>N 关注</span></p>' +
			'</div></div>'
			
	}

	
