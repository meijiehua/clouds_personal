layui.use('layer', function() {
	var $ = layui.jquery,
		layer = layui.layer;
})
var uPattern = /^[a-zA-Z]\w*$/;
var isemail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
var passwordRegex = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/;
var phoneRegex = /^1(3|4|5|7|8)\d{9}$/;
var qqPattern = /^[1-9][0-9]{4,10}$/;
var age =/^[0-9]{1,2}$/;
//修改资料
$(function() {
		$("#modfiy_infor").click(function() {
			var oemail = $("#email").val();
			if(!$("#nicheng").val() || !uPattern.test($("#nicheng").val()) || $("#nicheng").val().length < 3 || $("#nicheng").val().length > 16) {
				layer.msg('用户名必须以字母开头，可包含字母，数字及下划线', {
					time:2000,
				})
				$("#nicheng").focus();
				return false;
			} else if($("#age").val() && !age.test($("#age").val())) {
				layer.msg('请输入0-99的数字', {
					time: 2000,
				})
				$("#age").focus();
				return false;
			} else if(!oemail || !(isemail.test(oemail)) || oemail.length > 26 || oemail.length < 12) {
				layer.msg('您输入邮箱不规范，请重新输入!', {
					time: 2000,
				})
				$("#email").focus();
				return false;
			} else if($("#mobile").val() && !phoneRegex.test($("#mobile").val())) {
				layer.msg('手机号码格式不对，请重新输入', {
					time: 2000,
				})
				$("#mobile").focus();
				return false;
			} else if($("#qq").val() && !qqPattern.test($("#qq").val())) {
				layer.msg('QQ号码格式不对，请重新输入', {
					time: 2000,
				})
				$("#qq").focus();
				return false;
			} else {
				$(this).attr("type", "submit");
			}
			//alert($('input[name="gender"]:checked').val()); //获取被选中Radio的Value值
		});
	})
	//修改密码
$(function() {
	$("#modfiy_pass").click(function() {
		if(!$("#oldpass").val()) {
			layer.msg('请输入旧密码', {
				time: 2000,
			})
			$("#oldpass").focus();
			return false;
		} else if(!$("#newpass").val() || !passwordRegex.test($("#newpass").val())) {
			layer.msg('新密码由6到16位的字母和数字、特殊字符组成', {
				time: 2000,
			})
			$("#newpass").focus();
			return false;
		} else if(!$("#querenpass").val() || $("#querenpass").val() !== $("#newpass").val()) {
			layer.msg('请确认新密码', {
				time: 2000,
			})
			$("#querenpass").focus();
			return false;
		} else {
			$(this).attr("type", "submit")
		}
	});
})