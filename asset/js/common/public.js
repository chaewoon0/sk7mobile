// s: 250416 top버튼
$(document).ready(function(){
	"use strict";
	var progressPath = document.querySelector('#topBtn .progress-circle path');
	var pathLength = progressPath.getTotalLength();
	progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
	progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
	progressPath.style.strokeDashoffset = pathLength;
	progressPath.getBoundingClientRect();
	progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
	var updateProgress = function () {
		var scroll = $(window).scrollTop();
		var height = $(document).height() - $(window).height();
		var progress = pathLength - (scroll * pathLength / height);
		progressPath.style.strokeDashoffset = progress;
	}
	updateProgress();
	$(window).scroll(updateProgress);
	var offset = 500;
	var duration = 550;
	jQuery(window).on('scroll', function() {
		if (jQuery(this).scrollTop() > offset) {
			jQuery('#topBtn').addClass('active-progress');
		} else {
			jQuery('#topBtn').removeClass('active-progress');
		}
	});
	jQuery('#topBtn').on('click', function(event) {
		event.preventDefault();
		jQuery('html, body').animate({scrollTop: 0}, duration);
		return false;
	})
});

// e: 250416 top버튼
	


// menu
var gnbOpen = function(o){
	"use strict";
	$('body').addClass('gnb-open');
}

var gnbClose = function(o){
	'use strict';
	$('body').removeClass('gnb-open');
	$('.btn-gnb').focus();
}

// Focus (jQuery UI :focusable required)
var focusControl = function($target) {
	'use strict';
	if ( !$target ) return false;
	$target.attr('tabindex', 0).focus().off()
		.on('keydown', ':focusable:first', function(e) {
			if ( e.keyCode === 9 && e.shiftKey ) {
				e.preventDefault();
				$target.find(':focusable:last').focus();
			}
		}).on('keydown', ':focusable:last', function(e) {
			if ( e.keyCode === 9 && !e.shiftKey ) {
				e.preventDefault();
				$target.find(':focusable:first').focus();
			}
		});
};

// tabMenuScroll
var tabMenuScroll = function(){
	"use strict";
	var $tabMenu = $('.tab-menu').not('type1');
	if(!$tabMenu.length)return false;
	$tabMenu.each(function(){
		var $this = $(this),
			$tab = $this.find('ul'),
			$currentLink = $tab.find('.active'),
			$currentBtn = $currentLink.find('.tab-btn'),
			pos = $currentBtn.offset().left,
			margin = $tab.css('margin-left').replace(/[^-\d\.]/g, '');
		$tab.scrollLeft(pos-margin,0);
	})
};

// accordionUI
var accordionUI = function() {
	"use strict";
	var $accGroup = $('[data-accordion="true"]').not('.acc-faq1');
	$accGroup.each(function(){
		var	$this = $(this),
			$item = $this.find('.acc-item');
		var $btn = $item.find('.btn-toggle').attr({
				'role': 'button',
				'title': '열기'
			}),
			$panel = $item.find('.acc-body').attr({
				'role': 'region',
				'aria-hidden': true,
				'aria-expanded': false
			}),
			$inner = $item.find('.acc-content').hide();
		if ( $item.filter('.active').length ) {
			var $itemActive = $item.filter('.active');
			$itemActive.find($btn).attr({
				'title': '닫기'
			})
			$itemActive.find($panel).attr({
				'aria-hidden': false,
				'aria-expanded': true
			});
			$itemActive.find($inner).show();
		}
		$btn.on('click', function() {
			var $this = $(this),
				$thisItem = $this.closest($item),
				$thisPanel = $thisItem.find($panel),
				$thisInner = $thisPanel.find($inner),
				contHeight = $thisInner.outerHeight();
			if ( $thisItem.hasClass('active') ) {
				$thisItem.removeClass('active');
				$this.attr({
					'title': '열기'
				})
				$thisPanel.attr({
					'aria-hidden': true,
					'aria-expanded': false
				});
				$thisInner.stop().slideUp(200);
			} else {
				$item.removeClass('active').filter($thisItem).addClass('active');
				$panel.attr({
					'aria-hidden': true,
					'aria-expanded': false
				});
				$inner.stop().slideUp(200);
				$this.attr({
					'title': '닫기'
				})
				$thisPanel.attr({
					'aria-hidden': false,
					'aria-expanded': true
				});
				$thisInner.stop().slideDown(200);
			}
		});

	})
};

var chkListUI = function () {
	"use strict";
	var $chkList = $('.chk-list');
	$chkList.each(function(){
		var $this = $(this),
			$item = $this.find('>li'),
			$btn = $this.find('.btn-toggle').attr({
				'role': 'button',
				'title': '열기'
			}),
			$cont = $this.find('.toggle-cont').attr({
				'role': 'region',
				'aria-hidden': true,
				'aria-expanded': false
			});
		$btn.on('click', function(e) {
			e.preventDefault();
			var $thisBtn = $(this),
				$thisItem = $thisBtn.closest($item),
				$thisCont = $thisItem.find($cont);
			($thisItem.hasClass('active'))
				? $thisItem.removeClass('active')
				: $thisItem.addClass('active');
			if($thisItem.is('.active')) {
				$thisBtn.attr({
					'title': '닫기'
				})
				$thisCont.stop().slideDown(200).attr({
					'aria-hidden': false,
					'aria-expanded': true
				});
			} else {
				$thisBtn.attr({
					'title': '열기'
				})
				$thisCont.stop().slideUp(200).attr({
					'aria-hidden': true,
					'aria-expanded': false
				});
			}
		})
	})
}
chkListUI();

// tabUI
var tabUI = function() {
	"use strict";
	var $tabJS = $('[data-tab="true"]');
	$tabJS.each(function(){
		var	$this = $(this),
			$item = $this.find('li'),
			$tabBtn = $this.find('[data-target]').attr({
				'role': 'button',
				'aria-selected': false
			});
		$item.filter('.active').find($tabBtn).attr('aria-selected',true);
		$tabBtn.on('click', function(e){
			var $thisBtn = $(this),
				$thisItem = $thisBtn.closest($item),
				$otherItem = $this.find($item).not($thisItem),
				$otherBtn = $thisItem.find($tabBtn).not($thisBtn),
				thisData = $thisBtn.attr('data-target'),
				$thisTg = $(thisData),
				$thisGroup = $thisTg.closest('.tab-group'),
				$thisPanel = $thisGroup.find('.tab-panel');
			e.preventDefault();
			$thisItem.addClass('active');
			$otherItem.removeClass('active');
			$thisBtn.attr('aria-selected',true);
			$otherBtn.attr('aria-selected',false);
			$thisPanel.removeClass('active')
			$thisTg.addClass('active');
		})
		if (!$item.filter('.active').length) {
			$item.eq(0).find($tabBtn).trigger('click');
		}
	})
};

