$(document).ready(function() {
		//vod action-toolbar
		//select
		$('[name="nice-select"]').click(function(e) {
			$('[name="nice-select"]').find('ul').hide();
			$(this).find('ul').show();
			e.stopPropagation();
		});
		$('[name="nice-select"] li').hover(function(e) {
			$(this).toggleClass('on');
			e.stopPropagation();
		});
		$('[name="nice-select"] li').click(function(e) {
			var val = $(this).text();
			var dataVal = $(this).attr("data-value");
			$(this).parents('[name="nice-select"]').find('input').val(val);
			$('[name="nice-select"] ul').hide();
			e.stopPropagation();
		});
		$(document).click(function() {
			$('[name="nice-select"] ul').hide();
		});
		//过滤搜索
		$("#filter_search li").click(function() {
			var dataVal = $(this).attr("data-value");
			$(".live_filter[data-value='" + dataVal + "']").removeClass("hide").siblings(".live_filter").addClass("hide");
		});
		//calendar
		var mydate = new Date();
		var hour = mydate.getHours();
		hour = hour < 10 ? "0" + hour : hour;
		var minutes = mydate.getMinutes();
		minutes = minutes < 10 ? "0" + minutes : minutes;
		$("#cdn-date-range-picker").val(getBeforeDate(7) + " " + hour + ":" + minutes + " - " + getBeforeDate(0) + " " + hour + ":" + minutes);
		// play vod
		$(".Play_box-header .close").click(function() {
			$(".tankuang_marsk").hide();
			$(".Play_box").removeClass("on");
		});
		$(".vod-name a").click(function() {
			$(".tankuang_marsk").show();
			$(".Play_box").addClass("on");
			var oTxt = $(this).parent().text();
			$(".Play_box-title").text(oTxt);
		});
		//连载
		$(".SErial-name").click(function() {
			if(!$(this).hasClass("on")) {
				$(this).addClass("on");
				$(this).parent().parent("tr").siblings(".Serialtr").show();
			} else {
				$(this).removeClass("on");
				$(this).parent().parent("tr").siblings(".Serialtr").hide();
			}
		});
		//缩略图
		$(".thumbnail-img").click(function() {
			$(".modal-body").html("");
			$("#myModal").show().addClass("bs-example-modal-sm");
			$(".modal-dialog").addClass("modal-sm");
			$(".modal-footer").hide();
			var otext = $(this).parent().text();
			var osrc = $(this).parent().find("img").attr("src");
			$("#myModalLabel").text(otext);
			var odiv = $("<div style='text-align:center'><img src='" + osrc + "' style='display:inline-block'></div>");
			$(".modal-body").append(odiv);
		});
		//Transcoding template
		var oName, oContainer, oCoding, oRatio, oKbps, oType, oDescribe, oDiv;
		$(".Transcoding-temp .icon-xiangqing").click(function() {
			$(".modal-body").html("");
			oName = $(this).parent().text();
			oContainer = "A-hls";
			oCoding = "HIGH";
			oRatio = "1920*1080";
			oKbps = "3500";
			oType = "系统内置";
			oDescribe = "VOD inbulit preset group,adaptive HLS";
			$("#myModal").show().removeClass("bs-example-modal-sm");
			$(".modal-dialog").removeClass("modal-sm");
			$(".modal-footer").hide();
			$("#myModalLabel").text(oName);
			oDiv = $('<div class="recoard_template-details"><ul><li><label>模板名称：</label><span>' + oName + '</span ></li><li><label>模板容器：</label><span>' + oContainer + '</span ></li><li><label>编码规格：</label><span>' + oCoding + '</span ></li><li><label>分辨率：</label><span>' + oRatio + '</span ></li><li><label>视频码率：</label><span>' + oKbps + '</span ></li><li><label>模版类型：</label><span>' + oType + '</span ></li><li><label>模版描述：</label><span>' + oDescribe + '</span ></li></ul></div>');
			$(".modal-body").append(oDiv);
		});
		//删除
		$(".operation-del").click(function() {
				$(".operation-del").removeAttr("value");
				$(this).attr("value", "this");
				$(".modal-body").html("");
				$("#myModal").show().removeClass("bs-example-modal-sm");
				$(".modal-dialog").removeClass("modal-sm");
				$(".modal-footer").show();
				$("#myModalLabel").text("删除媒体");
				var oname = $(this).parent().siblings(".vod-name").text();
				var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要删除媒体' + oname + ' 吗？</p></div>');
				$(".modal-body").append(odiv);
			})
			//发布
		$(".operation-Release").click(function() {
			$(".operation-Release").removeAttr("value");
			$(this).attr("value", "fabu");
			$(".modal-body").html("");
			$("#myModal").show().removeClass("bs-example-modal-sm");
			$(".modal-dialog").removeClass("modal-sm");
			$(".modal-footer").show();
			var otext = $(this).text();
			var oname = $(this).parent().siblings(".vod-name").text();
			if(otext == "取消发布") {
				$("#myModalLabel").text("撤销发布媒体");
				var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要撤销发布媒体' + oname + '吗？</p></div>');
				$(".modal-body").append(odiv);
			} else {
				$("#myModalLabel").text("发布媒体");
				var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要发布媒体' + oname + '吗？</p></div>');
				$(".modal-body").append(odiv);
			}
		});
		//vod share
		$(".bdsharebuttonbox").css({
			"position": "absolute",
			"z-index": "1045",
			"display": "none"
		});
		$(".share-vod").click(function(e) {
			var Lf = $(this).offset().left - 30;
			var Top = $(this).offset().top - 20;
			$(".bdsharebuttonbox").show("slow").css({
				"left": Lf,
				"top": Top
			});
			e.stopPropagation();
			$(".tankuang_marsk").show();
		});
		$(".tankuang_marsk").click(function() {
			$(".bdsharebuttonbox").hide()
			$(this).hide();
		});
		/*新建点播*/
		//第一步
		$("#builtvod").click(function() {
			$(".tankuang_marsk").show();
			$(".bulit-step01.tankuang").animate({
				top: '100px',
				opacity: '1'
			}, 360);
			$(".bulit-step02.tankuang").css("display", "none").animate({
				top: '100px',
				opacity: '1'
			}, 360);
		});
		$("#vod_step1").click(function() {
			$(".tankuang_marsk").hide();
			$(".bulit-step01.tankuang").animate({
				top: '-800px',
				opacity: '0'
			}, 360);
		});
		//分类
		var arr0 = ["理财指导", "基金", "股票"];
		var arr1 = ["书法", "艺术", "绘画"];
		var arr2 = ["摄影基础", "影视基础", "影视后期"];
		var arr3 = ["唱歌发声", "琴艺乐器", "音乐基础"];
		var arr4 = ["体育", "瑜伽", "舞蹈"];
		var oul;
		//init
		oul = $('<ul><li>' + arr0[0] + '</li><li>' + arr0[1] + '</li><li>' + arr0[2] + '</li></ul>');
		$(".two-classify.nice-select ul").remove("ul");
		$(".two-classify.nice-select").append(oul);
		$(".vodtemplate li:first,.primary-classify.nice-select li:first").trigger("click");
		$(".two-classify input").val(arr0[0]);
		$(".primary-classify li").click(function() {
			var oTitle = $(this).attr("title");
			switch(oTitle) {
				case "0":
					$(".two-classify input").val(arr0[0]);
					oul = $('<ul><li>' + arr0[0] + '</li><li>' + arr0[1] + '</li><li>' + arr0[2] + '</li></ul>');
					$(".two-classify.nice-select ul").remove("ul");
					$(".two-classify.nice-select").append(oul);
					break;
				case "1":
					$(".two-classify input").val(arr1[0]);
					oul = $('<ul><li>' + arr1[0] + '</li><li>' + arr1[1] + '</li><li>' + arr1[2] + '</li></ul>');
					$(".two-classify.nice-select ul").remove("ul");
					$(".two-classify.nice-select").append(oul);
					break;
				case "2":
					$(".two-classify input").val(arr2[0]);
					oul = $('<ul><li>' + arr2[0] + '</li><li>' + arr2[1] + '</li><li>' + arr2[2] + '</li></ul>');
					$(".two-classify.nice-select ul").remove("ul");
					$(".two-classify.nice-select").append(oul);
					break;
				case "3":
					$(".two-classify input").val(arr3[0]);
					oul = $('<ul><li>' + arr3[0] + '</li><li>' + arr3[1] + '</li><li>' + arr3[2] + '</li></ul>');
					$(".two-classify.nice-select ul").remove("ul");
					$(".two-classify.nice-select").append(oul);
					break;
				case "4":
					$(".two-classify input").val(arr4[0]);
					oul = $('<ul><li>' + arr4[0] + '</li><li>' + arr4[1] + '</li><li>' + arr4[2] + '</li></ul>');
					$(".two-classify.nice-select ul").remove("ul");
					$(".two-classify.nice-select").append(oul);
					break;
			}
		});
		$("#bulitvod-1").click(function() {
				if(!$("#ovodname").val()) {
					layer.msg('请输入点播名称', {
						time: 2000,
					})
					$("#ovodname").focus();
					return false;
				} else {
					$(".bulit-step01.tankuang").hide().animate({
						top: '-800px',
						opacity: '0'
					}, 360);
					$(".bulit-step02.tankuang").css({"display":"block","top":"100px","opacity":"1"});
				}
			})
			//第二步
		$("#vod_step2").click(function() {
			if(state_key) {
				//此时还没选择文件
				$(".tankuang_marsk").hide();
				$(".bulit-step01.tankuang").show();
				$(".bulit-step02.tankuang").animate({
					top: '-800px',
					opacity: '0'
				}, 360);
			} else {
				//此时有选择的文件
				layer.confirm('您文件还未上传成功，确定关闭吗？', {
					btn: ['确定', '取消'],
					title: "提示",
					offset: '100px',
					move: false
				}, function() {
					$(".tankuang_marsk").hide();
					$(".bulit-step01.tankuang").show().css({
						top: '100px',
						opacity: '1',
					});
					$(".bulit-step02.tankuang").delay("300").css({
						top: '-800px',
						opacity: '0'
					});
					layer.closeAll('dialog');
				}, function() {
					layer.closeAll('dialog');
					return false;
				});
			}
			state01 = false;
		});

		/*点播详情*/
		//标签
		$("#addvodlabel").click(function() {
			$(".item.input").removeClass("hidden").children("input").focus().val("");
			$(this).addClass("hidden");
		})
		var labellength = 0;
		var labelarr = [];
		var itemtxt;
		$(".item.input input").blur(function() {
			if(!$(this).val()) return;
			var labelcon = $(this).val();
			$(".clearlabel").each(function() {
				itemtxt = $(this).find("span").text();
				if(labelcon == itemtxt) {
					$("#addvodlabel").removeClass("hidden");
					$(".item.input").addClass("hidden");
					return false;
				}
			});
			if(itemtxt != labelcon) {
				labellength++;
				$(".labellength").append('<div class="item clearlabel"><i>×</i><span>' + labelcon + '</span></div>');
			}
			$("#addvodlabel").removeClass("hidden");
			$(".item.input").addClass("hidden");
			if(labellength == 8) {
				$("#addvodlabel").addClass("hidden");
				$(".item.input").addClass("hidden");
				return
			}
		})
		$(".tags-editor").on("mouseover", ".clearlabel", function() {
			$(".tags-editor .item i").css("display", "none");
			$(this).children("i").css("display", "block");
		});
		$(".tags-editor").on("mouseout", ".clearlabel", function() {
			$(".tags-editor .item i").css("display", "none");
		});
		$(".tags-editor").on("click", ".clearlabel i", function() {
			$(this).parent().remove();
			$("#addvodlabel").removeClass("hidden");
			$(".item.input").addClass("hidden");
			labellength--;
			if(labellength == 0) return;
			if(labellength < 8) {
				$("#addvodlabel").removeClass("hidden");
			}
		});
		//
		$(".defauimg li").click(function() {
			$(".cover-box li").removeClass("current-cover");
			$(this).addClass("current-cover");
		});

		//预览
		$(".vod_preview").click(function() {
			$(".modal-body").css("padding", "0px").html("");
			$("#myModal").show().removeClass("bs-example-modal-sm");
			$(".modal-dialog").removeClass("modal-sm");
			$(".modal-header,.modal-footer").hide();
			var odiv = $('<div class="player-box"><button type="button" class="player-close" onclick="vod_close();"></button><div class="prism-player" id="J_prismPlayer"></div></div>');
			//播放器盒子加在 id  为 J_prismPlayer 的div中
			$(".modal-body").append(odiv);
		});
		//删除
		$("#vod_clear,.vod_del").click(function() {
			$(".modal-body").html("");
			$("#myModal").show().removeClass("bs-example-modal-sm");
			$(".modal-dialog").removeClass("modal-sm");
			$(".modal-footer").show();
			$("#myModalLabel").text("提示");
			var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">你确定要删除该视频流吗？</p></div>');
			$(".modal-body").append(odiv);
		});
		//鼠标悬浮
		$(".play-address-style span").hover(function(e) {
			var otxt = $(this).text();
			$("#mydiv1").css({
				"display": "block",
				"left": e.clientX - 120,
				"top": e.clientY
			});
			$("#mydiv1").children("span").text(otxt)
		}, function() {
			$("#mydiv1").css("display", "none");
			$("#mydiv1").children("span").text("");
		});

		/*全局设置*/
		//设为默认模版
		$(".vod-setting-table").on("click", ".setdefault", function() {
			$(".tempdel").find(".btn-disabled").removeClass("btn-disabled").addClass("btn-delete").attr({
				"data-toggle": "modal",
				"data-target": "#myModal"
			});
			$("span.table-button-1").removeClass("table-button-1").addClass("setdefault table-hover-button").text("设为默认");
			$(this).removeClass("setdefault table-hover-button").addClass("table-button-1").text("默认");
			if(!$(this).parents("tr").hasClass("systemtemplate")) {
				$(this).parent().siblings().find(".btn-delete").removeClass("btn-delete").addClass("btn-disabled").removeAttr("data-toggle data-target");
			}
		});
		//删除
		$(".vod-setting-table").on("click", ".btn-delete", function() {
				$(".modal-body").html("");
				$("#myModal").show().removeClass("bs-example-modal-sm");
				$(".modal-dialog").removeClass("modal-sm");
				$(".modal-footer").show();
				$("#myModalLabel").text("删除提醒");
				$(".btn-delete").removeAttr("value");
				$(this).attr("value", "setup");
				var oname = $(this).parent().siblings(".templategroup-name").children("em").text();
				var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要删除“' + oname + '”模板组吗？</p></div>');
				$(".modal-body").append(odiv);
			})
			//点击编辑按钮
		var $type;
		$(".vod-edit-btn").click(function() {
			$(".templat-mask").addClass("in");
			var datavalue = $(this).attr("data-value");
			if(datavalue == "default") {
				$type = "default";
				$(".templat-modal.default").addClass("in").siblings().removeClass("in");
			} else {
				$type = "user-defined";
				$(".templat-modal.user-defined").addClass("in").siblings().removeClass("in");
			}
		});
		//用户自定义配置
		var arr0 = ["码率在400到900之间", "分辨率宽度在128到640之间", "分辨率高度在128到360之间"];
		var arr1 = ["码率在900到1500之间", "分辨率宽度在641到960之间", "分辨率高度在361到540之间"];
		var arr2 = ["码率在1500到3000之间", "分辨率宽度在961到1280之间", "分辨率高度在541到720之间"];
		var arr3 = ["码率在3000到5000之间", "分辨率宽度在1280到1920之间", "分辨率高度在721到1080之间"];
		var tooltip = [arr0, arr1, arr2, arr3];
		for(var i = 0; i < $(".user-templa").length; i++) {
			var otype = $($(".user-templa")[i]).find("td:first").attr("data-value");
			$($(".user-templa")[i]).find("td:eq(1)").find("input[type='number']").attr("data-original-title", tooltip[otype][0]);
			$($(".user-templa")[i]).find("td:eq(2)").find("input[type='number']:first").attr("data-original-title", tooltip[otype][1]);
			$($(".user-templa")[i]).find("td:eq(2)").find("input[type='number']:last").attr("data-original-title", tooltip[otype][2]);
		}
		$("[data-toggle='tooltip']").tooltip({
			placement: 'top'
		});
		$(".user-defined-table").on("focus keyup", ".rate", function() {
			borderCol($(this), $(this).val(), $(this).attr("data-original-title"))
		});
		$(".user-defined-table").on("focus keyup", ".ratio-w", function() {
			borderCol($(this), $(this).val(), $(this).attr("data-original-title"))
		});
		$(".user-defined-table").on("focus keyup", ".ratio-h", function() {
			borderCol($(this), $(this).val(), $(this).attr("data-original-title"))
		});
		//自定义模版删除
		var length;
		var deltemp = false;

		function tr_init() {
			length = $(".user-delete").length;
			if(length == 1) {
				$(".user-delete").addClass("btn-disabled");
			}
			$(".user-delete").on("click", function(e) {
				deltemp = false;
				e.preventDefault();
			});
		}
		tr_init();
		$(".user-defined-table").on("click", ".user-delete", function() {
			tr_init();
			if(length == 1) {
				deltemp = false;
				return false;
			} else {
				deltemp = true;
				$(this).parents("tr").remove();
				length = $(".user-delete").length;
				tr_init();
			}
		});
		//添加模版
		var addtemp = false;
		$(".divisiontr .user-tempadd").click(function() {
			var tempid = Math.floor((Math.random() * 100) + 1);
			var tempid01 = Math.floor((Math.random() * 200) + 1);
			var otr = $('<tr class="user-templa tempselect"><td><select class="form-control tempsel"><option value="0">流畅</option><option value="1">标清</option><option value="2">高清</option><option value="3">超清</option></select></td><td><input type="number" data-toggle="tooltip" data-trigger="focus" data-animation="true" value="400" class="form-control rate" style="width: 60px;height: 28px;"></td><td><input type="number" data-toggle="tooltip" data-trigger="focus" data-animation="true" value="640" class="form-control inline-block ratio-w" style="width:40px;height: 28px;"> x <input type="number" data-toggle="tooltip" data-trigger="focus" data-animation="true" value="360" class="form-control inline-block ratio-h" style="width:40px;height: 28px;"></td><td><select class="form-control" style="width: 120px;"><option>MP4</option><option>HLS</option></select></td><td class="text-center"><span><input type="checkbox" class="vod-checkbox" id="check_' + tempid + '"><label for="check_' + tempid + '" class="vod-checkbox-label"></label></span></td><td class="text-center"><span><input type="checkbox" class="vod-checkbox" id="check_' + tempid01 + '"><label for="check_' + tempid01 + '" class="vod-checkbox-label"></label></span></td><td><a href="#" class="user-delete anopading">删除</a></td></tr>');
			$(".divisiontr").before(otr);
			addtemp = true;
			length = $(".user-delete").length;
			if(length > 1) {
				$(".user-delete").removeClass("btn-disabled");
			}
			for(var i = 0; i < $(".user-templa.tempselect").length; i++) {
				var otype = $($(".user-templa.tempselect")[i]).find("td:first").children().val();
				$($(".user-templa.tempselect")[i]).find("td:eq(1)").find("input[type='number']").attr("data-original-title", tooltip[otype][0]);
				$($(".user-templa.tempselect")[i]).find("td:eq(2)").find("input[type='number']:first").attr("data-original-title", tooltip[otype][1]);
				$($(".user-templa.tempselect")[i]).find("td:eq(2)").find("input[type='number']:last").attr("data-original-title", tooltip[otype][2]);
			}
			$("[data-toggle='tooltip']").tooltip({
				placement: 'top'
			});
		})
		var oval = [
			[400, 640, 360],
			[900, 960, 540],
			[1500, 1280, 720],
			[3000, 1290, 1080]
		];
		$(".user-defined-table").on("change", ".tempsel", function() {
			var ovalue = $(this).find("option:selected").val();
			$(this).parents("tr").find("td:eq(1)").find("input[type='number']").val(oval[ovalue][0]);
			$(this).parents("tr").find("td:eq(2)").find("input[type='number']:first").val(oval[ovalue][1]);
			$(this).parents("tr").find("td:eq(2)").find("input[type='number']:last").val(oval[ovalue][2]);
			$(this).parents("tr").find("td:eq(1)").find("input[type='number']")[0].setAttribute("data-original-title", tooltip[ovalue][0]);
			$(this).parents("tr").find("td:eq(2)").find("input[type='number']:first")[0].setAttribute("data-original-title", tooltip[ovalue][1]);
			$(this).parents("tr").find("td:eq(2)").find("input[type='number']:last")[0].setAttribute("data-original-title", tooltip[ovalue][2]);
		});
		var flar = false;
		$(".trans-code-model input[type='checkbox']").change(function() {
			flar = true;
		})
		var tdiv = $('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button> 更新模版组成功</div>');
		//关闭编辑页面
		$(".templat-modal-header button,.templat-modal-footer .btn.btn-default").click(function() {
			if(flar == true) {
				layer.confirm('您有部分修改未保存，是否保存？', {
					btn: ['确定', '取消'], //按钮
					title: "提示",
					anim: 5,
					offset: '100px',
					move: false,
				}, function() { //确定按钮
					if($type == "default") {
						layer.closeAll('dialog');
						if($('input.system-format').prop("checked") !== true) {
							var ospan = $('<span class="errorspan"></span>');
							$(ospan).text("系统模版转码格式不能为空");
							$(".templat-modal-footer").prepend(ospan);
							setTimeout(function() {
								$(".errorspan").remove();
							}, 5000);
							return false;
						} else {
							//do something.....  保存系统模版的更改
							$(".templat-mask").removeClass("in");
							$(".templat-modal").removeClass("in");
							$(".growl").append(tdiv).addClass("on");
							setTimeout(function() {
								$(".growl").empty(tdiv).removeClass("on");
							}, 2000);
						}
					} else {
						layer.closeAll('dialog');
						//do something.....  保存自定义模版的更改
						$(".templat-mask").removeClass("in");
						$(".templat-modal").removeClass("in");
						$(".growl").append(tdiv).addClass("on");
						setTimeout(function() {
							$(".growl").empty(tdiv).removeClass("on");
						}, 2000);
					}
				}, function() { //取消按钮
					layer.closeAll('dialog');
					$(".templat-mask").removeClass("in");
					$(".templat-modal").removeClass("in");
				});
			} else if(addtemp == true) { //此时添加了自定义模版
				layer.confirm('您有部分修改未保存，是否保存？', {
					btn: ['确定', '取消'], //按钮
					title: "提示",
					anim: 5,
					offset: '100px',
					move: false,
				}, function() { //确定
					layer.closeAll('dialog');
					arrar($(".user-templa"));
					if(same_n) {
						var ospan = $('<span class="errorspan"></span>');
						$(ospan).text("同一清晰度，格式不能相同 ");
						$(".templat-modal-footer").prepend(ospan);
						setTimeout(function() {
							$(".errorspan").remove();
						}, 5000);
						return false;
					} else {
						//do something.....  保存自定义模版的更改
						$(".templat-mask").removeClass("in");
						$(".templat-modal").removeClass("in");
						$(".growl").append(tdiv).addClass("on");
						setTimeout(function() {
							$(".growl").empty(tdiv).removeClass("on");
						}, 2000);
					}
				}, function() { //取消
					layer.closeAll('dialog');
					$(".templat-mask").removeClass("in");
					$(".templat-modal").removeClass("in");
				});
			} else {
				$(".templat-mask").removeClass("in");
				$(".templat-modal").removeClass("in");
			}
		})
		$("body").on("click", ".layui-layer-close1", function() {
			layer.closeAll('dialog');
			$(".templat-mask").removeClass("in");
			$(".templat-modal").removeClass("in");
		});

		//点击编辑页面 确定按钮
		$(".templat-modal-footer .btn.btn-primary").click(function() {
			if($type == "default") { //系统模版
				if($('input.system-format').prop("checked") == true) {
					if(flar == true) { //系统模版有更改
						layer.confirm('您有部分修改未保存，是否保存？', {
							btn: ['确定', '取消'], //按钮
							title: "提示",
							anim: 5,
							offset: '100px',
							move: false,
						}, function() { //确定按钮
							layer.closeAll('dialog');
							console.log("保存");
							//do something...保存系统模版的更改
							$(".templat-mask").removeClass("in");
							$(".templat-modal").removeClass("in");
							$(".growl").append(tdiv).addClass("on");
							setTimeout(function() {
								$(".growl").empty(tdiv).removeClass("on");
							}, 2000);
						}, function() { //取消按钮
							layer.closeAll('dialog');
							console.log("不保存");
							$(".templat-mask").removeClass("in");
							$(".templat-modal").removeClass("in");
						})
					} else {
						$(".templat-mask").removeClass("in");
						$(".templat-modal").removeClass("in");
					}
				} else {
					var ospan = $('<span class="errorspan"></span>');
					$(ospan).text("系统模版转码格式不能为空");
					$(".templat-modal-footer").prepend(ospan);
					setTimeout(function() {
						$(".errorspan").remove();
					}, 5000);
					return false;
				}
			} else { //用户自定义
				if(addtemp == true) {
					arrar($(".user-templa"));
					/*var temple = "[";
					for(var i = 0; i < arr.length; i++) {
						temple += "{";
						for(var key in arr[i]) {
							temple += '"' + key + '":"' + arr[i][key] + '",';
						}
						temple = temple.substr(0, temple.length - 1);
						temple += "},";
					}
					temple = temple.substr(0, temple.length - 1);
					temple += "]";*/
					if(same_n) {
						var ospan = $('<span class="errorspan"></span>');
						$(ospan).text("同一清晰度，格式不能相同 ");
						$(".templat-modal-footer").prepend(ospan);
						setTimeout(function() {
							$(".errorspan").remove();
						}, 5000);
						return false;
					} else {
						$(".templat-mask").removeClass("in");
						$(".templat-modal").removeClass("in");
						$(".growl").append(tdiv).addClass("on");
						setTimeout(function() {
							$(".growl").empty(tdiv).removeClass("on");
						}, 2000);
					}
				} else {
					$(".templat-mask").removeClass("in");
					$(".templat-modal").removeClass("in");
				}
			}
		});
		/*水印模版*/
		//启用水印
		$(".enable-water").click(function() {
				$(".modal-body").html("");
				$("#myModal").show().removeClass("bs-example-modal-sm");
				$(".modal-dialog").removeClass("modal-sm");
				$(".modal-footer").show();
				$("#myModalLabel").text("启用水印");
				var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要开启水印功能吗?</p></div>');
				$(".modal-body").append(odiv);
			})
			//添加水印模版
		$(".add-water").click(function() {
				$(".modal-body").html("");
				$("#myModal").show().removeClass("bs-example-modal-sm").attr({
					"data-backdrop": "static",
					"data-keyboard": "false"
				});
				$(".modal-dialog").removeClass("modal-sm");
				$(".modal-footer").show();
				$("#myModalLabel").text("添加水印");
				var odiv = $('<div id="watermark"><div class="img-container clearfix"><div class="img-container-lf"><img id="img_show"></div><div class="img-container-rt" id="parameter"><ul class="posit radio"><li><label><input type="radio" value="left-top" name="position" checked>左上</label><label><input type="radio" value="right-top" name="position"e()">右上</label></li><li class="margin-top-10 margin-b2"><label><input type="radio" value="left-bottom" name="position">左下</label><label><input type="radio" value="right-bottom" name="position">右下</label></li><li class="margin-top-10">水平偏移<input type="text" value="10" id="offsetX">%</li><li class="margin-top-10">垂直偏移<input type="text" value="5" id="offsetY">%</li></ul></div></div><div class="water-file margin-top-10"><ul class="clearfix"><li><button class="btn btn-default" id="fileSelect">选择图片上传</button><input type="file" id="fileElem" class="hidden" onchange="handleFiles(this)"></li><li><p>文件格式：PNG</p><p>文件尺寸不超过500x500像素</p><p class="water-error"></p></li></ul></div></div><script>var fileSelect = document.getElementById("fileSelect"),fileElem = document.getElementById("fileElem");fileSelect.addEventListener("click", function(e) {if(fileElem) {fileElem.click();}e.preventDefault();}, false);</script>');
				$(".modal-body").append(odiv);
			})
			//设为默认水印
		$(".vod-setting-table").on("click", ".watermark-def", function() {
			$(".watermark-nodel").removeClass("watermark-nodel btn-disabled").addClass("watermark-del").attr({
				"data-toggle": "modal",
				"data-target": "#myModal"
			});
			$(".watermark-def.btn-disabled").removeClass("btn-disabled").attr({
				"data-toggle": "modal",
				"data-target": "#myModal"
			});
			$(".yesorno.text-success").removeClass("text-success").text("否");
			$(this).addClass("btn-disabled").removeAttr("data-toggle data-target");
			$(this).siblings(".watermark-del").removeClass("watermark-del").addClass("watermark-nodel btn-disabled").removeAttr("data-toggle data-target");
			$(this).parent().siblings(".yesorno").addClass("text-success").text("是");
		});
		//删除
		$(".vod-setting-table").on("click", ".watermark-del", function() {
				$(".modal-body").html("");
				$("#myModal").show().removeClass("bs-example-modal-sm");
				$(".modal-dialog").removeClass("modal-sm");
				$(".modal-footer").show();
				$("#myModalLabel").text("删除水印");
				$(".btn-delete").removeAttr("value");
				$(this).attr("value", "water");
				var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要删除该水印吗？</p></div>');
				$(".modal-body").append(odiv);
			})
			//下载设置
		var szdiv01 = $('<div class="alert alert-info alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>正在设置...</div>');
		var szdiv = $('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>设置成功...</div>');
		$("#ckbx-style-8-label").click(function() {
			if(!$("#ckbx-style-8").is(":checked")) {
				$(".setting-label").removeClass("text-muted");
				$(".growl").append(szdiv01).addClass("on");
				$(".growl01").append(szdiv).addClass("on");
				setTimeout(function() {
					$(".growl").empty(szdiv01).removeClass("on");
				}, 2000);
				setTimeout(function() {
					$(".growl01").empty(szdiv).removeClass("on");
				}, 2500);
				console.log("on");
			} else {
				$(".setting-label").addClass("text-muted");
				$(".growl").append(szdiv01).addClass("on");
				$(".growl01").append(szdiv).addClass("on");
				setTimeout(function() {
					$(".growl").empty(szdiv01).removeClass("on");
				}, 2000);
				setTimeout(function() {
					$(".growl01").empty(szdiv).removeClass("on");
				}, 2500);
				console.log("off");
			}
		});

		//点击 modal-footer btn-primary
		$(".modal-footer .btn-primary").on("click", function() {
			if($("#myModalLabel").text() == "删除媒体") {
				//删除
				$("a.operation-del[value='this']").parents("tr").remove();
			} else if($("#myModalLabel").text() == "发布媒体") {
				//发布
				$("a.operation-Release[value='fabu']").parent().siblings(".Release").text("发布");
				$("a.operation-Release[value='fabu']").text("取消发布");
			} else if($("#myModalLabel").text() == "撤销发布媒体") {
				//取消发布
				$("a.operation-Release[value='fabu']").parent().siblings(".Release").text("未发布");
				$("a.operation-Release[value='fabu']").text("发布");
			} else if($("#myModalLabel").text() == "提示") {
				//点播管理删除
				$("a.vod_del").parents("tr").remove();
				$("#vod_clearbtn").remove();
			} else if($("#myModalLabel").text() == "删除提醒") {
				//全局设置删除模版组
				$("a.btn-delete[value='setup']").parents("tr").remove();
			} else if($("#myModalLabel").text() == "启用水印") {
				layer.msg("启用水印成功", {
					icon: 1
				});
			} else if($("#myModalLabel").text() == "添加水印") {
				if(Iswater == false) {
					$(".water-error").css("display", "block").text("请先添加图片");
					return false;
				}
				//console.log("添加成功");
			} else if($("#myModalLabel").text() == "删除水印") {
				$(".watermark-del[value='water']").parents("tr").remove();
			} else {
				return;
			}
			$('#myModal').modal('hide')
		});

	})
	/*layui*/
