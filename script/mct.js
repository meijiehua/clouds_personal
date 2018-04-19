$(document).ready(function() {
	/*文件转码任务列表*/
	//calendar
	var mydate = new Date();
	$("#mct-filtertime01").val(getBeforeDate(7));
	$("#mct-filtertime02").val(getBeforeDate(0));
	//刷新
	$("#transcoding_refresh").click(function() {
		$(".loadBox").removeClass("hide");
		$(".MCT-table").addClass("hide");
		$.ajax({
			type: "get",
			url: "json/transcoding_list.js",
			dataType: 'json',
			success: function(data) {
				var html = template("transcoding_task", data);
				$("#transcoding_list").html(html);
				$('[data-toggle="tooltip"]').tooltip();
				$(".loadBox").addClass("hide");
				$(".MCT-table").removeClass("hide");
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("error");
				alert(XMLHttpRequest.responseText);
			},
		});
	});
	//媒体转码pagination
	var height01, height02, width;
	elementposition($(".right-service-rt").get(0), $(".table-fixed"), $(".console-title").outerWidth());
	$(window).resize(function() {
		elementposition($(".right-service-rt").get(0), $(".table-fixed"), $(".console-title").outerWidth());
	});

	function elementposition(obj1, obj2, num) {
		height01 = obj1.scrollHeight;
		height02 = $(document).height() - 50;
		if(height01 > height02) {
			obj2.css({
				"margin": " 0px",
				"z-index": "99",
				"width": num + "px",
				"position": "fixed",
				"bottom": "0",
			});
		} else {
			obj2.css({
				"margin": " -57px 0px 0px",
				"z-index": "99",
				"width": "100%",
				"position": "relative",
				"bottom": "auto"
			});
		}
	}
	//新建转码
	$("#bulit_MCt_btn").click(function() {
		$(".modal-body").html("");
		$(".modal-footer").html("");
		$(".modal-body").html(template("bulitMct", []));
		$(".modal-footer").html(template("newmct-btn", []));
		$("#myModal").show().removeClass("bs-example-modal-sm");
		$(".modal-dialog").removeClass("modal-sm");
		$("#myModalLabel").text("提交转码作业");
		$('[data-toggle="popover"]').popover({
			trigger: 'focus',
			title: "",
			html: true,
			placement: "top",
		})
	});

	var isurl = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/;
	var isname = /^[\u4e00-\u9fa5A-Za-z0-9-.@_#!*]+$/; //中英文、数字、常见字符-.@_#!*

	function ffn() {
		if($("#newmct-url01").val() !== "" && $("#newmct-name").val() !== "" && isname.test($("#newmct-name").val()) && $("#newmct-name").val().length < 64 && $("#newmct-url02").val() !== "" && isurl.test($("#newmct-url02").val())) {
			$("#mct-nxetstep").prop("disabled", false);
		} else {
			$("#mct-nxetstep").prop("disabled", true);
		}
	}
	//input file
	$("body").on("change", "#filemct", function() {
		$("#newmct-url01").val($("#filemct").val());
		ffn();
	});
	$("body").on("keyup", "#newmct-name", function() {
		if(!$(this).val()) {
			$("#output_name01").removeClass("hide").siblings().addClass("hide");
			ffn();
		} else if(!isname.test($(this).val())) {
			$("#output_name02").removeClass("hide").siblings().addClass("hide");
			ffn();
		} else if($(this).val().length > 64) {
			$("#output_name03").removeClass("hide").siblings().addClass("hide");
			ffn();
		} else {
			$("#output_name01").addClass("hide");
			$("#output_name02").addClass("hide");
			$("#output_name03").addClass("hide");
			ffn();
		}
	});
	$("body").on("keyup", "#newmct-url02", function() {
		if(!$(this).val()) {
			$("#output_url01").removeClass("hide").siblings().addClass("hide");
			ffn();
		} else if(!(isurl.test($(this).val()))) {
			$("#output_url02").removeClass("hide").siblings().addClass("hide");
			ffn();
		} else {
			$("#output_url01").addClass("hide");
			$("#output_url02").addClass("hide");
			ffn();
		}
	});
	//下一步
	var systemformat, customformat;
	$("body").on("click", "#mct-nxetstep", function() {
		console.log($("#newmct-url01").val()); //待转码文件地址
		var $option = $("#newmct-piping option:selected").val();
		console.log($option); //转码管道
		//转码模版选择
		$(".mct-step .step-first").removeClass("step-active").siblings().addClass("step-active");
		$(".newmctbtns01").addClass("hide");
		$(".newmctbtns02").removeClass("hide");
		$(".Newmct_step01").addClass("hide");
		$(".Newmct_step02").removeClass("hide");
		systemformat = $("input:radio[name=systemformat]:checked").val();
		customformat = $("input:radio[name=customformat]:checked").val();
		console.log(systemformat); //预置静态模板
		console.log(customformat); //自定义模版
	});
	//上一步
	$("body").on("click", "#mct-backstep", function() {
		$(".mct-step .step-first").addClass("step-active").siblings().removeClass("step-active");
		$(".newmctbtns01").removeClass("hide");
		$(".newmctbtns02").addClass("hide");
		$(".Newmct_step01").removeClass("hide");
		$(".Newmct_step02").addClass("hide");
	});
	$("body").on("change", "input:radio[name=systemformat]", function() {
		if($(this).is(":checked")) {
			systemformat = $(this).val();
			console.log(systemformat);
		}
	});
	$("body").on("change", "input:radio[name=customformat]", function() {
		if($(this).is(":checked")) {
			customformat = $(this).val();
			console.log(customformat);
		}
	});
	$("body").on("click", "#sys-selall", function() {
		$("input[class=check_sys]").prop("checked", $(this).prop("checked"));
		aler_err($("input[class^=check_]:checked"));
	});
	$("body").on("click", "#cust-selall", function() {
		$("input[class=check_cust]").prop("checked", $(this).prop("checked"));
		aler_err($("input[class^=check_]:checked"));
	});
	$("body").on("change", "input[class^=check_]", function() {
		aler_err($("input[class^=check_]:checked"));
	});
	$("body").on("change", "input[class=check_sys]", function() {
		if(!$(this).is(':checked')) $("#sys-selall").prop("checked", false);
		var flag01 = true;
		$("input[class=check_sys]").each(function(index, ele) {
			if(!$(ele).is(':checked')) {
				flag01 = false;
				return;
			}
		});
		if(flag01) $("#sys-selall").prop("checked", true);
	})
	$("body").on("change", "input[class=check_cust]", function() {
		if(!$(this).is(':checked')) $("#cust-selall").prop("checked", false);
		var flag02 = true;
		$("input[class=check_cust]").each(function(index, ele) {
			if(!$(ele).is(':checked')) {
				flag02 = false;
				return;
			}
		});
		if(flag02) $("#cust-selall").prop("checked", true);
	})

	function aler_err(obj) {
		var $length = obj.length;
		if($length <= 0) {
			$("#mct-transcode").prop("disabled", true);
		} else if($length > 1) {
			$(".btnerr").removeClass("hide");
			$("#mct-transcode").prop("disabled", true);
		} else {
			console.log(obj.prop("value"));
			if(!$("#enable").is(":checked")) $("#mct-transcode").prop("disabled", false);
			$(".btnerr").addClass("hide");
		}
	}
	//使用水印
	$("body").on("click", "#enable", function() {
		if($(this).is(":checked")) {
			$(".newmct-watermark-temp").removeClass("hide");
			$("#mct-transcode").prop("disabled", true);
			$("body").on("keyup", "#newmct-watermark-url", function() {
				var $val = $(this).val();
				if($val == "") {
					$("#newmct-watermark-url-err01").removeClass("hide").siblings().addClass("hide");
				} else if(!(isurl.test($val))) {
					$("#newmct-watermark-url-err02").removeClass("hide").siblings().addClass("hide");
				} else {
					$("#newmct-watermark-url-err01").addClass("hide");
					$("#newmct-watermark-url-err02").addClass("hide");
					$("#mct-transcode").prop("disabled", false);
					console.log($val) //水印图片地址
				}
			});
		} else {
			if($("input[class^=check_]:checked").length == 1) $("#mct-transcode").prop("disabled", false);
			$(".newmct-watermark-temp").addClass("hide");
		}
	});

	//转码
	$("body").on("click", "#mct-transcode", function() {
		var optval = $("#newmct-watermark-template option:selected").val();
		console.log(optval);
		console.log("转码");
		systemformat = $("input:radio[name=systemformat]:checked").val();
		customformat = $("input:radio[name=customformat]:checked").val();
		$('#myModal').modal('hide');
		mcttip("已成功添加到任务列表中！");
	});

	/*转码详情*/
	var $url = "http://mymediabucket.oss-cn-beijing.aliyuncs.com/Act-ss-m3u8-hd/359b8c58976d405caf4f6870eb00f464/movi.m3u8?Expires=1512472595&amp;OSSAccessKeyId=TMP.AQG7OZSK4dZwYNyrdmTEV7AsdlWqeP6c3EZkpOFC45bWg1OV2i_IHS9KMz79ADAtAhUA7C9k-h6MxpWTgegYZWuNjZZEGaMCFD40KuMdVN9bkUgvNnIZGLzD98tu&amp;Signature=BMf8%2FQz0cgYx%2BqgslVSTOwwHtFQ%3D";
	var data = {
		isAdmin: true,
		"url": $url,
	};
	$(".mts-detail-copy").click(function() {
		$(".modal-body").html("");
		$("#myModal").show().removeClass("bs-example-modal-sm");
		$(".modal-dialog").removeClass("modal-sm");
		$("#myModalLabel").text("获取地址");
		var html = template('transcodingcopy', data);
		$(".modal-body").html(html);
	});

	/*媒体库*/
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
	$(".mac-start").val(getBeforeDate(7));
	$(".mac-end").val(getBeforeDate(0));
	// 播放预览
	$(".Play_box-header .close").click(function() {
		$(".tankuang_marsk").hide();
		$(".Play_box").removeClass("on");
	});
	$(".live-name a").click(function() {
		$(".tankuang_marsk").show();
		$(".Play_box").addClass("on");
		var oTxt = $(this).parent().text();
		$(".Play_box-title").text(oTxt);
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
	//删除
	$(".operation-del").click(function() {
			$(".operation-del").removeAttr("value");
			$(this).attr("value", "this");
			$(".modal-body").html("");
			$("#myModal").show().removeClass("bs-example-modal-sm");
			$(".modal-dialog").removeClass("modal-sm");
			$(".modal-footer").show();
			$("#myModalLabel").text("删除媒体");
			var oname = $(this).parent().siblings(".live-name").text();
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
		var oname = $(this).parent().siblings(".live-name").text();
		if(otext == "取消发布") {
			$("#myModalLabel").text("撤销发布媒体");
			var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要取消发布媒体' + oname + '吗？</p></div>');
			$(".modal-body").append(odiv);
		} else {
			$("#myModalLabel").text("发布媒体");
			var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要发布媒体' + oname + '吗？</p></div>');
			$(".modal-body").append(odiv);
		}
	});
	/*媒体库上传视频*/
	//第一步
	$("#library_upload").click(function() {
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
	$("#library_close1").click(function() {
		$(".tankuang_marsk").hide();
		$(".bulit-step01.tankuang").animate({
			top: '-800px',
			opacity: '0'
		}, 360);
	});
	$(".library_sel li:first").trigger("click");
	$(".library_sel li").click(function() {
		var dataVal = $(this).attr("value");
		if(dataVal == "0") $("#library_nextstep").prop("disabled", true);
		else $("#library_nextstep").prop("disabled", false);
	});
	//第二步
	$("#library_nextstep").click(function() {
		$(".bulit-step01.tankuang").css("display", "none").animate({
			top: '-800px',
			opacity: '0'
		}, 360);
		$(".bulit-step02.tankuang").css("display", "block");
	});
	$("#library_close2").click(function() {
		$(".tankuang_marsk").hide();
		$(".bulit-step01.tankuang").css("display", "block");
		$(".bulit-step02.tankuang").animate({
			top: '-800px',
			opacity: '0'
		}, 360);
	});
	/*媒体库设置*/
	$('#mctsetuptab a[data-toggle="tab"]').on("shown.bs.tab", function(e) {
		elementposition($(".right-service-rt").get(0), $(".table-fixed"), $(".console-title").outerWidth());
		$(window).resize(function() {
			elementposition($(".right-service-rt").get(0), $(".table-fixed"), $(".console-title").outerWidth());
		});
	});
	//启用
	$(".mctsetup_enable").click(function() {
			$(".mctsetup_enable").removeAttr("value");
			$(this).attr("value", "enable");
			$(".modal-body").html("");
			$("#myModal").show().removeClass("bs-example-modal-sm");
			$(".modal-dialog").removeClass("modal-sm");
			$(".modal-footer").show();
			var otext = $(this).text();
			var oname = $(this).parent().siblings(".title-column").find("strong").text();
			if(otext == "启用") {
				$("#myModalLabel").text("启用工作流");
				var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要启用工作流: ' + oname + '吗？</p></div>');
				$(".modal-body").append(odiv);
			} else {
				$("#myModalLabel").text("停用工作流");
				var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要停用工作流:' + oname + '吗？</p></div>');
				$(".modal-body").append(odiv);
			}
		}) //删除
	$(".mctsp_delate").click(function() {
		$(".mctsetup_enable").removeAttr("value");
		$(this).attr("value", "delate");
		$(".modal-body").html("");
		$("#myModal").show().removeClass("bs-example-modal-sm");
		$(".modal-dialog").removeClass("modal-sm");
		$(".modal-footer").show();
		$("#myModalLabel").text("删除工作流");
		var oname = $(this).parent().parent().siblings(".title-column").find("strong").text();
		var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要删除工作流:' + oname + '吗？</p></div>');
		$(".modal-body").append(odiv);
	});

	/*新建工作流*/
	var isname01 = /^[\u4e00-\u9fa5A-Za-z0-9-.%_]+$/; //中英文数字及-.%_
	if($("#bulitflow_name").val() && isname01.test($("#bulitflow_name").val()) && $("#bulitflow_name").val().length < 128) $("#flow_next").prop("disabled", false);
	$("#bulitflow_name").keyup(function() {
		if($(this).val() && isname01.test($(this).val()) && $(this).val().length < 128) $("#flow_next").prop("disabled", false);
		else $("#flow_next").prop("disabled", true);
	});
	//拓扑结构 输入--编辑
	$("body").on("click", ".workflow-input", function() {
			$(".modal-body").html("");
			$(".modal-title").text("输入");
			$(".modal-body").html(template("flow_input", []));
			$(".modal-footer .btn-primary").on("click", function() {
				var inputurl = $(".flowinput_url").val();
				var flowpiping = $("#flow_piping option:selected").text();
				console.log(inputurl + ":" + flowpiping);
				$('#myModal').modal('hide');
				$(".modal-footer .btn-primary").off("click");
			});
		})
		//拓扑结构 转码－－编辑
	var isname02 = /[`~  !@#$%^&*()+=|{}':;',\\.<>/?~！@＃¥％&＊（）｛｝［］：“”‘’？，。、－——＝＋｜]/; //特殊字符
	$("body").on("click", ".work-transcode", function() {
		var trans_edit = $(this);
		$(".modal-body").html("");
		$(".modal-title").text("转码");
		$(".modal-body").html(template("flow-transcode", []));
		$(".modal-footer .btn-primary").prop("disabled", true);
		$("#myModal .modal-footer .btn-primary").attr("id", "flow_ok");
		$("#flow_name").keyup(function() {
			if(!$(this).val() || isname02.test($("#flow_name").val())) $("#flow_name_error").removeClass("hide");
			else $("#flow_name_error").addClass("hide");
		});
		$("#flow_url").keyup(function() {
			if(!$(this).val()) $("#flow_url_error1").removeClass("hide").siblings().addClass("hide");
			else if(!isurl.test($("#flow_url").val())) $("#flow_url_error2").removeClass("hide").siblings().addClass("hide");
			else $("#flow_url_error1,#flow_url_error2").addClass("hide");
		});
		//确定
		$("#flow_ok").on("click", function() {
			var flowedit_flag = 0;
			$("#flow_trans").find("small").each(function(index, ele) {
				if(!$(ele).hasClass("hide")) flowedit_flag++;
			});
			if(flowedit_flag != 0) return;
			else {
				var flow_masksel = $("#flow_masksel option:selected").text();
				console.log($("#flow_tmp").val());
				console.log(flow_masksel);
				$('#myModal').modal('hide');
				$(".modal-footer .btn-primary").off("click");
			}
		});
		//遍历配置方案选项，给其转码初始值
		var workconfig = $("#flow_config option:selected").val();
		switch(workconfig) {
			case "0":
				var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly value="M3U8切片" style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
				$("#flow_label").after($div);
				$("#flow_ok").prop("disabled", false);
				break;
			case "1":
				break;
			case "2":
				var $node = trans_edit.parent().parent();
				var index = $("#col-1").find(".node.Transcode").index($node);
				if(index == "0") var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly value="M3U8-流畅" style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
				else if(index == "1") var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly value="MP4-标清" style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
				else var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly value="FLV-高清" style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
				$("#flow_label").after($div);
				$("#flow_ok").prop("disabled", false);
				break;
			case "3":
				var $node = trans_edit.parent().parent();
				var index = $("#col-1").find(".node.Transcode").index($node);
				if(index == "0") var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly value="FLV-流畅" style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
				else if(index == "1") var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly value="FLV-标清" style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
				else var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly value="FLV-高清" style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
				$("#flow_label").after($div);
				$("#flow_ok").prop("disabled", false);
				break;
			case "4":
				var $node = trans_edit.parent().parent();
				var index = $("#col-1").find(".node.Transcode").index($node);
				if(index == "0") var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly value="M3U8-流畅" style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
				else if(index == "1") var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly value="M3U8-标清" style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
				else var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly value="M3U8-高清" style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
				$("#flow_label").after($div);
				$("#flow_ok").prop("disabled", false);
				break;
			case "5":
				var $node = trans_edit.parent().parent();
				var index = $("#col-1").find(".node.Transcode").index($node);
				if(index == "0") var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly value="MP4-流畅" style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
				else if(index == "1") var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly value="MP4-标清" style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
				else var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly value="MP4-高清" style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
				$("#flow_label").after($div);
				$("#flow_ok").prop("disabled", false);
				break;
			default:
				break;
		}
	});
	//拓扑结构 转码模版选择
	$("body").on("click", "#flow-template", function() {
		$("#chooseModal .modal-body").html("");
		$("#chooseModal .modal-title").text("转码模版");
		$("#chooseModal .modal-body").html(template("flow_choose", []));
		//确定
		$("#choose_primary").on("click", function() {
			$("#flow-tmp").remove();
			var template = $("input[class^=flow_]:checked").parent().siblings(".templa_name").text();
			var $div = $('<div class="col-sm-6" id="flow-tmp"><input type="text" readonly style="background-color: #EEEEEE!important;" class="form-control" id="flow_tmp"></div>');
			$("#flow_label").after($div);
			$("#flow_tmp").val(template);
			$('#chooseModal').modal('hide');
			$("#choose_primary").off("click");
			$("#myModal .modal-footer .btn-primary").prop("disabled", false);
		});
	});
	$("body").on("change", "#flowsystem-all", function() {
		$("#flowsystem-body").find(".flow_sys").prop("checked", $(this).prop("checked"));
		flowerror($("input[class^=flow_]:checked"));
	});
	$("body").on("change", "#flowcustom-all", function() {
		$("#flowcustom-body").find(".flow_cus").prop("checked", $(this).prop("checked"));
		flowerror($("input[class^=flow_]:checked"));
	});
	$("body").on("change", "input[class=flow_sys]", function() {
		if(!$(this).is(":checked")) $("#flowsystem-all").prop("checked", false);
		var flag_s = true;
		$("input[class=flow_sys]").each(function(index, ele) {
			if(!$(ele).is(":checked")) {
				flag_s = false;
				return;
			}
		})
		if(flag_s) $("#flowsystem-all").prop("checked", true);
	});
	$("body").on("change", "input[class=flow_cus]", function() {
		if(!$(this).is(":checked")) $("#flowcustom-all").prop("checked", false);
		var flag_s = true;
		$("input[class=flow_cus]").each(function(index, ele) {
			if(!$(ele).is(":checked")) {
				flag_s = false;
				return;
			}
		})
		if(flag_s) $("#flowcustom-all").prop("checked", true);
	});
	$("body").on("change", "input[class^=flow_]", function() {
		flowerror($("input[class^=flow_]:checked"));
		if($("input[class^=flow_]:checked").length == 1) $("#choose_primary").prop("disabled", false);
		else $("#choose_primary").prop("disabled", true);
	});

	function flowerror(obj) {
		var wlength = obj.length;
		if(wlength > 1) {
			$("#chooseModal").find(".btnerr").removeClass("hide");
		} else {
			$("#chooseModal").find(".btnerr").addClass("hide");
		}
	}
	//拓扑结构 截图--编辑
	var isname03 = /^\w+$/; //由数字、26个英文字母或者下划线组成的字符串
	$("body").on("click", ".work-snapshot", function() {
		$(".modal-body").html("");
		$(".modal-title").text("截图");
		$(".modal-body").html(template("flow_snapshot", []));
		$(".modal-footer .btn-primary").prop("disabled", true);
		var hourdata, mindata, secdata;
		for(var i = 0; i < 24; i++) {
			if(i < 10) i = "0" + i;
			$("#flow_hour").append("<option value='" + i + "'>" + i + "</option>");
		}
		for(var i = 0; i < 60; i++) {
			if(i < 10) i = "0" + i;
			$("#flow_min").append("<option value='" + i + "'>" + i + "</option>");
		}
		for(var i = 0; i < 60; i++) {
			if(i < 10) i = "0" + i;
			$("#flow_sec").append("<option value='" + i + "'>" + i + "</option>");
		}
		$("#flow_sec").find("option[value='01']").prop("selected", true);
		$("#work_sanpname").keyup(function() {
			if(!$(this).val()) $("#worksanpname_error").removeClass("hide");
			else if(!isname03.test($(this).val())) $("#worksanpname_error").removeClass("hide");
			else $("#worksanpname_error").addClass("hide");
			inputeach();
		});
		$("#work_sanpurl").keyup(function() {
			if(!$(this).val()) $("#worksanpurl_error1").removeClass("hide").siblings().addClass("hide");
			else if(!isurl.test($(this).val())) $("#worksanpurl_error2").removeClass("hide").siblings().addClass("hide");
			else $("#worksanpurl_error1,#worksanpurl_error2").addClass("hide");
			inputeach();
		});
		$("#work_width").keyup(function() {
			var workwidth = $(this).val();
			comparison(workwidth, $("#workwidth"));
			inputeach();
		});
		$("#work_height").keyup(function() {
			var workheight = $(this).val();
			comparison(workheight, $("#workheight"));
			inputeach();
		});
		$(".modal-footer .btn-primary").on("click", function() {
			var work_screenshot = $("#work_screenshot option:selected").text();
			console.log($("#flow_cover").prop("checked")); //封面开关是否开启
			console.log($("#flow-key").prop("checked")); //关键帧开关是否开启
			$('#myModal').modal('hide');
			$(".modal-footer .btn-primary").off("click");
		});
		//遍历配置方案选项，给其截图初始值
		var workconfig = $("#flow_config option:selected").val();
		switch(workconfig) {
			case "0":
				$("#flow_cover").prop("checked", true);
				$("#flow_sec").find("option[value='01']").prop("selected", true);
				break;
			case "1":
				$("#flow_cover").prop("checked", true);
				$("#flow_sec").find("option[value='01']").prop("selected", true);
				break;
			case "2":
				$("#flow_cover").prop("checked", true);
				$("#flow_sec").find("option[value='01']").prop("selected", true);
				break;
			case "3":
				$("#flow_cover").prop("checked", true);
				$("#flow_sec").find("option[value='01']").prop("selected", true);
				break;
			case "4":
				$("#flow_cover").prop("checked", true);
				$("#flow_sec").find("option[value='01']").prop("selected", true);
				break;
			case "5":
				$("#flow_cover").prop("checked", true);
				$("#flow_sec").find("option[value='01']").prop("selected", true);
				break;
			default:
				break;
		}
	});

	var isnumber =/^([1-9]\d*|[0]{0,1})$/; //匹配非负整数（正整数 + 0）
	function comparison(num, obj) {
		if(isnumber.test(num)) {
			if(num < 8 || num > 4096) obj.removeClass("hide");
			else obj.addClass("hide");
		} else obj.removeClass("hide");
	}

	function inputeach() {
		var worksanph = 0;
		$("#worksanph").find("small").each(function(index, ele) {
			if(!$(ele).hasClass("hide")) worksanph++;
		});
		if(worksanph == 0 && $("#work_sanpname").val() && $("#work_sanpurl").val() && $("#work_width").val() && $("#work_height").val()) $(".modal-footer .btn-primary").prop("disabled", false);
	}
	//拓扑结构 完成--编辑
	$("body").on("click", ".workflow-complete", function() {
		$(".modal-body").html("");
		$(".modal-title").text("完成");
		$(".modal-body").html(template("flow_complete", []));
		$(".modal-footer .btn-primary").on("click", function() {
			var oval = $("input[name=flow_type]:checked").val();
			$('#myModal').modal('hide');
			$(".modal-footer .btn-primary").off("click");
		});
	});
	//新建工作流 下一步
	$("#flow_next").click(function() {
		if($("#col-1").length == 1) {
			$(".flow-step .step-first").removeClass("step-active").siblings().addClass("step-active");
			$(".workflow-con").addClass("hide").siblings(".workflow-done").removeClass("hide");
		} else {
			$("#myModal").modal("show");
			$(".modal-body").html("");
			$(".modal-title").text("新建工作流");
			var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">请添加工作流活动节点</p></div>');
			$(".modal-body").append(odiv);
			$(".modal-footer .btn-primary").on("click", function() {
				$('#myModal').modal('hide');
				$(".modal-footer .btn-primary").off("click");
			});
		}
	});
	//执行实例
	$("#flowSelection").click(function() {
		$(this).next().toggleClass("hide");
		$(this).find("i").toggleClass("bgar");
	});
	$(".listheader li").click(function() {
		var $i = $(".listheader").find("i");
		$(".listheader").find("h3").empty().append($i);
		$i.before($(this).html());
		$(this).parent().addClass("hide");
		$(this).addClass("current").siblings().removeClass("current");
		$(".loadBox").removeClass("hide");
		$(".MCT-table").addClass("hide");
		$.ajax({
			type: "get",
			url: "json/MCTsetup_case.js",
			dataType: "json",
			success: function(data) {
				var html = template("MCT_case", data);
				$("#MCTcase_body").html(html);
				$(".loadBox").addClass("hide");
				$(".MCT-table").removeClass("hide");
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("error");
				alert(XMLHttpRequest.responseText);
			},
		});
	});

	/*全局设置*/
	//转码模版
	//新建转码模版
	var mcttrasname, mcttrfile;
	$("#Mtranscod").click(function() {
		$(".modal-body").html("");
		$(".modal-title").text("添加转码模版");
		$(".modal-body").html(template("bulitMtranscode", []));
		$(".modal-footer").html(template("modal_footer"), []);
		$(".modal-footer .btn-primary").attr("id", "mcttrade01");
		var mtrarr = [
			"<ul><li>1.只能包含中英文、数字、_-.%</li><li>2.转码模板名称长度限制在128个字节之内</li></ul>",
			"<p>码率大小限制在［10,50000]</p>", "<p>码率质量控制因子大小限制在[0,51],非必填项,填写后码率的设置失效</p>", "<p>视频原始宽度限制在[128,4096]</p>", "<p>视频原始高度限制在[128,4096]</p>", "<p>帧率大小限制在(0,60]</p>", "<p>关键帧间最大帧数限制在[1,100000]</p>", "<p>缓冲区大小限制在[1000,128000]</p>", "<p>视频码率峰值限制在[10,50000]</p>",
			"<p>音频码率限制在[8,1000]</p>",
			"<p>分片时长限制在[1,60]</p>"
		];
		poco($("#mcttranpage"), mtrarr);
	});
	$("body").on("keyup", "#mctnam", function() {
		if(!$(this).val()) $("#mctnamerr01").removeClass("hide").siblings().addClass("hide");
		else if(!isname01.test($(this).val())) $("#mctnamerr02").removeClass("hide").siblings().addClass("hide");
		else if($(this).val().length > 128) $("#mctnamerr03").removeClass("hide").siblings().addClass("hide");
		else {
			$("#mctnamerr01,#mctnamerr02,#mctnamerr03").addClass("hide");
			$("#mcttrade01").prop("disabled", false);
		}
	});
	//1th 确定
	$("body").on("click", "#mcttrade01", function() {
		mcttrasname = $("#mctnam").val();
		mcttrfile = $("#trasde_format option:selected").val();
		$(".mcttranpage01").addClass("hide").next().removeClass("hide");
		$(".mcttranstep .step-first").removeClass("step-active").addClass("step-pas").next().addClass("step-active");
		$(".modal_footer02").removeClass("hide").siblings().addClass("hide");
		$(".modal_footer02 .btn-default.backstep").attr("id", "mctback01");
		$(".modal_footer02 .btn-primary").attr("id", "mcttrade02");
	});
	// 2th 上一步
	$("body").on("click", "#mctback01", function() {
		$(".mcttranpage01").removeClass("hide").next().addClass("hide");
		$(".mcttranstep .step-first").addClass("step-active").removeClass("step-pas").next().removeClass("step-active");
		$(".modal_footer01").removeClass("hide").siblings().addClass("hide");
	});
	// 2th 确定
	$("body").on("click", "#mcttrade02", function() {
		$(".mcttranpage02").addClass("hide").next().removeClass("hide");
		$(".mcttranstep .step").eq(1).removeClass("step-active").addClass("step-pas").next().addClass("step-active");
		$(".modal_footer03").removeClass("hide").siblings().addClass("hide");
		$(".modal_footer03 .btn-default.backstep").attr("id", "mctback02");
		$(".modal_footer03 .btn-primary").attr("id", "mcttrade03");
	});
	// 3th 上一步
	$("body").on("click", "#mctback02", function() {
		$(".mcttranpage02").removeClass("hide").next().addClass("hide");
		$(".mcttranstep .step").eq(1).addClass("step-active").removeClass("step-pas").next().removeClass("step-active");
		$(".modal_footer02").removeClass("hide").siblings().addClass("hide");
	});
	// 3th  确定
	$("body").on("click", "#mcttrade03", function() {
		$(".mcttranpage03").addClass("hide").next().removeClass("hide");
		$(".mcttranstep .step").eq(2).removeClass("step-active").addClass("step-pas").next().addClass("step-active");
		$(".modal_footer04").removeClass("hide").siblings().addClass("hide");
		$(".modal_footer04 .btn-default.backstep").attr("id", "mctback03");
		$(".modal_footer04 .btn-primary").attr("id", "mcttrade04");
	});
	// 4th  取消
	$("body").on("click", "#mctback03", function() {
		$(".mcttranpage03").removeClass("hide").next().addClass("hide");
		$(".mcttranstep .step").eq(2).addClass("step-active").removeClass("step-pas").next().removeClass("step-active");
		$(".modal_footer03").removeClass("hide").siblings().addClass("hide");
	});
	// 4th  确定
	$("body").on("click", "#mcttrade04", function() {
		$(".mcttranpage04").addClass("hide").next().removeClass("hide");
		$(".mcttranstep .step").eq(3).removeClass("step-active").addClass("step-pas").next().addClass("step-active");
		$(".modal_footer05").removeClass("hide").siblings().addClass("hide");
		$(".modal_footer05 .btn-default.backstep").attr("id", "mctback04");
		$(".modal_footer05 .btn-primary").attr("id", "mcttradend");
	});
	// 5th 上一步
	$("body").on("click", "#mctback04", function() {
		$(".mcttranpage04").removeClass("hide").next().addClass("hide");
		$(".mcttranstep .step").eq(3).addClass("step-active").removeClass("step-pas").next().removeClass("step-active");
		$(".modal_footer04").removeClass("hide").siblings().addClass("hide");
	});
	//5th 确定
	$("body").on("click", "#mcttradend", function() {
		var txt = $(".modal-header .modal-title").text();
		if(txt == "添加转码模版") {
			ergodic("自定义模版添加成功！");
		} else {
			ergodic("自定义模版编辑成功并保存！");
		}
	});

	function ergodic(str) {
		var temp_falsg = true;
		$("#mcttranpage small").each(function(index, ele) {
			if(!$(ele).hasClass("hide")) temp_falsg = false;
		});
		if(temp_falsg) {
			mcttip(str);
			$('#myModal').modal('hide');
			console.log("submit");
		} else {
			layer.msg('参数配置错误', {
				time: 2000,
			})
			$('#myModal').modal('hide');
		}
	}

	//禁用视频
	$("body").on("click", "#forbidVideo", function() {
		if($(this).is(":checked")) $(".mcttranpage02").find("fieldset").attr("disabled", true);
		else $(".mcttranpage02").find("fieldset").attr("disabled", false);
	});
	$("body").on("click", "#forbidAudio", function() {
		if($(this).is(":checked")) $(".mcttranpage03").find("fieldset").attr("disabled", true);
		else $(".mcttranpage03").find("fieldset").attr("disabled", false);
	});
	//匹配输入框的值
	$("body").on("keyup", "#videobitrate", function() {
		inputoption($(this).val(), $("#videobitraterror"), 10, 50000);
	});
	$("body").on("keyup", "#transcrf", function() {
		inputoption($(this).val(), $("#transcrferror"), 0, 51);
	});
	$("body").on("keyup", "#transtmpwidth", function() {
		inputoption($(this).val(), $("#transtmpwidtherror"), 128, 4096);
	});
	$("body").on("keyup", "#transtmpheight", function() {
		inputoption($(this).val(), $("#transtmpheighterro"), 128, 4096);
	});
	$("body").on("keyup", "#transtmpfps", function() {
		inputoption($(this).val(), $("#transtmpfpserr"), 0, 60);
	});
	$("body").on("keyup", "#transtmpgop", function() {
		inputoption($(this).val(), $("#transtmpgoperr"), 1, 100000);
	});
	$("body").on("keyup", "#videobufsize", function() {
		inputoption($(this).val(), $("#videobufsizeerr"), 1000, 128000);
	});
	$("body").on("keyup", "#videomaxrate", function() {
		inputoption($(this).val(), $("#videomaxrateerr"), 10, 50000);
	});
	$("body").on("keyup", "#videobufsize", function() {
		inputoption($(this).val(), $("#videobufsizeerr"), 1000, 50000);
	});
	$("body").on("keyup", "#videomaxrate", function() {
		inputoption($(this).val(), $("#videomaxrateerr"), 10, 100000);
	});
	$("body").on("keyup", "#audiobitrate", function() {
		inputoption($(this).val(), $("#audiobitrateerr"), 8, 1000);
	});
	$("body").on("keyup", "#segmentDuration", function() {
		inputoption($(this).val(), $("#segmentDurationerr"), 1, 60);
	});
	//检查视频分辨率 
	$("body").on("click", "#showResoConfig", function() {
		if($(this).is(":checked")) $(this).after(template("mcttraode_res", []));
		else $("div").remove(".showResoConfig");
		var arr01 = ["<p>如果输入分辨率小于转码模板设定的分辨率，则不转码，提交的转码任务会提示转码失败。</p>", "<p>如果输入分辨率小于转码模板设定的分辨率，则按照视频输入分辨率转码。</p>"];
		popovercon($(".showResoConfig"), arr01);
	});
	//检查视频码率: 
	$("body").on("click", "#showVideoBitrateConfig", function() {
		if($(this).is(":checked")) $(this).after(template("mcttraode_video", []));
		else $("div").remove(".showVideoConfig");
		var arr02 = ["<p>如果视频输入码率小于转码模板设定的码率，则不转码，提交的转码任务会提示转码失败。</p>", "<p>如果视频输入码率小于转码模板设定的码率，则按照视频输入码率转码。</p>"];
		popovercon($(".showVideoConfig"), arr02);
	});
	//检查音频码率: 
	$("body").on("click", "#showAudioBitrateConfig", function() {
		if($(this).is(":checked")) $(this).after(template("mcttraode_audio", []));
		else $("div").remove(".showAudioConfig");
		var arr03 = ["<p>如果音频输入码率小于转码模板设定的码率，则不转码，提交的转码任务会提示转码失败。</p>", "<p>如果音频输入码率小于转码模板设定的码率，则按照音频输入码率转码。</p>"];
		popovercon($(".showAudioConfig"), arr03);
	});
	//编辑转码模版  
	$("body").on("click", ".Mtrastempedit", function() {
		$(".modal-body").html("");
		$(".modal-title").text("编辑转码模版");
		$(".modal-body").html(template("bulitMtranscode", []));
		$(".modal-footer").html(template("modal_footer"), []);
		$(".modal-footer .btn-primary").attr("id", "mcttrade01");
		var mtrarr = [
			"<ul><li>1.只能包含中英文、数字、_-.%</li><li>2.转码模板名称长度限制在128个字节之内</li></ul>",
			"<p>码率大小限制在［10,50000]</p>", "<p>码率质量控制因子大小限制在[0,51],非必填项,填写后码率的设置失效</p>", "<p>视频原始宽度限制在[128,4096]</p>", "<p>视频原始高度限制在[128,4096]</p>", "<p>帧率大小限制在(0,60]</p>", "<p>关键帧间最大帧数限制在[1,100000]</p>", "<p>缓冲区大小限制在[1000,128000]</p>", "<p>视频码率峰值限制在[10,50000]</p>",
			"<p>音频码率限制在[8,1000]</p>",
			"<p>分片时长限制在[1,60]</p>"
		];
		poco($("#mcttranpage"), mtrarr);
	});
	//删除转码模版
	$("body").on("click", ".Mtrastempdel", function() {
		var ele = $(this);
		$(".modal-body").html("");
		$(".modal-title").text("删除");
		$(".modal-footer").html(template("modal_footer01"), []);
		$(".modal-footer").html(template("modal_footer01"), []);
		$(".modal-footer .btn-primary").prop("disabled", false);
		var oname = ele.parent().siblings(".mcttrastempname").text();
		var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要删除自定义模版 <b>' + oname + '</b> 吗？</p></div>');
		$(".modal-body").append(odiv);
		$(".modal-footer .btn-primary").on("click", function() {
			ele.parent().parent().remove();
			$('#myModal').modal('hide');
			$(".modal-footer .btn-primary").off("click");
		});
	});

	//新建水印模版
	var isnumber01 = /\b0(\.\d{1,4})\b/; //0-1小数点4位的浮点数
	$("#buMwater").click(function() {
		$(".moda l-body").html("");
		$(".modal-title").text("添加水印模版");
		$(".modal-body").html(template("bulitMwater", []));
		$(".modal-footer").html(template("modal_footer01"), []);
		$(".modal-footer .btn-primary").attr("id", "mwartmar");
		var poarr = ["<ul><li>1.只能包含中英文、数字、_-.%</li><li>2.水印模板名称长度限制在128个字节之内</li></ul>", "<ul><li>1.整数型代表水印图片宽的像素值，限制在[8,4096]px</li><li>2.小数型代表相对输出视频分辨率宽的比率，限制在(0,1)，支持4位小数</li></ul>", "<ul><li>1.整数型代表水印图片宽的像素值，限制在[8,4096]px</li><li>2.小数型代表相对输出视频分辨率宽的比率，限制在(0,1)，支持4位小数</li></ul>", "<ul><li>1.整数型代表偏移像素，限制在[0,4096]px</li><li>2.小数型代表水平偏移量与输出分辨率宽的比率，限制在(0,1)，支持4位小数</li></ul>", "<ul><li>1.整数型代表偏移像素，限制在[0,4096]px</li><li>2.小数型代表垂直偏移量与输出分辨率高的比率，限制在(0,1)，支持4位小数</li></ul>"];
		poco($("#Mwaterform"), poarr);
		mwarter();

	});
	//新建水印模版 确定
	$("body").on("click", "#mwartmar", function() {
		var mwart_flag = false;
		$("#Mwaterform small").each(function(index, ele) {
			if(!$(ele).hasClass("hide")) mwart_flag = true;
		});
		if(mwart_flag) return;
		else {
			var mwaterid, mwatername, mwaterwidth, mwaterheight, mwaterposition, mwaterlevel, mwatervertical;
			mwaterid = getRandom(100000);
			mwatername = $("#Mwatername").val();
			mwaterwidth = $("#Mwaterwidth").val();
			mwaterheight = $("#Mwaterheight").val();
			mwaterposition = $("#Mwaterposition option:selected").text();
			mwaterlevel = $("#Mwaterlevel").val();
			mwatervertical = $("#Mwatervertical").val();
			var $tr = $('<tr><td>' + mwaterid + '</td><td class="mctwarname">' + mwatername + '</td><td><ul><li>宽度：：<span class="mctwarw">' + mwaterwidth + '</span> px</li><li>高度：<span class="mctwarh">' + mwaterheight + '</span> px</li></ul></td><td><ul><li>位置：' + mwaterposition + '</li><li>水平位置：<span class="mctwarlev">' + mwaterlevel + '</span> px</li><li>垂直位置：<span class="mctwarvert">' + mwatervertical + '</span> px</li></ul></td><td class="text-right"><a href="javascript:" class="Mwateredit" data-toggle="modal" data-target="#myModal">编辑</a><span class="text-explode">|</span><a href="javascript:" class="Mwaterdel" data-toggle="modal" data-target="#myModal">删除</a></td></tr>');
			$("#Mwaterbod").prepend($tr);
			mcttip("自定义水印模版添加成功！");
			$('#myModal').modal('hide');
		}
	});
	//编辑水印模版
	$("body").on("click", ".Mwateredit", function() {
		$(".modal-body").html("");
		$(".modal-title").text("编辑水印模版");
		$(".modal-body").html(template("bulitMwater", []));
		$(".modal-footer").html(template("modal_footer01"), []);
		$(".modal-footer .btn-primary").attr("id", "mwartmar_edit");
		$("#mwartmar_edit").prop("disabled", false);
		var poarr = ["<ul><li>1.只能包含中英文、数字、_-.%</li><li>2.水印模板名称长度限制在128个字节之内</li></ul>", "<ul><li>1.整数型代表水印图片宽的像素值，限制在[8,4096]px</li><li>2.小数型代表相对输出视频分辨率宽的比率，限制在(0,1)，支持4位小数</li></ul>", "<ul><li>1.整数型代表水印图片宽的像素值，限制在[8,4096]px</li><li>2.小数型代表相对输出视频分辨率宽的比率，限制在(0,1)，支持4位小数</li></ul>", "<ul><li>1.整数型代表偏移像素，限制在[0,4096]px</li><li>2.小数型代表水平偏移量与输出分辨率宽的比率，限制在(0,1)，支持4位小数</li></ul>", "<ul><li>1.整数型代表偏移像素，限制在[0,4096]px</li><li>2.小数型代表垂直偏移量与输出分辨率高的比率，限制在(0,1)，支持4位小数</li></ul>"];
		poco($("#Mwaterform"), poarr);
		mwarter();
	});
	//编辑水印 确定
	$("body").on("click", "#mwartmar_edit", function() {
		var mwart_flag = false;
		$("#Mwaterform small").each(function(index, ele) {
			if(!$(ele).hasClass("hide")) mwart_flag = true;
		});
		if(mwart_flag) return;
		else {
			mcttip("自定义水印模版编辑并保存成功！");
			$('#myModal').modal('hide');
		}
	});

	function poco(obj, arr) {
		var poarr = ["<ul><li>1.只能包含中英文、数字、_-.%</li><li>2.水印模板名称长度限制在128个字节之内</li></ul>", "<ul><li>1.整数型代表水印图片宽的像素值，限制在[8,4096]px</li><li>2.小数型代表相对输出视频分辨率宽的比率，限制在(0,1)，支持4位小数</li></ul>", "<ul><li>1.整数型代表水印图片宽的像素值，限制在[8,4096]px</li><li>2.小数型代表相对输出视频分辨率宽的比率，限制在(0,1)，支持4位小数</li></ul>", "<ul><li>1.整数型代表偏移像素，限制在[0,4096]px</li><li>2.小数型代表水平偏移量与输出分辨率宽的比率，限制在(0,1)，支持4位小数</li></ul>", "<ul><li>1.整数型代表偏移像素，限制在[0,4096]px</li><li>2.小数型代表垂直偏移量与输出分辨率高的比率，限制在(0,1)，支持4位小数</li></ul>"];
		obj.find("input[data-toggle=popover]").each(function(index) {
			var ele = $(this);
			ele.popover({
				trigger: "manual",
				placement: "top",
				html: 'true',
				content: arr[index],
			}).on("focus", function() {
				var _this = this;
				$(this).popover("show");
				$(this).siblings(".popover").on("blur", function() {
					$(_this).popover('hide');
				});
			}).on("blur", function() {
				var _this = this;
				setTimeout(function() {
					if(!$(".popover:focus").length) {
						$(_this).popover("hide");
					}
				}, 100);
			});
		});
	}

	function mwarter() {
		$("#Mwatername").keyup(function() {
			if(!$(this).val()) $("#Mnamerr01").removeClass("hide").siblings().addClass("hide");
			else if(!isname01.test($(this).val())) $("#Mnamerr02").removeClass("hide").siblings().addClass("hide");
			else if($(this).val().length > 128) $("#Mnamerr03").removeClass("hide").siblings().addClass("hide");
			else {
				$("#Mnamerr01,#Mnamerr02,#Mnamerr03").addClass("hide");
				$("#mwartmar").prop("disabled", false);
			}
		});
		$("#Mwaterwidth").keyup(function() {
			var mwm_w = $(this).val();
			matchingwidth(mwm_w, $("#Mwaterwierr"), 8, 4096);
		});
		$("#Mwaterheight").keyup(function() {
			var mwm_h = $(this).val();
			matchingwidth(mwm_h, $("#Mwaterhigerr"), 8, 4096);
		});
		$("#Mwaterlevel").keyup(function() {
			var mwm_lev = $(this).val();
			matchingwidth(mwm_lev, $("#Mwaterleverr"), 0, 4096);
		});
		$("#Mwatervertical").keyup(function() {
			var mwm_ver = $(this).val();
			matchingwidth(mwm_ver, $("#Mwatervererr"), 0, 4096);
		});
	}

	function matchingwidth(num, obj, minnum, maxnum) {
		if(num) {
			if(isnumber.test(num)) {
				if(num < minnum || num > 4096) obj.removeClass("hide");
				else obj.addClass("hide");
			} else if(isnumber01.test(num)) obj.addClass("hide");
			else obj.removeClass("hide");
		}else obj.addClass("hide");
	}
	$("body").on("click", ".Mwaterdel", function() {
		var ele = $(this);
		$(".modal-body").html("");
		$(".modal-title").text("删除");
		$(".modal-footer").html(template("modal_footer01"), []);
		$(".modal-footer").html(template("modal_footer01"), []);
		$(".modal-footer .btn-primary").prop("disabled", false);
		var oname = ele.parent().siblings().find(".mctwarname").text();
		var odiv = $('<div><span class="iconfont icon-jinggao1" style="color:#F90;font-size: 45px;display: inline-block;vertical-align: middle;"></span><p style="display: inline-block;margin: 6px 10px 0px;font-size: 12px;vertical-align: middle;">您确定要删除水印模版 <b>' + oname + '</b> 吗？</p></div>');
		$(".modal-body").append(odiv);
		$(".modal-footer .btn-primary").on("click", function() {
			ele.parent().parent().remove();
			$('#myModal').modal('hide');
			$(".modal-footer .btn-primary").off("click");
		});
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
		} else if($("#myModalLabel").text() == "启用工作流") {
			//启用工作流
			$("a.mctsetup_enable[value='enable']").parent().siblings(".mctst_enable").text("启用");
			$("a.mctsetup_enable[value='enable']").text("停用");
			$("a.mctsetup_enable[value='enable']").siblings(".mctsp_see").removeClass("hide").siblings(".inline-block").addClass("hide");
		} else if($("#myModalLabel").text() == "停用工作流") {
			//停用工作流
			$("a.mctsetup_enable[value='enable']").parent().siblings(".mctst_enable").text("停用");
			$("a.mctsetup_enable[value='enable']").text("启用");
			$("a.mctsetup_enable[value='enable']").siblings(".mctsp_see").addClass("hide").siblings(".inline-block").removeClass("hide");
		} else if($("#myModalLabel").text() == "删除工作流") {
			//删除工作流
			$("a.mctsp_delate[value='delate']").parents("tr").remove();
		} else {
			return;
		}
		$('#myModal').modal('hide')
	});

})

function mcttip(str) {
	var tipdiv = $('<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + str + '</div>');
	$(".growl").append(tipdiv).addClass("on");
	setTimeout(function() {
		$(".growl").empty(tipdiv).removeClass("on");
	}, 2000);
}

function getRandom(n) {
	return Math.floor(Math.random() * n)
}

function popovercon(obj, arr) {
	obj.find("[data-toggle=popover]").each(function(index) {
		$(this).popover({
			trigger: "hover",
			placement: "top",
			html: 'true',
			content: arr[index]
		});
	});
}
var isnumber02 = /^([1-9]\d*|[0]{1,1})$/; //整数、0

function inputoption(num, obj, min, max) {
	if(num) {
		if(!isnumber02.test(num)) obj.removeClass("hide");
		else {
			if(num < min || num > max) obj.removeClass("hide");
			else obj.addClass("hide");
		}
	}else obj.addClass("hide");
}