function updateDonutChart(el, percent, donut) {
	per = Math.round(percent);
	if (per > 100) {
		per = 100;
	} else if (per < 0) {
		per = 0;
	}
	var deg = Math.round(360 * (per / 100));

	if (per > 50) {
		$(el + ' .pie').css('clip', 'rect(auto, auto, auto, auto)');
		$(el + ' .right-side').css('transform', 'rotate(180deg)');
	} else {
		$(el + ' .pie').css('clip', 'rect(0, 1em, 1em, 0.5em)');
		$(el + ' .right-side').css('transform', 'rotate(0deg)');
	}
	$(el + ' .pie-percent').text(percent);
	$(el + ' .left-side').css('transform', 'rotate(' + deg + 'deg)');
}

//220207 추가
function uxCloseTooltip(id) {
	$("#"+id).removeClass('active');
};


jQuery(function ($) {
	'use strict';
	var $window = $(window),
		$html = $('html'),
		$hd = $('#hd').append('<div class="gnb-bg"><span></span></div>'),
		$gnb = $('#gnb'),
		$wrap = $('#wrap').append('<div class="dim"></div>'),
		$body = $('body'),
		$quick = $('#quick'),
		winWidth = $window.width(),
		$dim = $('.dim'),
		todayCookieName = 'todayCookie',
		winWidth = $window.width(),
		winHeight = $window.height(),
		$topBanner = $('.top-banner'),
		hdHeight,topBannerHeight,
		sct, quickPos, count;
	if($quick.length) quickPos = $('#quick').offset().top;

	// Check view mode
	var viewModeCheck = function() {
		var size = 1079,
			pcClass = 'is_pc', // Default
			mobClass = 'is_mob'; // Mobile
		if ( winWidth > size ) {
			$html.removeClass(pcClass + ' ' + mobClass);
			$html.addClass(pcClass);
		}else {
			$html.removeClass(pcClass + ' ' + mobClass);
			$html.addClass(mobClass);
		}
	};
	viewModeCheck();

	// topBanner
	var topBanner = function() {
		var $btnClose = $topBanner.find('button');
		$btnClose.click(function(){
			$topBanner.hide();
			if($quick.length) quickPos = $('#quick').offset().top;
		})
	};
	topBanner();

	// Check view mode
	var hdScroll = function() {
		( sct > topBannerHeight )
			? $body.addClass('is-scroll')
			: $body.removeClass('is-scroll');
		( sct > quickPos-hdHeight )
			? $quick.addClass('is-fixed')
			: $quick.removeClass('is-fixed');
	};

	// gnbMethod
	var gnbMethod = {
		tgEl: {
			gnb: '.gnb',
			gnbList: '.gnb-list',
			gnbItem: '.gnb-item',
			gnbAnchor: '.gnb-link',
			gnbItemSub: '.gnb-sub',
			gnbBg : '.gnb-bg',
			index: 0
		},
		_init: function() {
			var tgEl = gnbMethod.tgEl;
			tgEl.$gnb = $hd.find(tgEl.gnb),
			tgEl.$gnbList = $hd.find(tgEl.gnbList),
			tgEl.$gnbItem = tgEl.$gnbList.find(tgEl.gnbItem),
			tgEl.$gnbAnchor = tgEl.$gnbList.find(tgEl.gnbAnchor),
			tgEl.$gnbItemSub = tgEl.$gnbList.find(tgEl.gnbItemsub).attr({
				'role': 'region',
				'aria-hidden': true,
				'aria-expanded': false
			}),
			tgEl.$gnbBg = $(tgEl.gnbBg);
			gnbMethod._execute();
			gnbMethod._executeMob();
		},
		_open: function(idx) {
			var tgEl = gnbMethod.tgEl;
			var tgHeight = tgEl.$gnbItem.eq(idx).find(tgEl.gnbItemSub).outerHeight();
			if ( tgEl.$gnbItem.eq(idx).find(tgEl.gnbItemSub).is(":animated") ) {
				tgEl.$gnbItem.eq(idx).find(tgEl.gnbItemSub).stop(true, true);
				return false;
			}
			if ( !tgEl.$gnbItem.eq(idx).find(tgEl.gnbItemSub).length ) return false;
			tgEl.$gnbItem.eq(idx).addClass('active');
			tgEl.$gnbItem.not(tgEl.$gnbItem.eq(idx)).removeClass('active');
			tgEl.$gnbItem.not(tgEl.$gnbItem.eq(idx)).find(tgEl.gnbItemSub).stop().hide().attr({
				'aria-hidden': true,
				'aria-expanded': false
			});
			tgEl.$gnbItem.eq(idx).find(tgEl.gnbItemSub).stop().fadeIn(100).attr({
				'aria-hidden': false,
				'aria-expanded': true
			});
			if ($html.hasClass('is_pc')) {
				tgEl.$gnbBg.css('height',tgHeight+1).stop().fadeIn(100);
			}
		},
		_close: function(idx) {
			var tgEl = gnbMethod.tgEl;
			var thisItem = tgEl.$gnbItem.eq(idx);
			if(idx==undefined) {
				tgEl.$gnbItem.removeClass('active');
				tgEl.$gnbItem.find(tgEl.gnbItemSub).stop().hide().attr({
					'aria-hidden': true,
					'aria-expanded': false
				});
			}
			if ( tgEl.$gnbItem.not(thisItem).hasClass('active').length ) {
				tgEl.$gnbItem.eq(idx).removeClass('active');
				tgEl.$gnbItem.eq(idx).find(tgEl.gnbItemSub).stop().hide().attr({
					'aria-hidden': true,
					'aria-expanded': false
				});
			}
		},
		_execute: function() {
			var tgEl = gnbMethod.tgEl;
			if($html.hasClass('is_mob')) return false;
			gnbMethod._close();
			tgEl.$gnbAnchor.on('focusin mouseenter', function() {
				if($html.hasClass('is_mob')) return false;
				tgEl.index = tgEl.$gnbAnchor.index(this);
				if ( !tgEl.$gnbItem.eq(tgEl.index).hasClass('active') ) {
					gnbMethod._open(tgEl.index);
				}
				var width = $(this).outerWidth(),
					containerWidth,
					left = $(this).offset().left;
				if( winWidth > 1120 ) {
					containerWidth = (winWidth - 1090)/2;
				} else {
					containerWidth = '50%';
				}
				$('.gnb-bar').css({
					'width' : width,
					'left' : left-containerWidth,
					'opacity' : 1
				})
			});
			tgEl.$gnb.on('mouseleave', function(e) {
				if($html.hasClass('is_mob')) return false;
				tgEl.$gnbItem.removeClass('active')
				tgEl.$gnbItem.find(tgEl.gnbItemSub).stop().hide().attr({
					'aria-hidden': true,
					'aria-expanded': false
				});
				tgEl.$gnbBg.stop().hide();
				$('.gnb-bar').css({
					'opacity' : 0
				})
			});
			$('.header-side').on('focusin', function(e) {
				if($html.hasClass('is_mob')) return false;
				tgEl.$gnbItem.removeClass('active')
				tgEl.$gnbItem.find(tgEl.gnbItemSub).stop().hide().attr({
					'aria-hidden': true,
					'aria-expanded': false
				});
				tgEl.$gnbBg.stop().hide();
				$('.gnb-bar').css({
					'opacity' : 0
				})
			});
		},
		_executeMob: function() {
			var tgEl = gnbMethod.tgEl;
			if($html.hasClass('is_pc')) return false;
			gnbMethod._close();
			tgEl.$gnbAnchor.on('click', function(e) {
				var $thisGnbSub = tgEl.$gnbItem.eq(tgEl.index).find('.gnb-sub');
				if($thisGnbSub.length>0) {
					e.preventDefault();
					tgEl.index = tgEl.$gnbAnchor.index(this);
					if ( !tgEl.$gnbItem.eq(tgEl.index).hasClass('active') ) {
						gnbMethod._open(tgEl.index);
					}
					tgEl.$gnbItem.eq(tgEl.index).find('.gnb-sub').scrollTop(0);
				}
			});
			if (!tgEl.$gnbItem.hasClass('show').length) {
				tgEl.$gnbItem.eq(0).find(tgEl.$gnbAnchor).click();
			}
		}
	};
	gnbMethod._init();

	// 231221 추가
	
	if (typeof gnbFocus === 'function') {
		var gnbFocusString = gnbFocus.toString();
	
		var searchChar = 'eq';
		
		if (gnbFocusString.indexOf(searchChar) !== -1) {

			var numbersOnly = gnbFocusString.match(/\d+/g);
			var gnbFocusNum = Number(numbersOnly);

			$(".gnb-link").eq(gnbFocusNum).closest('.gnb-item').addClass('current');
		}
	}

	// datepicker
	var datepickerScope = function(captionVal) {
		var $datepicker = $window.find('.ui-datepicker-calendar'),
			captionTxt = ( captionVal ) ? captionVal : '달력';
		$datepicker.prepend('<caption>' + captionTxt + '</caption>')
			.find('th').attr('scope', 'col');
	}
	var datepicker = {
		tgEl: {
			dpInp : '.input-date'
		},
		init: function() {
			var tgEl = datepicker.tgEl;
			tgEl.$dpInp = $wrap.find(tgEl.dpInp),
			tgEl.$dpInpFrom = tgEl.$dpInp.filter('.input-dateFrom'),
			tgEl.$dpInpTo = tgEl.$dpInp.filter('.input-dateTo'),
			tgEl.$dateWrap = tgEl.$dpInp.closest('.datePicker'),
			tgEl.$dpBtnWeek = tgEl.$dateWrap.find('.date-week'),
			tgEl.$dpBtnMonth = tgEl.$dateWrap.find('.date-month'),
			tgEl.$dpBtn3Month = tgEl.$dateWrap.find('.date-3month'),
			tgEl.$dpBtnYear = tgEl.$dateWrap.find('.date-year');
			tgEl.$dpInp.datepicker({
				dateFormat: 'yy-mm-dd',
				prevText: '이전 달',
				nextText: '다음 달',
				dayNames: ['일요일', '월요일', '화요일',
					'수요일', '목요일', '금요일', '토요일'],
				dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
				monthNames: ['01', '02', '03', '04', '05',
					'06', '07', '08', '09', '10', '11', '12'],
				yearSuffix: '.',
				showOtherMonths: true,
				showMonthAfterYear: true,
				buttonImage: '../asset/img/icon/icon_date.png',
				buttonText: '달력 보기',
				showOn: 'both',
				buttonImageOnly: true,
				beforeShow: function(event, ui) {}
			});
			datepickerScope();
			if ( tgEl.$dpInpFrom.length ) datepicker._setMinMax();
			tgEl.$dpBtnWeek.on('click', function(){
				$(this).closest(tgEl.$dateWrap).find(tgEl.$dpInpFrom).val(datepicker._getDate(0,0,-7,'-'));
				$(this).closest(tgEl.$dateWrap).find(tgEl.$dpInpTo).val(datepicker._getDate(0,0,0,'-'));
			});
			tgEl.$dpBtnMonth.on('click', function(){
				$(this).closest(tgEl.$dateWrap).find(tgEl.$dpInpFrom).val(datepicker._getDate(0,-1,0,'-'));
				$(this).closest(tgEl.$dateWrap).find(tgEl.$dpInpTo).val(datepicker._getDate(0,0,0,'-'));
			});
			tgEl.$dpBtn3Month.on('click', function(){
				$(this).closest(tgEl.$dateWrap).find(tgEl.$dpInpFrom).val(datepicker._getDate(0,-3,0,'-'));
				$(this).closest(tgEl.$dateWrap).find(tgEl.$dpInpTo).val(datepicker._getDate(0,0,0,'-'));
			});
			tgEl.$dpBtnYear.on('click', function(){
				$(this).closest(tgEl.$dateWrap).find(tgEl.$dpInpFrom).val(datepicker._getDate(-1,0,0,'-'));
				$(this).closest(tgEl.$dateWrap).find(tgEl.$dpInpTo).val(datepicker._getDate(0,0,0,'-'));
			});
		},
		_setMinMax: function() {
			var tgEl = datepicker.tgEl;
			tgEl.$dpInpFrom.on('change', function() {
				var $this = $(this),
					$tgDpInpTo = $this.closest(tgEl.$dateWrap).find(tgEl.$dpInpTo);
				$tgDpInpTo.datepicker('option', 'minDate', $this.val());
			});
			tgEl.$dpInpTo.on('change', function() {
				var $this = $(this),
					$tgDpInpFrom = $this.closest(tgEl.$dateWrap).find(tgEl.$dpInpFrom);
				$tgDpInpFrom.datepicker('option', 'maxDate', $this.val());
			});
		},
		_getDate: function(getYear, getMonth, getDay, seperator){
			var tgEl = datepicker.tgEl;
			 var gdCurDate = new Date();
			 gdCurDate.setYear( gdCurDate.getFullYear() + getYear );
			 gdCurDate.setMonth( gdCurDate.getMonth() + getMonth );
			 gdCurDate.setDate( gdCurDate.getDate() + getDay );
			 var tgYear = gdCurDate.getFullYear();
			 var tgMonth = gdCurDate.getMonth()+1;
			 var tgDay = gdCurDate.getDate();
			 tgMonth = "0" + tgMonth;
			 tgMonth = tgMonth.substring(tgMonth.length-2,tgMonth.length);
			 tgDay   = "0" + tgDay;
			 tgDay   = tgDay.substring(tgDay.length-2,tgDay.length);
			 return tgYear + seperator + tgMonth + seperator +  tgDay;
		}
	}
	datepicker.init();

	accordionUI();
	tabUI();

	// only mobile
	if ($html.hasClass('is_mob')) {
		tabMenuScroll();
	}
	var modalUI = function() {
		var $modal = $('.modal');
		$modal.on('shown.bs.modal', function (e) {
			var $this = $(this);
			focusControl($this.find('.modal-content'));
		})

		//Bootstrap multiple modal
		var count = 0; // 모달이 열릴 때 마다 count 해서  z-index값을 높여줌
		$(document).on('show.bs.modal', '.modal', function () {
			var zIndex = 1040 + (10 * count);
			$(this).css('z-index', zIndex);
			setTimeout(function() {
				$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
			}, 0);
			count = count + 1
		});
		// multiple modal Scrollbar fix
		$(document).on('hidden.bs.modal', '.modal', function () {
			$('.modal:visible').length && $(document.body).addClass('modal-open');
		});

	}
	modalUI();

	var toggleBtn = function() {
		var $toggleWrap = $('[data-toggle="buttons"]');
		$toggleWrap.each(function(){
			var $this = $(this),
				$ipt = $(this).find('input'),
				$btn = $(this).find('button');
			$ipt.on('change toggleChange', function() {
				var $label = $(this).closest('label');
				if (this.checked) {
					if($(this).is('[type="radio"]')) {
						$this.find('label').removeClass('active');
					}
					$label.addClass('active');
				}
				else {
					$label.removeClass('active')
				}
			});
			$btn.on('click', function() {
				var $this = $(this),
					$others = $btn.not($this);
				if (!$this.hasClass('active')) {
					$others.removeClass('active');
					$this.addClass('active')
				};
			})
		})
	}
	toggleBtn();

	var chkAll = function() {
		var $checkboxAll = $wrap.find('.allCheck');
		if ( !$checkboxAll.length ) {
			return false;
		}
		$checkboxAll.each(function(){
			var $this = $(this),
				thisData =  $this.data('group'),
				$checkCont = $wrap.find('.' + thisData),
				contLength = $checkCont.length;
			$this.click(function(){
				$checkCont.prop('checked', this.checked ).trigger('toggleChange');
			})
			$checkCont.click(function(){
				if ($($checkCont.filter(':checked')).length < contLength) {
					$this.prop('checked', false )
				}
				if ($($checkCont.filter(':checked')).length == contLength) {
					$this.prop('checked', true )
				}
			})
		})
	}
	chkAll();

	// form show/hide
	$('#chkAddService2_12').change(function(){
		if (this.checked) {
			$('.letterCd-wp').addClass('show');
		}
		else {
			 $('.letterCd-wp').removeClass('show');
		}
	});
	$('#chkAddService2_25').change(function(){
		if (this.checked) {
			$('.chkSpArs-wp').addClass('show');
		}
		else {
			 $('.chkSpArs-wp').removeClass('show');
		}
	});
	$('.payMthd-wp input[name="payMthd"]').on('click', function(){
		var idx = $('.payMthd-wp input:radio[name="payMthd"]').index(this);
		$('.payMthd-cont').removeClass('show').eq(idx).addClass('show');
	});
	$('.pauseAuto-wp input[name="pauseAutoYn"]').on('click', function(){
		if ($('#pauseAutoY').is(':checked')) {
			$('.pauseAutoYn-cont').removeClass('hide').addClass('show');
		}
		else {
			 $('.pauseAutoYn-cont').removeClass('show').addClass('hide');
		}
	});
	$('input[name="certMthd"]').on('click', function(){
		var idx = $('input[name="certMthd"]').index(this);
		$('.cert-cont').removeClass('show').eq(idx).addClass('show');
	});
	// 기타 입력박스 노출
	$('.form-etc').on('change reChange', function(){
		var $option = $(this).find('.etc');
		if ( $option.is(':selected') ) {
			$('.etc-text').show();
		} else {
			$('.etc-text').hide();
		}
	})
	// 고객센터 나의상담내역
	var bbsMyQna = function() {
		"use strict";
		var $bbsMyQna = $('.bbs-myQna'),
			$btn = $bbsMyQna.find('.btn-detail').attr({
				'role': 'button',
				'title': '열기'
			}),
			$item = $bbsMyQna.find('>li').not('.detail'),
			$detail = $bbsMyQna.find('.detail').attr({
				'role': 'region',
				'aria-hidden': true,
				'aria-expanded': false
			});
		if(!$bbsMyQna.length) return false;
		$btn.on('click', function(e) {
			var $this = $(this),
				$thisItem = $this.closest($item),
				$thisDetail = $thisItem.next($detail);
			e.preventDefault();
			if ( $thisDetail.hasClass('active') ) {
				$thisDetail.removeClass('active');
				$this.attr({
					'title': '열기'
				})
				$thisDetail.attr({
					'aria-hidden': true,
					'aria-expanded': false
				});
			} else {
				$detail.removeClass('active').filter($thisDetail).addClass('active');
				$detail.attr({
					'aria-hidden': true,
					'aria-expanded': false
				});
				$this.attr({
					'title': '닫기'
				})
				$thisDetail.attr({
					'aria-hidden': false,
					'aria-expanded': true
				});
			}
		});
	};
	bbsMyQna();

	var storeSwiper = new Swiper('.store-swiper', {
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		}
	});

	// 이벤트 후기
	// var reviewMore = function() {
	// 	"use strict";
	// 	var $reviewList = $('.review-view');
	// 	if (!$reviewList.length) return false;
	// 	$reviewList.each(function(){
	// 		var $this = $(this),
	// 			$item = $this.find('.review-item'),
	// 			$btn = $item.find('.btn-more');
	// 		$btn.on('click',function(e){
	// 			e.preventDefault();
	// 			var $thisItem = $(this).closest($item);
	// 			if ($thisItem.hasClass('active')) {
	// 				$thisItem.removeClass('active');
	// 				$(this).find('span').text('더보기')
	// 			} else {
	// 				$thisItem.addClass('active');
	// 				$(this).find('span').text('접기')
	// 			}
	// 		})
	// 	})
	// };
	// reviewMore();

	var uploadFile = function() {
		var fileTarget = $('.upload-file .upload-hidden'),
			filename;
		fileTarget.on('change', function(){
			// 값이 변경되면
			if(window.FileReader){ // modern browser var
				filename = $(this)[0].files[0].name;
			} else {
				// old IE var
				filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출
			}
			// 추출한 파일명 삽입
			$(this).siblings('.upload-name').val(filename);
		});
	}
	uploadFile();

	$('.modal-usimStore .btn-detail').on('click',function(){
		var $this = $(this),
			$box = $this.closest('.box');
		if ($box.hasClass('active')) {
			$box.removeClass('active');
			$this.text('지역 열기');
		} else {
			$box.addClass('active');
			$this.text('지역 닫기')
		}
	})

	// 휴대폰 리스트
	var phoneListBnrSwiper = new Swiper('.phoneListBnr-swiper', {
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});

	var priceTable = function(){
		var $priceTable = $('.price-tb-wrap'),
			$btn = $priceTable.find('.btn-price-more');
		$btn.click(function(){
			($priceTable.hasClass('active'))
				? $priceTable.removeClass('active')
				: $priceTable.addClass('active');
		})
	}
	priceTable();

	$('.sect-ps-cp .btn-close').on('click',function(){
		$('.sect-ps-cp').fadeOut(100)
	})

	// 리뷰
	var psReviewMore = function() {
		"use strict";
		var $reviewList = $('.ps-review');
		if (!$reviewList.length) return false;
		$reviewList.each(function(){
			var $this = $(this),
				$item = $this.find('.review-item'),
				$btn = $item.find('.btn-more');
			$btn.on('click',function(e){
				e.preventDefault();
				var $thisItem = $(this).closest($item);
				if ($thisItem.hasClass('active')) {
					$thisItem.removeClass('active');
					$(this).find('span').text('더보기')
				} else {
					$thisItem.addClass('active');
					$(this).find('span').text('접기')
				}
			})
		})
	};
	psReviewMore();

	// 휴대폰 납부금액 레이어
	var psPriceLayer = function() {
		"use strict";
		var $layer = $('.sect-psview-layer'),
			$layerTop = $layer.find('.layer-top'),
			$layerbtm = $layer.find('.layer-btm'),
			$btnWp = $layer.find('.btn-more-wp'),
			$btn = $layer.find('.btn-priceDetail');
		if (!$layer.length) return false;
		$btn.on('click',function(e){
			e.preventDefault();
			var layerbtmHeight = $layerbtm.outerHeight(),
				btnWpHeight = $btnWp.outerHeight(),
				layerHeight = winHeight-layerbtmHeight-btnWpHeight;
			$layer.toggleClass('active');
			$layerTop.css({'max-height': layerHeight})
		})
		$window.resize(function(){
			var winHeight = $window.height();
			var layerbtmHeight = $layerbtm.outerHeight(),
				btnWpHeight = $btnWp.outerHeight(),
				layerHeight = winHeight-layerbtmHeight-btnWpHeight;
			$layerTop.css({'max-height': layerHeight})
		})
	};
	psPriceLayer();

	var galleryThumbs = new Swiper('.photo-thumbs', {
		spaceBetween: 10,
		slidesPerView: 5,
		freeMode: false,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
		allowTouchMove:false,
	});
	var galleryTop = new Swiper('.photo-top', {
		spaceBetween: 10,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		thumbs: {
			swiper: galleryThumbs
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
	});

	var swiper = new Swiper('.photo-banner .swiper-container', {
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
	});

	$('.form-wrap .inp-cont').each(function(){
		if ($(this).find('.inp-row').length) {
			$(this).addClass('has-row')
		}
	})



	// 선불서비스 언어
	var hdLang = function() {
		"use strict";
		var $hdLang = $('.hd-lang'),
			$layer = $hdLang.find('ul'),
			$btn = $hdLang.find('.btn-lang');
		if (!$hdLang.length) return false;
		$btn.on('click',function(e){
			e.preventDefault();
			$hdLang.toggleClass('active');
			if ( !$hdLang.hasClass('active') ) {
				$btn.attr({
					'title': '열기'
				})
				$layer.attr({
					'aria-hidden': true,
					'aria-expanded': false
				});
			} else {
				$btn.attr({
					'title': '닫기'
				})
				$layer.attr({
					'aria-hidden': false,
					'aria-expanded': true
				});
			}
		})
	};
	hdLang();

	// 셀프개통 신청서 선택
	var selfDoc = function() {
		"use strict";
		var $selfCard = $('.self-card'),
			$item = $selfCard.find('.item'),
			$inp = $item.find('.item-head .radio input');
		if (!$selfCard.length) return false;
		$inp.on('change toggleChange',function(e){
			var $this = $(this),
				name = $this.attr('name');
			$inp.filter('[name="'+name+'"]').each(function() {
				var checked = $(this).prop('checked');
				if(checked){
					$(this).closest($item).addClass('active');
				}else {
					$(this).closest($item).removeClass('active')
				}
			});
		}).trigger('toggleChange');
	};
	selfDoc();

	var tooltip = function() {
		"use strict";
		var $tooltipWp = $('.tooltip-wp'),
			$tooltip = $('.tooltip');
		$tooltip.click(function(e){
		   e.preventDefault();
		});
		$tooltip.on('mouseenter mouseleave focusin focusout', function(e) {
		   var $this = $(this),
			   $thisWp = $this.closest($tooltipWp);
			(e.type == 'mouseenter' || e.type == 'focusin') ? $thisWp.addClass('active') :  $thisWp.removeClass('active');
		});
	};
	tooltip();


	//220207 추가
	var tooltip2 = function() {
		let $tooltipIco = $('.tooltip-icon'),
			activeChg = false;
		$tooltipIco.on('click', function(e) {
			let $tootipId = $(this).attr("data-id"),
				$thisIco = $(".tooltip-icon [data-id="+$tootipId+"]"),
				$thisCont = $("#"+$tootipId);
			if  (activeChg) {
				$thisIco.removeClass('active');
				$thisCont.removeClass('active');
				activeChg = false;
			} else {
				$tooltipIco.removeClass('active');
				$(".tooltip-layer").removeClass('active');
				$thisIco.addClass('active');
				$thisCont.addClass('active');
				textchange = true;
			}
		});
	}; tooltip2();


	// 요금제
	var planListBnrSwiper = new Swiper('.planListBnr-swiper', {
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});

	// 부가서비스
	var BnrSwiper = new Swiper('.banner-swiper', {
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});

	// mgm 친구추천 이벤트
	$('.btn-recom1').click(function(){
		var $pos = $('#recom1').offset().top;
		$('html, body').stop().animate( { scrollTop : $pos-hdHeight }, 300 );
	})

	$('.btn-recom2').click(function(){
		var $pos = $('#recom2').offset().top;
		$('html, body').stop().animate( { scrollTop : $pos-hdHeight }, 300 );
	})

	// Window Event
	$window.on({
		'resize': function() {
			winWidth = $window.width();
			winHeight = $window.height();
			viewModeCheck();
			gnbMethod._init();
		},
		'scroll': function() {
			sct = $(this).scrollTop();
			hdHeight = $hd.outerHeight();
			$topBanner.is(':visible')
				? topBannerHeight = $topBanner.outerHeight(true)
				: topBannerHeight = 0;
			hdScroll();
		}
	});
});