layui.use('layer', function() {
	var $ = layui.jquery,
		layer = layui.layer;
})
var state_key = true;
var state01 = true;
window.addEventListener('message', function(e) {
	var message = e.data;
	//console.log(message);
	if(message !== "ready" || message !== "uploading" || message !== "confirm" || message !== "finish" || message !== "uploadError" || message !== "confirm") {
		state_key = false;
	} else {
		state_key = true;
	}
	if(state_key == false && state01 == true) {
		window.onbeforeunload = onbeforeunload_handler;
		//window.onunload = onunload_handler;

		function onbeforeunload_handler() {
			return "文件还未上传成功，刷新页面将不会保存，确认刷新么?";
		}
		/*function onunload_handler(){
			return "文件还未上传成功，关闭页面将不会保存，确认关闭么?";
		}*/
	}
}, false);

function vod_close() {
	$('#myModal').modal('hide')
}
//
function compare(str1, str2) {
	var arr = [];
	arr = str2.split("到");
	var min = arr[0].match(/(\d+)/g);
	var max = arr[1].match(/(\d+)/g);
	var num = Number(str1);
	console.log("min" + ":" + min);
	console.log("max" + ":" + max);
	if(num >= min && num <= max) {
		return true;
	} else {
		return false;
	}
}

function borderCol(obj, str1, str2) {
	var compar = compare(str1, str2);
	if(compar == true) {
		obj.removeClass("input-error");
	} else {
		obj.addClass("input-error");
	}
}

