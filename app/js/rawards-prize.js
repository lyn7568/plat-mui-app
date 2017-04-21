var table2 = document.getElementById("table2");
var aflas2 = false;
var lasttime;
var userId;
mui.plusReady(function() {
	userId = plus.storage.getItem('userid');
	setFractionFun(userId);
})

mui.init({
	pullRefresh: {
		container: '#rawardsSet2',
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh,
		}
	}
});

function pullupRefresh() {
	aflas2 = true;
	lasttime = table2.getElementsByTagName("li").length;
	setTimeout(function() {
		setFractionFun(userId);
		mui('#rawardsSet2').pullRefresh().endPulldownToRefresh();
	}, 1000);
}

/*获得积分*/
function setFractionFun(userId) {
	if(aflas2 == true) {
		var offset = lasttime;
	} else {
		var offset = 0;
	}
	mui.ajax(baseUrl + "/ajax/growth/queryInvite", {
		dataType: 'json', //数据格式类型
		type: 'GET', //http请求类型
		timeout: 10000, //超时设置
		data: {
			"professorId": userId,
			"offset": offset,
			"rows": 20
		},
		success: function(data) {
			if(aflas2 == true) {
				if(data.success && data.data != '') {
					var datalist = data.data;
					datalistEach(datalist);
					//alert(data.data.length)
					if(data.data.length <= 20) {
						mui('#rawardsSet2').pullRefresh().endPullupToRefresh(false);
					} else {
						mui('#rawardsSet2').pullRefresh().endPullupToRefresh(true);
					}
				} else {
					mui('#rawardsSet2').pullRefresh().endPullupToRefresh(true);
				}
			} else {
				if(data.success && data.data != '') {
					console.log(JSON.stringify(data))
					var datalist = data.data;
					datalistEach(datalist);
					if(data.data.length <= 20) {
						mui('#rawardsSet2').pullRefresh().endPullupToRefresh(false);
					} else {
						mui('#rawardsSet2').pullRefresh().endPullupToRefresh(true);
					}
				} else {
					mui('#rawardsSet2').pullRefresh().disablePullupToRefresh();
					document.getElementById("nojl").classList.remove("displayNone");
				}
			}
		},
		error: function() {
			plus.nativeUI.toast("服务器链接超时", toastStyle);
			return;
		}
	});
}

/*奖励积分数据遍历*/
function datalistEach(datalist) {
	mui.each(datalist, function(index, item) {
		var inviteUser = item.inviteUser;
		mui.ajax(baseUrl + "/ajax/professor/editBaseInfo/" + inviteUser, {
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000, //超时设置
			//async: false,
			success: function(data) {
				if(data.success && data.data) {
					var $info = data.data || {};
					var Name = $info.name;
					var userType = autho($info.authType, $info.orgAuth, $info.authStatus);
					if($info.hasHeadImage == 1) {
						var mun = Math.round(Math.random() * 99 + 1);
						var userImg = '<img src="' + baseUrl + '/images/head/' + $info.id + '_l.jpg?' + mun + '"/>';
					} else {
						var userImg = '<img src="../images/default-photo.jpg"/>';
					}
					var li = document.createElement('li');
					li.className = 'mui-table-view-cell';
					li.innerHTML = '<div class="flexCenter rewardWhy">' +
						'<div class="userImg userRadius">' + userImg + '</div>' +
						'<div class="userInfo"><p class="h1Font positionR"><span>' + Name + '</span><em class="authicon ' + userType.sty + '"></em></p></div>' +
						'</div><span class="rewardCount">' + item.score + '分</span></li>';
					table2.appendChild(li, table2.firstChild);
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				return;
			}
		});

	});
}