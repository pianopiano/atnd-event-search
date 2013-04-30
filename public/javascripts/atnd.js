(function(){
	"use strict";
	$(function(){
		var $win=$(window),
			$ww=$win.width(),
			$events=$('#events'),
			$navi=$('#navigation'),
			$header=$('#header'),
			ym=201305,
			count=100,
			num=0,
			chkvalue="",
			flag=false,
			loaded=false,
			jsonData,
			checked='HTML5,CSS3,Javascript,jQuery,wordpress,flash,three.js,CoffeeScript,node.js,MongoDB,php5,CreateJS,TypeScript,iphone,git,unity,heroku,kinect,AWS',
			yearVal,
			monthVal,
			ym=getDate();
		
		
		init();
		function init() {
			$win.resize(onResizeHandler);
			$navi.css({'top': '-500px'}).hide();
			$header.css({'top':$win.height()/2-50+'px','left':$win.width()/2-90+'px','width':'180px'});
			$('#search').hide();
			setWidth();
			loadEvent();
			logoAnimate();
			setSelect();
		};
		
		window.onload = function() {
			$navi.show();
			onResizeHandler();
			addEvents();
			$('#search').delay(500).fadeIn(500);
			$header.animate({'top':'0px','left':'0px','width':'100%'},500,'easeOutExpo');
			$events.masonry({itemSelector: ".event"});
			loaded=true;
		};
		
		function setSelect() {
			var f2 = document.getElementById("form2")
			,	date=new Date();
			selectChecker(f2.elements["year"], date.getFullYear());
			selectChecker(f2.elements["month"], date.getMonth() +1);
		};
		
		function selectChecker(obj,val){
			for(var i=0;i<obj.length;i++){
				if(obj[i].value==val){
					obj[i].selected=true;
					break;
				}
			}
		};
		
		function logoAnimate() {
			var txt = $('h1').text().split(''),
				str='',
				i,
				n=0;
		    for (i=0;i<txt.length;i++) {str += '<span class=char'+i+'>'+txt[i]+'</span>';};
		    $('h1').html(str);
		    setInterval(function(){		    	
			    $('span').css({'color': '#d7d4cd'});
			    $('.char'+n).css({'color': '#aa0000'})
			    n++;
			    if(n==10)n=0;
		    } , 200);
		};
		
		function onResizeHandler() {setWidth();}
		function onLoadBtnClickHandler() {
			num = 0;
	        chkvalue = "";
	        for(var i=0; i<document.form1.category.length; i++){
	            if(document.form1.category[i].checked)	{
	                chkvalue += document.form1.category[i].value+",";
	                num++; 
	            };
	        };
	        checked=chkvalue;
	        
		    var yVal = document.getElementById('year').options.item(document.getElementById('year').selectedIndex).value;
		    var mVal = document.getElementById('month').options.item(document.getElementById('month').selectedIndex).value;
			ym=parseInt(yVal.toString()+mVal.toString());
	        $events.empty();
			loadEvent()
		};
		
		$.easing.easeOutExpo = function(x, t, b, c, d) {
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		};
		
		function loadEvent() {
			checked.slice(checked.length,1);
			$.ajax({
				type: "GET",
				url: "http://api.atnd.org/events/",
				data: "ym="+ym+"&count="+100+"&keyword_or="+checked+"&format=jsonp",
				cache : true,
				dataType: "jsonp",
				success: function(jsonp) {
					jsonData=jsonp;
					count=jsonData.events.length;
				},complete: function(){
					checked = '';
					if(loaded) {
						startEvents()
					} else {
						setTimeout(startEvents, 500);
					}
				}
			});
		};
		
		function startEvents() {
			buildEvents(jsonData);
			$events.masonry('destroy');
			$events.masonry({itemSelector: ".event"});
		};
		
		function buildEvents(jsonp) {
			count = jsonp.events.length;
			for (var i = 0; i < count; i++) {
				$events.append(
					'<div class="event article">'+
						'<div class="title">'+
							'<a href="'+jsonp.events[i].event_url+'" target="_blank" "><strong>'+jsonp.events[i].title+'</strong></a>'+
						'</div>'+
					'<p class="catch"><strong>'+jsonp.events[i].catch+'</strong></p>'+
					'<strong>'+ jsonp.events[i].started_at.split('T')[0].replace(/-/g, "/")+
					'　　参加状況 - '+jsonp.events[i].accepted+' / '+jsonp.events[i].limit+'人</strong>'+
					'<br />'+jsonp.events[i].address+'</div>'
				);
			};
			
		};
					
		function addEvents() {
			$('#search').click(function() {$navi.animate({'top': '0'}, 500, 'swing');});
		    $('#all').click(allChange);
		    $('.category1 div').click(function(){
			    var elem = document.getElementsByName("category");
		        elem[parseInt($(this).attr('id'))].checked = !elem[parseInt($(this).attr('id'))].checked;
		    });
		    
			$(document).on('mouseover', '.article', function(e) {
				$(this).css({'color':'#aa0000'}).find('p').css({'color':'#aa0000'}).end().find('a').css({'color':'#aa0000'}).end().css({
					'-webkit-border-top-left-radius':'0px',
					'-moz-border-radius-topleft':'0px',
					'-webkit-border-bottom-right-radius':'0px',
					'-moz-border-radius-bottomright':'0px',
					'-webkit-border-top-right-radius':'20px',
					'-moz-border-radius-topright':'20px',
					'-webkit-border-bottom-left-radius':'20px',
					'-moz-border-radius-bottomleft':'20px',
					'box-shadow':'3px 3px 3px #999'
				});
				return false;
			}).on('mouseout', '.article', function() {
				$(this).css({'color':'#454545'}).find('p').css({'color':'#454545'}).end().find('a').css({'color':'#454545'}).end().css({
					'-webkit-border-top-left-radius':'20px',
					'-moz-border-radius-topleft':'20px',
					'-webkit-border-bottom-right-radius':'20px',
					'-moz-border-radius-bottomright':'20px',
					'-webkit-border-top-right-radius':'0px',
					'-moz-border-radius-topright':'0px',
					'-webkit-border-bottom-left-radius':'0px',
					'-moz-border-radius-bottomleft':'0px',
					'box-shadow':'1px 1px 2px #aaa'
				});
				return false;
			}).on('click', '.article', function(){
				var href = $(this).find('a').attr('href');
				window.open(href, null)
			});
			
			$('#load').on('click', function(){
				onLoadBtnClickHandler();
				backClickHandler();
			});
			
			$('#backBtn').on('click', function(){
				backClickHandler();
			});
			
		};
		
	    function allChange(){
	        flag = !flag;
	        var elem = document.getElementsByName("category");
	        for(var i = 0; i < elem.length; i++){
	            elem[i].checked = flag;
	        };
	    };

		function backClickHandler() {
			$navi.animate({'top': '-500px'}, 500, 'swing');
		};

		function setWidth() {
			$ww = $win.width();
			if (($ww >= 1200)) {
				$events.width(1200)
			} else if (($ww < 1200) && ($ww > 960)) {
				$events.width(960);
			} else if (($ww < 950) && ($ww > 720)) {
				$events.width(720);
			} else if (($ww < 720) && ($ww > 490)) {
				$events.width(490);
			} else if ($ww < 480) {
				$events.width(200);
			} else {};
			$('#btnContainer').width($events.width());
		};
		
		function getDate(){
			var _date=new Object()
			,	d=new Date();
			_date.year=(d.getYear() < 2000) ? d.getYear()+1900 : d.getYear();
			_date.month=d.getMonth() + 1;
			if (_date.month.toString().length==1){_date.month = '0' + _date.month.toString();};
			yearVal = _date.year;
			monthVal = _date.month;
			return yearVal+monthVal;
		};
		return this;
	});
})();