function comparearr(arr, filter) {
	var same = new Array();
	for(var i = 0; i < arr.length - 1; i++) {
		for(var j = i + 1; j < arr.length; j++) {
			if(arr[i].length != arr[j].length) continue;
			var number = 0;
			for(var k = 0; k < filter.length; k++) {
				if(arr[i][filter[k]] != arr[j][filter[k]]) continue;
				number++;
			}
			if(number == filter.length) {
				same.push('arr[' + i + ']=arr[' + j + ']');
			}
		}
	}
	return same.length;
}
var same_n;

function arrar(obj) {
	var arr = new Array();
	for(var i = 0; i < obj.length; i++) {
		arr[i] = new Array();
		if(!obj.eq(0).hasClass("tempselect")) {
			arr[0]['Type'] = obj.eq(0).find("td:first").attr("data-value");
		}
		arr[i]['Type'] = $(obj[i]).children('td').eq(0).children().val();
		arr[i]['Bitrate'] = $(obj[i]).children('td').eq(1).children().val();
		arr[i]['Width'] = $(obj[i]).children('td').eq(2).children('input').eq(0).val();
		arr[i]['Height'] = $(obj[i]).children('td').eq(2).children('input').eq(1).val();
		arr[i]['Container'] = $(obj[i]).children('td').eq(3).children().val();
		$(obj[i]).children('td').eq(4).children("input:checked").val() ? arr[i]['IsWaterMark'] = 1 : arr[i]['IsWaterMark'] = 0;
	}
	same_n = comparearr(arr, ['Type', 'Container']);
	return same_n;
}

