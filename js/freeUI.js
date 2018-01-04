var type;
var source;

function allowDrop(ev) {
	ev.preventDefault();
	source = ev.target;
}

function drag(ev) {
	type = ev.target.className.split(' ')[1];
	console.log(type);
}

function drop(ev) {
	console.log(ev.target + 'drop');
	ev.preventDefault();
	if(type == 'div') {
		var div = $(source).putDiv('default', '示例文字DIV');
		div.putDiv('coor');
	} else
		var node = $(source).put(type, 'default');

}
(function() {
	'use strict'
	//----------------数组方法--------------------
	//搜寻
	//	Array.prototype.find = function(value) {
	//		for(var i = 0; i < this.length; i++) {
	//			if(this[i] == value) return this[i];
	//		}
	//		return null;
	//	}
	//	//移除
	//	Array.prototype.remove = function(item) {
	//		for(var i = 0; i < this.length; i++) {
	//			if(this[i] == item) {
	//				this.splice(i, 1);
	//				return;
	//			}
	//		}
	//		return null;
	//	}
	var moving;
	//----------------JQ扩展--------------------	
	$.fn.extend({
		print: function(str) {
			$(this).text(str)
		},
		put: function(type, className, innerHTML) {
			if(!className) className = '';
			if(!innerHTML) innerHTML = '';
			var node = $("<" + type + "></" + type + ">");
			node.addClass(className);
			node.text(innerHTML);
			$(this).append(node);
			return node;
		},
		putDiv: function(className, innerHTML) {
			if(!className) className = '';
			if(!innerHTML) innerHTML = '';
			var div = $("<div></div>");
			div.addClass(className);
			div.text(innerHTML);
			$(this).append(div);
			return div;
		},
		putInput: function(val) {
			var input = $(this).put('input');
			input.attr('type', 'number');
			input.val(val);
		},
		putColor: function() {
			var input = $(this).put('input');
			input.attr('type', 'color');
		},
		putMenu: function(array) {
			var select_box = $(this).putDiv('select_box');
			var select = select_box.putDiv('select', 'default');
			var ul = select.put('ul', 'option');
			for(var i = 0; i < array.length; i++) {
				var option = ul.put('li', '', array[i]);
			}
		},
		getParent: function(num) {
			var parent;
			while(num--) {
				if(parent) parent = parent.parent();
				else parent = $(this).parent();
			}
			return parent;
		},
		putParam: function(area) {
			for(var i in area) {
				if($.type(area[i]) == 'object') {
					console.log(area[i]);
					var menul = $(this).putDiv('menul');
					var menu = menul.putDiv('menu ' + i, i);
					var fold = menul.putDiv('fold');
					for(var j in area[i]) {
						if($.type(area[i][j]) == 'number') {
							var menuItem = fold.putDiv('menu item ' + j, j);
							menuItem.putInput(area[i][j]);
						} else if(area[i][j] == 'color') {
							var menuItem = fold.putDiv('menu item ' + j, j);
							menuItem.putColor();
						} else {
							var menuItem = fold.putDiv('menu item ' + j, j);
							menuItem.putMenu(area[i][j]);
						}
					}
				} else {
					var menu = $(this).putDiv('menu ' + i, i);
					if($.type(area[i]) == 'number') {
						menu.putInput(area[i]);
					} else if(area[i] == 'color') {
						menu.putColor();
					} else if($.type(area[i]) == 'array') {
						menu.putMenu(area[i]);
					}
				}

			}
		}
	});

	//----------------系统流程--------------------
	$(document).ready(function() {
		$(document).on("contextmenu", function(e) {
			return false;
		});
		//----------------component--------------------	
		$('.main .item').attr({
			'draggable': 'true',
			'ondragstart': 'drag(event)'
		});
		$('.front').attr({
			'ondrop': 'drop(event)',
			'ondragover': 'allowDrop(event)'
		});
		$('.code').attr('contenteditable', 'true');
		//		$('.menu.item').hide();
		$('.tab_item').click(function() {
			$(this).addClass('active');
			$(this).siblings().removeClass('active');
			var id = $(this).index(); //当前操作的元素索引值 
			var number1 = 25 + id * 110;
			var number2 = -id * 350;
			$('.slider').animate({
				marginLeft: number1
			});
			$('.main').animate({
				marginLeft: number2
			});
		})
		//----------------preview--------------------	
		//拖拽
		$(document).mousemove(function(e) {
			if(!!this.move) {
				var posix = !document.move_target ? {
						'x': 0,
						'y': 0
					} : document.move_target.posix,
					callback = document.call_down || function() {
						$(this.move_target).css({
							'top': e.pageY - posix.y,
							'left': e.pageX - posix.x,
						});
						//						console.log($(this.move_target).position());
					};

				callback.call(this, e, posix);
				return false;
			}
		}).mouseup(function(e) {
			if(!!this.move) {
				var callback = document.call_up || function() {};
				callback.call(this, e);
				$.extend(this, {
					'move': false,
					'move_target': null,
					'call_down': false,
					'call_up': false
				});
			}
		});
		$('.front').on('mousedown', '.default', function(e) {
			//右键清除目标
			if(e.which == 3) {
				$(this).fadeOut('slow', function() {
					$(this).remove();
				});
				return false;
			}
			$('.default.active').removeClass('active');
			$(this).addClass('active');
			var $box = $(this);
			var position = $box.position();
			this.posix = {
				'x': e.pageX - position.left,
				'y': e.pageY - position.top
			};
			$.extend(document, {
				'move': true,
				'move_target': this
			});
			$box.on('mousedown', '.coor', function(e) {
				var posix = {
					'w': $box.width(),
					'h': $box.height(),
					'x': e.pageX,
					'y': e.pageY
				};
				$.extend(document, {
					'move': true,
					'call_down': function(e) {
						$box.css({
							'width': Math.max(30, e.pageX - posix.x + posix.w),
							'height': Math.max(30, e.pageY - posix.y + posix.h)
						});
					}
				});
				return false;
			});
			return false;
		})
		//控制台
		function run() {
			var text = $('.command_input').val();
			$('.command_input').val('');
			eval(text);
		}
		$('.command_input').keydown(function(e) {
			if(e.which == 13) run();
		});
		$('.command_btn').click(run);

		//双击翻转查看代码
		$('.front').dblclick(function(e) {
			var ss = $('.front').html();
			//HTML标签转义
			var a = ss.trim()
				.replace(/<div class="coor"><\/div\>/g, '')
				.replace(/style=\"(.*?)\"/g, '')
				.replace(/></g, "&gt;&#10;&lt;")
				.replace(/</g, "&#10;&lt;")
				.replace(/>/g, "&gt;&#10;&#09")
				.replace(/"/g, "&quot")
				.replace(/ /g, "&nbsp;")
			var code = $('.back').find('code').html(a);
			$('.front').css('transform', 'rotateY(180deg)');
			$('.back').css('transform', 'rotateY(0deg)');
			return false;
		});
		$('.back').dblclick(function(e) {
			$('.front').css('transform', 'rotateY(0deg)');
			$('.back').css('transform', 'rotateY(180deg)');
		});

		//----------------param--------------------	
		var param;
		$('.basic').putParam(style_basic);
		$('.advance').putParam(style_advance);
		//彻底解决冒泡问题
		$('*').on('click', function(e) {
			return false;
		})
		$('.menu').on('click', function(e) {
			$(this).siblings('.fold').slideToggle();
		})
		//Toggle下拉菜单
		var slide='down';
		$('.select').click(function() {
			if(slide=='down'){
				$(this).find('ul').slideDown();
				slide='up';
			}
			else{
				$(this).find('ul').slideUp();
				slide='down';
			}
		});
		$('li').hover(function() {
			if(moving) return;
			var active = $('.default.active');
			if(!active.length) return;
			var menu = $(this).getParent(4);
			var select_box = $(this).getParent(3);
			var select = $(this).getParent(2);
			var type = menu.attr('class').split(' ')[0];
			var name = menu.attr('class').split(' ')[1];
			var value=$(this).text();
			console.log(value);
			if(type=='menu'){
				active.css(name,value);
			}
			else{
				var style='';
				console.log('fold');
			}
		});
		$('li').click(function() {
			var ul = $(this).parent();
			ul.slideUp();
			return false;
		})
	});
}());