/* util */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Util = factory(global.jQuery));
}(this, (function ($) { 'use strict';

  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

  var TRANSITION_END = 'transitionend';
  var MAX_UID = 1000000;
  var MILLISECONDS_MULTIPLIER = 1000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  function toType(obj) {
	if (obj === null || typeof obj === 'undefined') {
	  return "" + obj;
	}

	return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
	return {
	  bindType: TRANSITION_END,
	  delegateType: TRANSITION_END,
	  handle: function handle(event) {
		if ($(event.target).is(this)) {
		  return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
		}

		return undefined;
	  }
	};
  }

  function transitionEndEmulator(duration) {
	var _this = this;

	var called = false;
	$(this).one(Util.TRANSITION_END, function () {
	  called = true;
	});
	setTimeout(function () {
	  if (!called) {
		Util.triggerTransitionEnd(_this);
	  }
	}, duration);
	return this;
  }

  function setTransitionEndSupport() {
	$.fn.emulateTransitionEnd = transitionEndEmulator;
	$.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
  }
  var Util = {
	TRANSITION_END: 'bsTransitionEnd',
	getUID: function getUID(prefix) {
	  do {
		// eslint-disable-next-line no-bitwise
		prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
	  } while (document.getElementById(prefix));

	  return prefix;
	},
	getSelectorFromElement: function getSelectorFromElement(element) {
	  var selector = element.getAttribute('data-target');

	  if (!selector || selector === '#') {
		var hrefAttr = element.getAttribute('href');
		selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
	  }

	  try {
		return document.querySelector(selector) ? selector : null;
	  } catch (err) {
		return null;
	  }
	},
	getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {
	  if (!element) {
		return 0;
	  } // Get transition-duration of the element


	  var transitionDuration = $(element).css('transition-duration');
	  var transitionDelay = $(element).css('transition-delay');
	  var floatTransitionDuration = parseFloat(transitionDuration);
	  var floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

	  if (!floatTransitionDuration && !floatTransitionDelay) {
		return 0;
	  } // If multiple durations are defined, take the first


	  transitionDuration = transitionDuration.split(',')[0];
	  transitionDelay = transitionDelay.split(',')[0];
	  return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
	},
	reflow: function reflow(element) {
	  return element.offsetHeight;
	},
	triggerTransitionEnd: function triggerTransitionEnd(element) {
	  $(element).trigger(TRANSITION_END);
	},
	// TODO: Remove in v5
	supportsTransitionEnd: function supportsTransitionEnd() {
	  return Boolean(TRANSITION_END);
	},
	isElement: function isElement(obj) {
	  return (obj[0] || obj).nodeType;
	},
	typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
	  for (var property in configTypes) {
		if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
		  var expectedTypes = configTypes[property];
		  var value = config[property];
		  var valueType = value && Util.isElement(value) ? 'element' : toType(value);

		  if (!new RegExp(expectedTypes).test(valueType)) {
			throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
		  }
		}
	  }
	},
	findShadowRoot: function findShadowRoot(element) {
	  if (!document.documentElement.attachShadow) {
		return null;
	  } // Can find the shadow root otherwise it'll return the document


	  if (typeof element.getRootNode === 'function') {
		var root = element.getRootNode();
		return root instanceof ShadowRoot ? root : null;
	  }

	  if (element instanceof ShadowRoot) {
		return element;
	  } // when we don't find a shadow root


	  if (!element.parentNode) {
		return null;
	  }

	  return Util.findShadowRoot(element.parentNode);
	},
	jQueryDetection: function jQueryDetection() {
	  if (typeof $ === 'undefined') {
		throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
	  }

	  var version = $.fn.jquery.split(' ')[0].split('.');
	  var minMajor = 1;
	  var ltMajor = 2;
	  var minMinor = 9;
	  var minPatch = 1;
	  var maxMajor = 4;

	  if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
		throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
	  }
	}
  };
  Util.jQueryDetection();
  setTransitionEndSupport();

  return Util;

})));
//# sourceMappingURL=util.js.map