var Iswater = false;

function handleFiles(fil) {
	var filePath = fil.value;
	var fileExt = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
	var imgshow = document.getElementById("img_show");
	var posradio = document.getElementsByName("position");
	var offsetW, offsetH;

	if(!checkFileExt(fileExt)) {
		document.getElementsByClassName("water-error")[0].style.display = "block";
		document.getElementsByClassName("water-error")[0].innerHTML = "文件类型错误";
		fil.value = "";
		return;
	}
	if(fil.files && fil.files[0]) {
		Iswater = true;
		var reader = new FileReader();
		reader.onload = function(theFile) {
			imgshow.src = theFile.target.result;
			var image = new Image();
			image.onload = function() {
				var imgwidth = this.width;
				var imgheight = this.height;
				if(imgwidth > 500 || imgheight > 500) {
					document.getElementsByClassName("water-error")[0].style.display = "block";
					document.getElementsByClassName("water-error")[0].innerHTML = "文件尺寸不超过500x500像素";
					return false;
				} else {
					document.getElementsByClassName("water-error")[0].style.display = "none";
					document.getElementsByClassName("water-error")[0].innerHTML = "";
					var offsetW = imgwidth * 50 / imgheight;
					var offsetH = 50;
					imgshow.style.width = offsetW + "px";
					imgshow.style.height = offsetH + "px";
					var imglf = document.getElementById("offsetX").value;
					var imgtop = document.getElementById("offsetY").value;
					var oposition = null;
					for(var i = 0; i < posradio.length; i++) {
						if(posradio[i].checked == true) {
							oposition = posradio[i].value;
						}
					}
					changestyle(imgshow,imglf,imgtop,oposition,offsetW,offsetH);
					//radio
					for(var j = 0; j < posradio.length; j++) {
						posradio[j].onchange = function() {
							var imglf = document.getElementById("offsetX").value;
							var imgtop = document.getElementById("offsetY").value;
							var oposition = null;
							for(var i = 0; i < posradio.length; i++) {
								if(posradio[i].checked == true) {
									oposition = posradio[i].value;
								}
							}
							changestyle(imgshow,imglf,imgtop,oposition,offsetW,offsetH);
						}
					}
					//offsetX
					document.getElementById("offsetX").onkeyup = function() {
						var imglf = document.getElementById("offsetX").value;
						var imgtop = document.getElementById("offsetY").value;
						var oposition = null;
						for(var i = 0; i < posradio.length; i++) {
							if(posradio[i].checked == true) {
								oposition = posradio[i].value;
							}
						}
						changestyle(imgshow,imglf,imgtop,oposition,offsetW,offsetH);
					}
						//offsetY
					document.getElementById("offsetY").onkeyup = function() {
						var imglf = document.getElementById("offsetX").value;
						var imgtop = document.getElementById("offsetY").value;
						var oposition = null;
						for(var i = 0; i < posradio.length; i++) {
							if(posradio[i].checked == true) {
								oposition = posradio[i].value;
							}
						}
						changestyle(imgshow,imglf,imgtop,oposition,offsetW,offsetH);
					}
				}
			};
			image.src = theFile.target.result;
		}
		reader.readAsDataURL(fil.files[0]);
	} else {
		imgshow.src = fil.value;
	}
}

function checkFileExt(ext) {
	if(!ext.match(/.png/i)) {
		return false;
	}
	return true;
}

function changestyle(obj,lf,top,radi,ow,oh) {
	switch(radi) {
		case "left-top":
			obj.style.left = 350 * lf / 100 + "px";
			obj.style.top = 200 * top / 100 + "px";
			break;
		case "right-top":
			obj.style.left = 350 - ow - 350 * lf / 100 + "px";
			obj.style.top = 200 * top / 100 + "px";
			break;
		case "left-bottom":
			obj.style.left = 350 * lf / 100 + "px";
			obj.style.top = 200 - oh - 200 * top / 100 + "px";
			break;
		case "right-bottom":
			obj.style.left = 350 - ow - 350 * lf / 100 + "px";
			obj.style.top = 200 - oh - 200 * top / 100 + "px";
			break;
		default:
			break;
	}
}