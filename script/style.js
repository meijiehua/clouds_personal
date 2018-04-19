$(function() {
	//topbar
	$(".navbar-mystyle li.pro_ser").hover(function() {
		$(this).find(".mystyle-color").css("backgroundColor", "#293033");
	}, function() {
		$(this).find(".mystyle-color").css("backgroundColor", "#373D41");
	});
	$("li.user-nam").hover(function() {
		$(".user_cen").addClass("show")
	}, function() {
		$(".user_cen").removeClass("show")
	});
	/*左侧导航栏缩进功能*/
	if($(".left-main").hasClass("left-off")) {
		$(".subNavBox li a span.sublist-icon").on({
			mouseenter: function() {
				$(this).siblings(".Ttitle").fadeIn("fast");
			},
			mouseleave: function() {
				$(this).siblings(".Ttitle").fadeOut("fast");
			}
		});
	};
	$(".left-main .sidebar-fold").click(function() {
		if($(this).parent().attr('class') == "left-main left-full") {
			$(this).parent().removeClass("left-full");
			$(this).parent().addClass("left-off");
			$(this).parent().parent().find(".right-product").removeClass("right-full");
			$(this).parent().parent().find(".right-product").addClass("right-off");
			$(this).find("span.icon").removeClass("icon-iconfont03").addClass("icon-menu");
			$(".subNavBox li a span.sublist-icon").on({
				mouseenter: function() {
					$(this).siblings(".Ttitle").fadeIn("fast");
				},
				mouseleave: function() {
					$(this).siblings(".Ttitle").fadeOut("fast");
				}
			});
		} else {
			$(this).parent().removeClass("left-off");
			$(this).parent().addClass("left-full");
			$(this).parent().parent().find(".right-product").removeClass("right-off");
			$(this).parent().parent().find(".right-product").addClass("right-full");
			$(this).find("span.icon").removeClass("icon-menu").addClass("icon-iconfont03");
			$(".subNavBox li a span.sublist-icon").off("mouseenter mouseleave");
		}
	});

	//#demo-list
	$("#demo-list li a.classa").hover(function() {
		$(this).addClass("navhover");
		$(this).parent().siblings().find("a.classa").removeClass("navhover");
		if($(this).parent().has("ul")) {
			$(this).parent().find("li a").removeClass("navhover")
		}
	}, function() {
		$("#demo-list li a").removeClass("navhover")
	});
	$("a.classb").hover(function() {
		$(this).parents("li").children("a.classa").removeClass("navhover");
		$(this).parent().siblings().find("a.classb").removeClass("navhover");
		if(!$(this).parent().hasClass("on")) {
			$(this).addClass("navhover");
		}
	}, function() {
		$("a.classb").removeClass("navhover")
	});

});

//
function displaynavbar(obj) {
	if($(obj).hasClass("dislpayArrow_1")) {
		$(obj).removeClass("dislpayArrow_1");
		$("body").removeClass("big-page");
	} else {
		$(obj).addClass("dislpayArrow_1");
		$("body").addClass("big-page");
	}
}
//
function getBeforeDate(n) {
	var n = n;
	var d = new Date();
	var year = d.getFullYear();
	var mon = d.getMonth() + 1;
	var day = d.getDate();
	if(day <= n) {
		if(mon > 1) {
			mon = mon - 1;
		} else {
			year = year - 1;
			mon = 12;
		}
	}
	d.setDate(d.getDate() - n);
	year = d.getFullYear();
	mon = d.getMonth() + 1;
	day = d.getDate();
	s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
	return s;
}