/* modal */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery'), require('./util.js')) :
  typeof define === 'function' && define.amd ? define(['jquery', './util.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Modal = factory(global.jQuery, global.Util));
}(this, (function ($, Util) { 'use strict';

  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  Util = Util && Object.prototype.hasOwnProperty.call(Util, 'default') ? Util['default'] : Util;

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'modal';
  var VERSION = '4.5.2';
  var DATA_KEY = 'bs.modal';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  var Default = {
	backdrop: 'static',
	keyboard: false,
	focus: true,
	show: true
  };
  var DefaultType = {
	backdrop: '(boolean|string)',
	keyboard: 'boolean',
	focus: 'boolean',
	show: 'boolean'
  };
  var EVENT_HIDE = "hide" + EVENT_KEY;
  var EVENT_HIDE_PREVENTED = "hidePrevented" + EVENT_KEY;
  var EVENT_HIDDEN = "hidden" + EVENT_KEY;
  var EVENT_SHOW = "show" + EVENT_KEY;
  var EVENT_SHOWN = "shown" + EVENT_KEY;
  var EVENT_FOCUSIN = "focusin" + EVENT_KEY;
  var EVENT_RESIZE = "resize" + EVENT_KEY;
  var EVENT_CLICK_DISMISS = "click.dismiss" + EVENT_KEY;
  var EVENT_KEYDOWN_DISMISS = "keydown.dismiss" + EVENT_KEY;
  var EVENT_MOUSEUP_DISMISS = "mouseup.dismiss" + EVENT_KEY;
  var EVENT_MOUSEDOWN_DISMISS = "mousedown.dismiss" + EVENT_KEY;
  var EVENT_CLICK_DATA_API = "click" + EVENT_KEY + DATA_API_KEY;
  var CLASS_NAME_SCROLLABLE = 'modal-dialog-scrollable';
  var CLASS_NAME_SCROLLBAR_MEASURER = 'modal-scrollbar-measure';
  var CLASS_NAME_BACKDROP = 'modal-backdrop';
  var CLASS_NAME_OPEN = 'modal-open';
  var CLASS_NAME_FADE = 'fade';
  var CLASS_NAME_SHOW = 'show';
  var CLASS_NAME_STATIC = 'modal-static';
  var SELECTOR_DIALOG = '.modal-dialog';
  var SELECTOR_MODAL_BODY = '.modal-body';
  var SELECTOR_DATA_TOGGLE = '[data-toggle="modal"]';
  var SELECTOR_DATA_DISMISS = '[data-dismiss="modal"]';
  var SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  var SELECTOR_STICKY_CONTENT = '.sticky-top';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Modal = /*#__PURE__*/function () {
	function Modal(element, config) {
	  this._config = this._getConfig(config);
	  this._element = element;
	  this._dialog = element.querySelector(SELECTOR_DIALOG);
	  this._backdrop = null;
	  this._isShown = false;
	  this._isBodyOverflowing = false;
	  this._ignoreBackdropClick = false;
	  this._isTransitioning = false;
	  this._scrollbarWidth = 0;
	} // Getters


	var _proto = Modal.prototype;

	// Public
	_proto.toggle = function toggle(relatedTarget) {
	  return this._isShown ? this.hide() : this.show(relatedTarget);
	};

	_proto.show = function show(relatedTarget) {
	  var _this = this;

	  if (this._isShown || this._isTransitioning) {
		return;
	  }

	  if ($(this._element).hasClass(CLASS_NAME_FADE)) {
		this._isTransitioning = true;
	  }

	  var showEvent = $.Event(EVENT_SHOW, {
		relatedTarget: relatedTarget
	  });
	  $(this._element).trigger(showEvent);

	  if (this._isShown || showEvent.isDefaultPrevented()) {
		return;
	  }

	  this._isShown = true;

	  this._checkScrollbar();

	  this._setScrollbar();

	  this._adjustDialog();

	  this._setEscapeEvent();

	  this._setResizeEvent();

	  $(this._element).on(EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, function (event) {
		return _this.hide(event);
	  });
	  $(this._dialog).on(EVENT_MOUSEDOWN_DISMISS, function () {
		$(_this._element).one(EVENT_MOUSEUP_DISMISS, function (event) {
		  if ($(event.target).is(_this._element)) {
			_this._ignoreBackdropClick = true;
		  }
		});
	  });

	  this._showBackdrop(function () {
		return _this._showElement(relatedTarget);
	  });
	};

	_proto.hide = function hide(event) {
	  var _this2 = this;

	  if (event) {
		event.preventDefault();
	  }

	  if (!this._isShown || this._isTransitioning) {
		return;
	  }

	  var hideEvent = $.Event(EVENT_HIDE);
	  $(this._element).trigger(hideEvent);

	  if (!this._isShown || hideEvent.isDefaultPrevented()) {
		return;
	  }

	  this._isShown = false;
	  var transition = $(this._element).hasClass(CLASS_NAME_FADE);

	  if (transition) {
		this._isTransitioning = true;
	  }

	  this._setEscapeEvent();

	  this._setResizeEvent();

	  $(document).off(EVENT_FOCUSIN);
	  $(this._element).removeClass(CLASS_NAME_SHOW);
	  $(this._element).off(EVENT_CLICK_DISMISS);
	  $(this._dialog).off(EVENT_MOUSEDOWN_DISMISS);

	  if (transition) {
		var transitionDuration = Util.getTransitionDurationFromElement(this._element);
		$(this._element).one(Util.TRANSITION_END, function (event) {
		  return _this2._hideModal(event);
		}).emulateTransitionEnd(transitionDuration);
	  } else {
		this._hideModal();
	  }
	};

	_proto.dispose = function dispose() {
	  [window, this._element, this._dialog].forEach(function (htmlElement) {
		return $(htmlElement).off(EVENT_KEY);
	  });
	  /**
	   * `document` has 2 events `EVENT_FOCUSIN` and `EVENT_CLICK_DATA_API`
	   * Do not move `document` in `htmlElements` array
	   * It will remove `EVENT_CLICK_DATA_API` event that should remain
	   */

	  $(document).off(EVENT_FOCUSIN);
	  $.removeData(this._element, DATA_KEY);
	  this._config = null;
	  this._element = null;
	  this._dialog = null;
	  this._backdrop = null;
	  this._isShown = null;
	  this._isBodyOverflowing = null;
	  this._ignoreBackdropClick = null;
	  this._isTransitioning = null;
	  this._scrollbarWidth = null;
	};

	_proto.handleUpdate = function handleUpdate() {
	  this._adjustDialog();
	} // Private
	;

	_proto._getConfig = function _getConfig(config) {
	  config = _extends({}, Default, config);
	  Util.typeCheckConfig(NAME, config, DefaultType);
	  return config;
	};

	_proto._triggerBackdropTransition = function _triggerBackdropTransition() {
	  var _this3 = this;

	  if (this._config.backdrop === 'static') {
		return false;
		var hideEventPrevented = $.Event(EVENT_HIDE_PREVENTED);
		$(this._element).trigger(hideEventPrevented);

		if (hideEventPrevented.defaultPrevented) {
		  return;
		}

		var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

		if (!isModalOverflowing) {
		  this._element.style.overflowY = 'hidden';
		}

		this._element.classList.add(CLASS_NAME_STATIC);

		var modalTransitionDuration = Util.getTransitionDurationFromElement(this._dialog);
		$(this._element).off(Util.TRANSITION_END);
		$(this._element).one(Util.TRANSITION_END, function () {
		  _this3._element.classList.remove(CLASS_NAME_STATIC);

		  if (!isModalOverflowing) {
			$(_this3._element).one(Util.TRANSITION_END, function () {
			  _this3._element.style.overflowY = '';
			}).emulateTransitionEnd(_this3._element, modalTransitionDuration);
		  }
		}).emulateTransitionEnd(modalTransitionDuration);

		this._element.focus();
	  } else {
		this.hide();
	  }
	};

	_proto._showElement = function _showElement(relatedTarget) {
	  var _this4 = this;

	  var transition = $(this._element).hasClass(CLASS_NAME_FADE);
	  var modalBody = this._dialog ? this._dialog.querySelector(SELECTOR_MODAL_BODY) : null;

	  if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
		// Don't move modal's DOM position
		document.body.appendChild(this._element);
	  }

	  this._element.style.display = 'block';

	  this._element.removeAttribute('aria-hidden');

	  this._element.setAttribute('aria-modal', true);

	  this._element.setAttribute('role', 'dialog');

	  if ($(this._dialog).hasClass(CLASS_NAME_SCROLLABLE) && modalBody) {
		modalBody.scrollTop = 0;
	  } else {
		this._element.scrollTop = 0;
	  }

	  if (transition) {
		Util.reflow(this._element);
	  }

	  $(this._element).addClass(CLASS_NAME_SHOW);

	  if (this._config.focus) {
		this._enforceFocus();
	  }

	  var shownEvent = $.Event(EVENT_SHOWN, {
		relatedTarget: relatedTarget
	  });

	  var transitionComplete = function transitionComplete() {
		if (_this4._config.focus) {
		  _this4._element.focus();
		}

		_this4._isTransitioning = false;
		$(_this4._element).trigger(shownEvent);
	  };

	  if (transition) {
		var transitionDuration = Util.getTransitionDurationFromElement(this._dialog);
		$(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(transitionDuration);
	  } else {
		transitionComplete();
	  }
	};

	_proto._enforceFocus = function _enforceFocus() {
	  var _this5 = this;

	  $(document).off(EVENT_FOCUSIN) // Guard against infinite focus loop
	  .on(EVENT_FOCUSIN, function (event) {
		if (document !== event.target && _this5._element !== event.target && $(_this5._element).has(event.target).length === 0) {
		  _this5._element.focus();
		}
	  });
	};

	_proto._setEscapeEvent = function _setEscapeEvent() {
	  var _this6 = this;

	  if (this._isShown) {
		$(this._element).on(EVENT_KEYDOWN_DISMISS, function (event) {
		  if (_this6._config.keyboard && event.which === ESCAPE_KEYCODE) {
			event.preventDefault();

			_this6.hide();
		  } else if (!_this6._config.keyboard && event.which === ESCAPE_KEYCODE) {
			_this6._triggerBackdropTransition();
		  }
		});
	  } else if (!this._isShown) {
		$(this._element).off(EVENT_KEYDOWN_DISMISS);
	  }
	};

	_proto._setResizeEvent = function _setResizeEvent() {
	  var _this7 = this;

	  if (this._isShown) {
		$(window).on(EVENT_RESIZE, function (event) {
		  return _this7.handleUpdate(event);
		});
	  } else {
		$(window).off(EVENT_RESIZE);
	  }
	};

	_proto._hideModal = function _hideModal() {
	  var _this8 = this;

	  this._element.style.display = 'none';

	  this._element.setAttribute('aria-hidden', true);

	  this._element.removeAttribute('aria-modal');

	  this._element.removeAttribute('role');

	  this._isTransitioning = false;

	  this._showBackdrop(function () {
		$(document.body).removeClass(CLASS_NAME_OPEN);

		_this8._resetAdjustments();

		_this8._resetScrollbar();

		$(_this8._element).trigger(EVENT_HIDDEN);
	  });
	};

	_proto._removeBackdrop = function _removeBackdrop() {
	  if (this._backdrop) {
		$(this._backdrop).remove();
		this._backdrop = null;
	  }
	};

	_proto._showBackdrop = function _showBackdrop(callback) {
	  var _this9 = this;

	  var animate = $(this._element).hasClass(CLASS_NAME_FADE) ? CLASS_NAME_FADE : '';

	  if (this._isShown && this._config.backdrop) {
		this._backdrop = document.createElement('div');
		this._backdrop.className = CLASS_NAME_BACKDROP;

		if (animate) {
		  this._backdrop.classList.add(animate);
		}

		$(this._backdrop).appendTo(document.body);
		$(this._element).on(EVENT_CLICK_DISMISS, function (event) {
		  if (_this9._ignoreBackdropClick) {
			_this9._ignoreBackdropClick = false;
			return;
		  }

		  if (event.target !== event.currentTarget) {
			return;
		  }

		  _this9._triggerBackdropTransition();
		});

		if (animate) {
		  Util.reflow(this._backdrop);
		}

		$(this._backdrop).addClass(CLASS_NAME_SHOW);

		if (!callback) {
		  return;
		}

		if (!animate) {
		  callback();
		  return;
		}

		var backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
		$(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(backdropTransitionDuration);
	  } else if (!this._isShown && this._backdrop) {
		$(this._backdrop).removeClass(CLASS_NAME_SHOW);

		var callbackRemove = function callbackRemove() {
		  _this9._removeBackdrop();

		  if (callback) {
			callback();
		  }
		};

		if ($(this._element).hasClass(CLASS_NAME_FADE)) {
		  var _backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);

		  $(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(_backdropTransitionDuration);
		} else {
		  callbackRemove();
		}
	  } else if (callback) {
		callback();
	  }
	} // ----------------------------------------------------------------------
	// the following methods are used to handle overflowing modals
	// todo (fat): these should probably be refactored out of modal.js
	// ----------------------------------------------------------------------
	;

	_proto._adjustDialog = function _adjustDialog() {
	  var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

	  if (!this._isBodyOverflowing && isModalOverflowing) {
		this._element.style.paddingLeft = this._scrollbarWidth + "px";
	  }

	  if (this._isBodyOverflowing && !isModalOverflowing) {
		this._element.style.paddingRight = this._scrollbarWidth + "px";
	  }
	};

	_proto._resetAdjustments = function _resetAdjustments() {
	  this._element.style.paddingLeft = '';
	  this._element.style.paddingRight = '';
	};

	_proto._checkScrollbar = function _checkScrollbar() {
	  var rect = document.body.getBoundingClientRect();
	  this._isBodyOverflowing = Math.round(rect.left + rect.right) < window.innerWidth;
	  this._scrollbarWidth = this._getScrollbarWidth();
	};

	_proto._setScrollbar = function _setScrollbar() {
	  var _this10 = this;


	 //  if (this._isBodyOverflowing) {
		// // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
		// //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
		// var fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT));
		// var stickyContent = [].slice.call(document.querySelectorAll(SELECTOR_STICKY_CONTENT)); // Adjust fixed content padding

		// $(fixedContent).each(function (index, element) {
		//   var actualPadding = element.style.paddingRight;
		//   var calculatedPadding = $(element).css('padding-right');
		//   $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this10._scrollbarWidth + "px");
		// }); // Adjust sticky content margin

		// $(stickyContent).each(function (index, element) {
		//   var actualMargin = element.style.marginRight;
		//   var calculatedMargin = $(element).css('margin-right');
		//   $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - _this10._scrollbarWidth + "px");
		// }); // Adjust body padding

		// var actualPadding = document.body.style.paddingRight;
		// var calculatedPadding = $(document.body).css('padding-right');
		// $(document.body).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + "px");
	 //  }

	  $(document.body).addClass(CLASS_NAME_OPEN);
	};

	_proto._resetScrollbar = function _resetScrollbar() {
	  // Restore fixed content padding
	  var fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT));
	  $(fixedContent).each(function (index, element) {
		var padding = $(element).data('padding-right');
		$(element).removeData('padding-right');
		element.style.paddingRight = padding ? padding : '';
	  }); // Restore sticky content

	  var elements = [].slice.call(document.querySelectorAll("" + SELECTOR_STICKY_CONTENT));
	  $(elements).each(function (index, element) {
		var margin = $(element).data('margin-right');

		if (typeof margin !== 'undefined') {
		  $(element).css('margin-right', margin).removeData('margin-right');
		}
	  }); // Restore body padding

	  // var padding = $(document.body).data('padding-right');
	  // $(document.body).removeData('padding-right');
	  // document.body.style.paddingRight = padding ? padding : '';
	};

	_proto._getScrollbarWidth = function _getScrollbarWidth() {
	  // thx d.walsh
	  var scrollDiv = document.createElement('div');
	  scrollDiv.className = CLASS_NAME_SCROLLBAR_MEASURER;
	  document.body.appendChild(scrollDiv);
	  var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
	  document.body.removeChild(scrollDiv);
	  return scrollbarWidth;
	} // Static
	;

	Modal._jQueryInterface = function _jQueryInterface(config, relatedTarget) {
	  return this.each(function () {
		var data = $(this).data(DATA_KEY);

		var _config = _extends({}, Default, $(this).data(), typeof config === 'object' && config ? config : {});

		if (!data) {
		  data = new Modal(this, _config);
		  $(this).data(DATA_KEY, data);
		}

		if (typeof config === 'string') {
		  if (typeof data[config] === 'undefined') {
			throw new TypeError("No method named \"" + config + "\"");
		  }

		  data[config](relatedTarget);
		} else if (_config.show) {
		  data.show(relatedTarget);
		}
	  });
	};

	_createClass(Modal, null, [{
	  key: "VERSION",
	  get: function get() {
		return VERSION;
	  }
	}, {
	  key: "Default",
	  get: function get() {
		return Default;
	  }
	}]);

	return Modal;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
	var _this11 = this;

	var target;
	var selector = Util.getSelectorFromElement(this);

	if (selector) {
	  target = document.querySelector(selector);
	}

	var config = $(target).data(DATA_KEY) ? 'toggle' : _extends({}, $(target).data(), $(this).data());

	if (this.tagName === 'A' || this.tagName === 'AREA') {
	  event.preventDefault();
	}

	var $target = $(target).one(EVENT_SHOW, function (showEvent) {
	  if (showEvent.isDefaultPrevented()) {
		// Only register focus restorer if modal will actually get shown
		return;
	  }

	  $target.one(EVENT_HIDDEN, function () {
		if ($(_this11).is(':visible')) {
		  _this11.focus();
		}
	  });
	});

	Modal._jQueryInterface.call($(target), config, this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Modal._jQueryInterface;
  $.fn[NAME].Constructor = Modal;

  $.fn[NAME].noConflict = function () {
	$.fn[NAME] = JQUERY_NO_CONFLICT;
	return Modal._jQueryInterface;
  };

  return Modal;

})));
//# sourceMappingURL=modal.js.map
