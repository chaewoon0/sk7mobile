var visualMenu;
var autoSwiper = {};

$(function(){
	
	// 슬라이드
	var $visualMob = $('.visual-swiper-mob');
	autoSwiper.visualMob = new Swiper($visualMob, {
		slidesPerView: 1.2,
        centeredSlides: true,
        spaceBetween: 10,
		pagination: {
			el: $visualMob.find('.swiper-pagination'),
	        clickable: true,
	        renderBullet: function (index, className) {
	          return '<li class="' + className + '">' + visualMenu[index] + '</li>';/*
	          var renderString = '';
	          try {
	        	  renderString = return '<li class="' + className + '">' + visualMenu[index] + '</li>';
	          } catch(e) {
	        	  console.log(e);
	          }
	          return renderString;*/
	        },
		},
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		speed: 500,
		loop: true,
		on: {
			init: function () {
				var slideLength = $visualMob.find('li.swiper-slide:not(.swiper-slide-duplicate)').length;
				$visualMob.find('.swiper-pagination-current').text(this.realIndex+1);
				$visualMob.find('.swiper-pagination-total').text(slideLength);
				// $visualMob.find('.swiper-pagination-current').text(this.activeIndex+1);
				// $visualMob.find('.swiper-pagination-total').text(this.slides.length);
			},
			slideChange: function () {
				$visualMob.find('.swiper-pagination-current').text(this.realIndex+1);
				// $visualMob.find('.swiper-pagination-current').text(this.activeIndex+1);
			}
		}
	});

	// 슬라이드
	//var visualMenu = ['무약정평생할인', '데이터음성무제한 월3만원대', '데이터무제한 월2만원대', '말많은너를 위한 음성 2,000분 '];
	var $visual = $('.visual-swiper');
	const $visualLiSlide = $visual.find('.visual-swiper li.swiper-slide');
	const $visualPagination = $visual.find('.visual-custom-pagination');
	const $visualSwiperButton = $visual.find('.swiper-button-next, .swiper-button-prev');
	const mobileMaxWindowWidth = 1080;
	const resizeEvent = function() {
		if ($(document).width() <= mobileMaxWindowWidth) { // 모바일 화면인 경우 
			$visualLiSlide.addClass('banner-swiper');
			$visualPagination.addClass('flt-custom-pagination'); // 페이징버튼 상단으로 배치
			$visualSwiperButton.addClass('hide');
			$visual.find('a.link-ev').addClass('hide');
		} else {
			$visualLiSlide.removeClass('banner-swiper');
			$visualPagination.removeClass('flt-custom-pagination'); // 페이징버튼 하단으로 배치
			$visualSwiperButton.removeClass('hide');
			$visual.find('a.link-ev').removeClass('hide');
		}	
	}
	
	// 브라우저 크기 조절시 리사이즈 이벤트 호출 횟수를 줄이기 위함
	const delay = 300;
	let timer = null;
	const resizeThrottler = function() {
		if (!timer) {
			timer = setTimeout(() => {
				timer = null;
				resizeEvent();
			}, delay);
		}
	}
	
	autoSwiper.visual = new Swiper($visual, {
		breakpoints: {
			[mobileMaxWindowWidth]: {
				slidesPerView: 1.2,
				centeredSlides: true,
				spaceBetween: 10,
				loopedSlides: 2 // 240405 메인배너 모바일 수정
			}
		},
		pagination: {
			el: $visual.find('.swiper-pagination'),
	        clickable: true,
	        renderBullet: function (index, className) {	
	        	return '<li class="' + className + '">' + visualMenu[index] + '</li>';/*
				var renderString = '';
				try {
					renderString = '<li class="' + className + '">' + visualMenu[index] + '</li>';
				} catch(e) {
					console.log(e);
				}
				return renderString;*/
	        },
		},
		autoplay: {
			delay: 3000,
			disableOnInteraction: false,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		speed: 500,
		loop: true,
		on: {
			beforeInit: function() {
				$visual.removeClass('hide');
			},
			init: function () {
				var slideLength = $visual.find('li.swiper-slide:not(.swiper-slide-duplicate)').length;
				$visual.find('.swiper-pagination-current').text(this.realIndex+1);
				$visual.find('.swiper-pagination-total').text(slideLength);
				// $visual.find('.swiper-pagination-current').text(this.activeIndex+1);
				// $visual.find('.swiper-pagination-total').text(this.slides.length);
				
				resizeEvent();
			},
			slideChange: function () {
				$visual.find('.swiper-pagination-current').text(this.realIndex+1);
				// $visual.find('.swiper-pagination-current').text(this.activeIndex+1);
			},
			resize: resizeThrottler
		}
	});

	var $top = $('.top-swiper');

	autoSwiper.top = new Swiper($top , {
		navigation: {
			nextEl: '.top-swiper .swiper-button-next',
			prevEl: '.top-swiper .swiper-button-prev',
		},
		speed: 500,
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		}
	});	
	var $partner = $('.partner-swiper');
	var partnerSwiper = new Swiper($partner, {
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		autoHeight : true,
		observer: true,
		observeParents: true,
		speed: 500,
		loop: true,
		on: {
			slideChange: function () {
				$('.partner-buttons li a').removeClass('active');
				// $('.partner-buttons li').eq(this.activeIndex).find('a').addClass('active');
				$('.partner-buttons li').eq(this.realIndex).find('a').addClass('active');
				//active 된 항목이 가운데 오도록 스크롤 하기 
				var scrollMenuOn = $(".partner-buttons li a.active"),
				scroller = $(".partner-buttons");
				scroller.animate({
					scrollLeft : scrollMenuOn.offset().left + scroller.scrollLeft() + scrollMenuOn.width()/2 - scroller.width()/2 
				}, 500);

		    }
		}
	});
	
	$('.partner-buttons a').click(function(e) {
		 e.preventDefault();
   		var slideno = $(this).closest('li').index() + 1;
   		partnerSwiper.slideTo( slideno , 500);
   		$('.partner-buttons li a').removeClass('active');
   		$(this).addClass('active');
	})

	autoSwiper.video = new Swiper('.video-swiper', {
		navigation: {
			nextEl: '.video-swiper-control .swiper-button-next',
			prevEl: '.video-swiper-control .swiper-button-prev',
		},
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		},
		slidesPerView: 2,
	  	spaceBetween: 66,
		breakpoints: {
			1079: {
				slidesPerView: 1,
			  	spaceBetween: 0
		    }
		}
	});

	var $review = $('.review-swiper');
	var reviewSwiper = new Swiper($review, {
		// mousewheel: true,
		slidesPerView: 'auto',
		freeMode: true
	});

	$review.find('a').focus(function(){
		var currentIndex = $(this).parents('.swiper-slide').index();
		currentIndex !== reviewSwiper.activeIndex && reviewSwiper.slideTo(currentIndex);
	});
	autoSwiper.notice = new Swiper('.notice-swiper', {
		direction: 'vertical',
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		loop: true,
		autoplay: {
			delay: 5000,
			disableOnInteraction: false,
		}
	});

	$('.swiper-button-auto').click(function(){
		var $t = $(this);
		var swp = autoSwiper[$t.data('target')].autoplay;
		var state = swp.running ? 'play' : 'pause';

		$t.data('sr', {"play":"재생", "pause":"정지"}).removeClass('pause play');
		swp.running ? swp.stop() : swp.start();
		$t.text($t.data('sr')[state]).addClass(state);
	});

	$('.main-sect-rcmd .nav-link').click(function(){
		$('.main-sect-rcmd .nav-link').removeClass('active');
		$(this).addClass('active');
	});

    $('.main-sect-plan .nav-link').click(function() {
        $('.main-sect-plan .nav-link').removeClass('active');
        $(this).addClass('active');
    });

    $('.rcmd-item-self > li').click(function() {
        $('.rcmd-item-self > li').removeClass('check');
        $(this).addClass('check');

    });


    $('.ck01').click(function() {
        $('.btText01').addClass("show")
        $('.btText02, .btText03').removeClass("show")

    });
    $('.ck02').click(function() {
    	$('.btText02').addClass("show")
    	$('.btText01, .btText03').removeClass("show")

    });
    $('.ck03').click(function() {
    	$('.btText03').addClass("show")
    	$('.btText01, .btText02').removeClass("show")

    });

	// 추천
	var rcmd = {
		init: function () {
            this.step = $('.q-box');
			this.helpText = {
				rcmdUsimQ1 : ['카카오톡 메시지 보낼 때만 사용해요.', '이동할 때만 조금씩. 와이파이가 보이면 재빠르게 모드 전환!', '주로 와이파이를 쓰지만 밖에 있는 시간이 많아요.', '스트리밍으로 음악도 듣고, 영화도 보고 <br />하루종일 데이터를 사용해요.'],
				//rcmdUsimQ2 : ['꼭 필요한 통화만!', '업무통화도 많고, 지인과의 통화로 스트레스 해소']
				rcmdUsimQ2 : ['무제한까지는 필요없어요.', '카톡과 텍스트 위주의 페이지만 봐요.', '카톡, 웹사이트 이용에 큰 불편함이 없어요.'
				              ,'스트리밍 음악과 동영상을 끊김없이 볼 수 있어요.', 'Full HD 동영상을 끊김없이 볼 수 있어요.'],
			}
			this.result = [];
			this.resultData = {
				gb1lt : {
					name: 'LTE 유심 (1GB/100분)',
				},
				gb1gt : {
					name: 'LTE 유심 (2GB/2000분)',
				},
				gb3lt : {
					name: 'LTE 유심 (3GB/100분)',
				},
				gb3gt : {
					name: 'LTE 유심 (4GB/2000분)',
				},
				gb5lt : {
					name: 'LTE 유심 (5GB/100분)',
				},
				gb5gt : {
					name: 'LTE 유심 (6GB/2000분)',
				},
				gb10lt : {
					name: 'LTE 음성 다유심 11GB',
				},
				gb10gt : {
					name: 'LTE 음성 다유심 11GB',
				},
				costSamsung : {
					type: '가성비폰',
					name: 'A50',
				},
				costApple : {
					type: '가성비폰',
					name: '아이폰SE',
				},
				costLg : {
					type: '가성비폰',
					name: 'LG폴더폰',
				},
				costNomatter : {
					type: '가성비폰',
					name: 'M20',
				},
				premiumSamsung : {
					type: '프리미엄폰',
					name: 'Z플립',
				},
				premiumApple : {
					type: '프리미엄폰',
					name: 'RE_아이폰X_64G',
				},
				premiumLg : {
					type: '프리미엄폰',
					name: 'Q9',
				},
				premiumNomatter : {
					type: '프리미엄폰',
					name: 'Z플립',
				},
				studySamsung : {
					type: '공부폰',
					name: '공부폰byLGQ51',
				},
				studyApple : {
					type: '공부폰',
					name: '공부폰byLGQ51',
				},
				studyLg : {
					type: '공부폰',
					name: '공부폰byLGQ51',
				},
				studyNomatter : {
					type: '공부폰',
					name: '공부폰byLGQ51',
				},
			}
            this.bindEvents();
        },
        bindEvents: function () {
            this.step
                .on('change', 'input', this.changeText.bind(this))
				.on('click', '.btn-next', this.nextStep.bind(this))
				.on('click', '.btn-prev', this.prevStep.bind(this))
				.on('click', '.btn-reset', this.reset.bind(this));
        },
		changeText: function (e) {
			var $t = $(e.target);
			var $help = $t.parents('.q-btn-group').next('.q-help');
			var $btn = $help.siblings('.btn-next');
			var helpArray = this.helpText[$t[0].name];
			helpArray && $help.html(helpArray[$t.parent().index()]);
			$btn.attr('disabled', false).data('answer', $t[0].value);
		},
		nextStep: function (e){
			var $t = $(e.target);
			this.result[$t.parent().index()] = $t.data('answer');
			if($t.hasClass('last')){
				this.lastStep($t);
				return false;
			}
			$t.parent().removeClass('show').next().addClass('show');
			
			var q1 = $(":input:radio[name=rcmdPhoneQ1]:checked").val()

			if(q1 == "special"){
				$(".qType1").hide();
				$(".qType2").show();
				$("#appleArea").hide();
				$("#nomatterArea").hide();
			}else if(q1 == "study"){
				$(".qType1").show();
				$(".qType2").hide();
				$("#appleArea").hide();
				$("#nomatterArea").hide();
			}else{
				$(".qType1").show();
				$(".qType2").hide();
				$("#appleArea").show();
				$("#nomatterArea").show();
			}

			$("#lgArea").hide();
			$("#folderArea").hide();
		},
		prevStep: function (e){
			var $t = $(e.target);
			$t.parent().removeClass('show').prev().addClass('show').find('input').first().focus();
		},
		lastStep: function (ele){
			var $result = ele.parents('.q-step-wrp').next('.q-result');
			var obj = this.resultData[this.result.join('')];
			ele.parents('.q-step-wrp').hide();
			$result.fadeIn('400');

			// s: 240313 메인 큐레이션

			setTimeout(function(){
				$result.find('.q-result-tooltip').addClass('active');
			},600);

			setTimeout(function(){
				$result.find('.q-result-tooltip').removeClass('active');
			},8000);

			// e: 240313 메인 큐레이션
			
			for(var v in obj) {
				$result.find('.'+v).text(obj[v]);
			}
		},
		reset: function (e) {
			var $t = $(e.target);
			var $parent = $t.parent();
			var $step = $parent.prev('.q-step-wrp');
			$parent.hide();
			$step.fadeIn('400').find('.q-step').children().removeClass('show').eq(0).addClass('show').find('input').first().focus();
		}
	}
	rcmd.init();

	// accordionFaq
	var accordionFaq = function() {
		"use strict";
		var $accGroup = $('.acc-group.acc-faq1');
		$accGroup.each(function(){
			var	$this = $(this),
				$item = $this.find('.acc-item');
			if( !$this.is('[data-accordion="true"]')) {
				return false;
			};
			var $btn = $item.find('.btn-toggle').attr({
					'role': 'button',
					'title': '상세보기'
				}),
				$panel = $item.find('.acc-body').attr({
					'role': 'region',
					'aria-hidden': true,
					'aria-expanded': false
				}),
				$inner = $item.find('.acc-content').hide();
			$(window).on({
				'resize': function() {
					if( $('html').hasClass('is_pc') && !$item.filter('.active').length ){
						$item.eq(0).find($btn).trigger('click')
					}
				}
			});
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
				if ( $thisItem.hasClass('active') && !$('html').hasClass('is_pc')) {
					$thisItem.removeClass('active');
					$this.attr({
						'title': '상세보기'
					})
					$thisPanel.attr({
						'aria-hidden': true,
						'aria-expanded': false
					});
					if( !$('html').hasClass('is_pc') ){
						$thisInner.stop().slideUp(200);
					}
				} else {
					$item.removeClass('active').filter($thisItem).addClass('active');
					$panel.attr({
						'aria-hidden': true,
						'aria-expanded': false
					});
					if( $('html').hasClass('is_pc') ){
						$inner.stop().hide();
					} else {
						$inner.stop().slideUp(200);
					}
					$this.attr({
						'title': '닫기'
					})
					$thisPanel.attr({
						'aria-hidden': false,
						'aria-expanded': true
					});
					if( $('html').hasClass('is_pc') ){
						$thisInner.stop().show();
					} else {
						$thisInner.stop().slideDown(200);
					}
				}
			});
		})
	};
	accordionFaq();
});
