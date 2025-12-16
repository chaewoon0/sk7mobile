// 드래그, 우클릭, ctrl+p 방지
document.addEventListener("selectstart", function(e) {e.preventDefault()});
document.addEventListener("dragstart", function(e) {e.preventDefault()});
document.addEventListener("contextmenu", function(e) {e.preventDefault()});
document.addEventListener('keydown', setDefalutKeydown);
/*global define:true */
(function (factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['jquery'], factory);
  } else {
      // Browser globals
      factory(jQuery);
  }
}(function ($) {
  $.fn.inputfit = function(options) {
      var settings = $.extend({
          minSize   : 10,
          maxSize   : false
      }, options);

      this.each(function() {
          var $input = $(this);

          if ( !$input.is(':input') ) {
              return;
          }

          $input.off('keyup.inputfit keydown.inputfit');

          var maxSize = parseFloat(settings.maxSize || $input.css('font-size'), 10);
          var width   = $input.width();
          var clone   = $input.data('inputfit-clone');

          if (!clone) {
              clone = $('<div></div>', {
                  css : {
                      fontSize     : $input.css('font-size'),
                      fontFamily   : $input.css('font-family'),
                      fontStyle    : $input.css('font-style'),
                      fontWeight   : $input.css('font-weight'),
                      fontVariant  : $input.css('font-variant'),
                      letterSpacing: $input.css('letter-spacing'),
                      whiteSpace   : 'nowrap',
                      position     : 'absolute',
                      left         : '-9999px',
                      visibility   : 'hidden'
                  }
              }).insertAfter($input);

              $input.data('inputfit-clone', clone);
          }

          $input.on('keyup.inputfit keydown.inputfit', function() {
              var $this = $(this);

              clone.text($this.val());

              var ratio = width / (clone.width() || 1),
                  currentFontSize = parseInt( $this.css('font-size'), 10 ),
                  fontSize = Math.floor(currentFontSize * ratio);

              if (fontSize > maxSize) { fontSize = maxSize; }
              if (fontSize < settings.minSize) { fontSize = settings.minSize; }

              $this.css('font-size', fontSize);
              clone.css('font-size', fontSize);
          }).triggerHandler('keyup.inputfit');
      });

      return this;
  };

}));

/*
function isMobile() {
	var	mobileKeyWords	= new Array('iPhone', 'iPod', 'iPad', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson');

	for (var word in mobileKeyWords){
		if (navigator.userAgent.match(mobileKeyWords[word]) != null){
			return true;
			break;
		}
	}
	return false;
}

if (isMobile()) {
  alert('PC/노트북으로 접속하세요.');
}
*/

/*
> [O] [자체개선] 납부방법에 따라 생년월일 동일 체크박스 초기화
> [O] [자체개선] 필수동의항목 자동으로 동의에 체크
> [O] [자체개선] 은행 자동납부신청서 연월일 자동입력
*/
$(document).ready(function () {
  // 온라인서식지 날짜버전 표시
  setVersion();

  // [자동 입력] 현재 년,월,일
  setDateAuto();

  // 요금제 데이터 세팅
  setRates();
  
  // 드롭다운
  initDropdown();

  // 각 입력 요소 속성 기본 설정
  setDefaultPropByDataType();
  
  // 분기 제어[업무 구분]
  onchangeWorkType();
  
  // 분기 제어[고객 구분]: 2025/02/25(화) 이상봉님과 메일 및 통화로 고객구분[개인(청소년)] 인 경우에만 마지막 법정대리인 활성화
  onchangeCustomerType();
  
  // 분기 제어[요금확인 방법]
  onchangeCostCheckMethod();
  
  // 분기 제어[요금납부 방법]
  onchangePayMethod();
  
  // 분기 제어[요금제 선택]
  onchangeRates();

  // 분기 제어[가입자 == 카드주]
  onchangeIsEqualSubsAndCard();

  // 분기 제어[업무 구분: 번호이동] && [변경 전 통신회사: MVNO]
  onchangeNumberTransferCompany();

  // 분기 제어[고객 구분:개인(청소년)] && [신청고객과의 관계: 기타] 인 경우 input 활성화
  // onchangeRetaionBetweenMinorAndRep();

  // 성명 등 동일한 입력항목 자동입력
  onblurSameInput();

  // 요금 납부방법[은행 자동이체] && 가입자 이름(법인명) == 예금주 이면 법정생년월일 자동입력
  onblurDepositorName();
  
  // 신청인과 예금주가 다를 경우 v 표시
  onblurDiffApplName();
  
  //위임대리인 입력시 v 표시
  onblurAttorneyInFactName();

  // 초기화
  onclickResetForm();

  // 인쇄
  onclickPrintForm();

  // input 입력사이즈에 따라 폰트 사이즈 자동조정
  initAutoFontSize();
  
});

/**
 * @description 요금제 데이터 from 엑셀
 * @template =CONCATENATE("{ value: '", ROW(A3)-2, "', name: '", A3, "', default_rates: '", F3, "', promotion: '", G3, "', rates: '", H3, "', voice: '", I3, "', sms: '", J3, "', data: '", K3, "', qos: '", L3, "' },")
 */
const RATES = [
  { value: '1', name: 'LTE 알뜰 (100GB+/통화맘껏)', default_rates: '55000', promotion: '12210', rates: '42790', voice: '통화기본제공', sms: '문자기본제공', data: '100GB', qos: '5Mbps' },
  { value: '2', name: 'LTE 알뜰 (11GB+/통화맘껏)', default_rates: '49060', promotion: '12920', rates: '36140', voice: '통화기본제공', sms: '문자기본제공', data: '11GB', qos: '일2GB+3Mbps' },
  { value: '3', name: 'LTE 알뜰 (15GB+/100분)', default_rates: '47300', promotion: '21560', rates: '25740', voice: '100분', sms: '100건', data: '15GB', qos: '3Mbps' },
  { value: '4', name: 'LTE 알뜰 (10GB+/통화맘껏)', default_rates: '50600', promotion: '30960', rates: '19640', voice: '통화기본제공', sms: '문자기본제공', data: '10GB', qos: '1Mbps' },
  { value: '5', name: 'LTE 알뜰 (7GB+/통화맘껏)', default_rates: '48400', promotion: '29260', rates: '19140', voice: '통화기본제공', sms: '문자기본제공', data: '7GB', qos: '1Mbps' },
  { value: '6', name: 'LTE 알뜰 (3GB+/200분)', default_rates: '36300', promotion: '21960', rates: '14340', voice: '200분', sms: '100건', data: '3GB', qos: '1Mbps' },
  { value: '7', name: 'LTE 알뜰 (1GB+/통화맘껏)', default_rates: '33000', promotion: '19660', rates: '13340', voice: '통화기본제공', sms: '문자기본제공', data: '1GB', qos: '1Mbps' },
  { value: '8', name: 'LTE 알뜰 (25GB/100분)', default_rates: '45100', promotion: '20550', rates: '24550', voice: '100분', sms: '100건', data: '25GB', qos: '-' },
  { value: '9', name: 'LTE 알뜰 (15GB/200분)', default_rates: '42900', promotion: '27150', rates: '15750', voice: '200분', sms: '100건', data: '15GB', qos: '-' },
  { value: '10', name: 'LTE 알뜰 (8GB/2000분)', default_rates: '40700', promotion: '28490', rates: '12210', voice: '2000분', sms: '2000건', data: '8GB', qos: '-' },
  { value: '11', name: 'LTE 알뜰 (6GB/2000분)', default_rates: '38500', promotion: '27720', rates: '10780', voice: '2000분', sms: '2000건', data: '6GB', qos: '-' },
  { value: '12', name: 'LTE 알뜰 (4GB/2000분)', default_rates: '33000', promotion: '22660', rates: '10340', voice: '2000분', sms: '2000건', data: '4GB', qos: '-' },
  { value: '13', name: 'LTE 알뜰 (2GB/2000분)', default_rates: '27500', promotion: '20680', rates: '6820', voice: '2000분', sms: '2000건', data: '2GB', qos: '-' },
  { value: '14', name: 'CMLink (100GB+)', default_rates: '60500', promotion: '12650', rates: '47850', voice: '통화기본제공', sms: '문자기본제공', data: '100GB', qos: '5Mbps' },
  { value: '15', name: 'CMLink (11GB+)', default_rates: '54560', promotion: '13360', rates: '41200', voice: '통화기본제공', sms: '문자기본제공', data: '11GB', qos: '일2GB+3Mbps' },
  { value: '16', name: 'CMLink (15GB+)', default_rates: '52800', promotion: '22000', rates: '30800', voice: '100분', sms: '100건', data: '15GB', qos: '3Mbps' },
  { value: '17', name: 'CMLink (10GB+)', default_rates: '56100', promotion: '31400', rates: '24700', voice: '통화기본제공', sms: '문자기본제공', data: '10GB', qos: '1Mbps' },
  { value: '18', name: 'CMLink (7GB+)', default_rates: '53900', promotion: '29700', rates: '24200', voice: '통화기본제공', sms: '문자기본제공', data: '7GB', qos: '1Mbps' },
  { value: '19', name: 'CMLink (1GB+)', default_rates: '38500', promotion: '20100', rates: '18400', voice: '통화기본제공', sms: '문자기본제공', data: '1GB', qos: '1Mbps' },
  { value: '20', name: '글로벌300 (15GB+/100분)', default_rates: '0', promotion: '0', rates: '35640', voice: '국내 100분\n국제 300분', sms: '100건', data: '15GB', qos: '1Mbps', gift:'1만원 제공'},
  { value: '24', name: '글로벌300 (11GB+/100분)', default_rates: '0', promotion: '0', rates: '46040', voice: '국내기본제공\n국제 300분', sms: '문자기본제공', data: '11GB', qos: '1Mbps', gift:'1만원 제공'},
  { value: '21', name: '글로벌300 (10GB+/통화맘껏)', default_rates: '0', promotion: '0', rates: '29540', voice: '국내기본제공\n국제 300분', sms: '문자기본제공', data: '10GB', qos: '1Mbps', gift:'1만원 제공'},
  { value: '25', name: '글로벌300 (7GB+/통화맘껏)', default_rates: '0', promotion: '0', rates: '29040', voice: '국내기본제공\n국제 300분', sms: '문자기본제공', data: '7GB', qos: '1Mbps', gift:'1만원 제공'},
  { value: '26', name: '글로벌300 (1GB+/통화맘껏)', default_rates: '0', promotion: '0', rates: '23240', voice: '국내기본제공\n국제 300분', sms: '문자기본제공', data: '1GB', qos: '1Mbps', gift:'1만원 제공' },
  { value: '22', name: '글로벌100 (15GB+/100분)', default_rates: '0', promotion: '0', rates: '31240', voice: '국내 100분\n국제 100분', sms: '100건', data: '15GB', qos: '1Mbps', gift:'5천원 제공' },
  { value: '27', name: '글로벌100 (11GB+/통화맘껏)', default_rates: '0', promotion: '0', rates: '41640', voice: '국내기본제공\n국제 100분', sms: '문자기본제공', data: '11GB', qos: '1Mbps', gift:'5천원 제공' },
  { value: '23', name: '글로벌100 (10GB+/통화맘껏)', default_rates: '0', promotion: '0', rates: '25140', voice: '국내기본제공\n국제 100분', sms: '문자기본제공', data: '10GB', qos: '1Mbps', gift:'5천원 제공' },
  { value: '28', name: '글로벌100 (7GB+/통화맘껏)', default_rates: '0', promotion: '0', rates: '24640', voice: '국내기본제공\n국제 100분', sms: '문자기본제공', data: '7GB', qos: '1Mbps', gift:'5천원 제공'},
  { value: '29', name: '글로벌100 (1GB+/통화맘껏)', default_rates: '0', promotion: '0', rates: '18840', voice: '국내기본제공\n국제 100분', sms: '문자기본제공', data: '1GB', qos: '1Mbps', gift:'5천원 제공'},
]

/**
 * @description 요금제 dropdown 세팅
 */
function setRates() {
  $('#ul_rates').html(RATES.map(function(r) {
    return [
      '<li ',
        `data-value="${r.value}"`,
        `data-name="${r.name}"`,
        `data-default_rates="${setComma(r.default_rates)}"`,
        `data-promotion="${setComma(r.promotion)}"`,
        `data-rates="${setComma(r.rates)}"`,
        `data-voice="${setComma(r.voice)}"`,
        `data-sms="${setComma(r.sms)}"`,
        `data-data="${setComma(r.data)}"`,
        `data-qos="${setComma(r.qos)}"`,
        `data-gift="${setComma(r.gift)}"`,
      `>${r.name}</li>`
    ].join('');
  }));
}

function setComma(num){
  var pattern = /(^[+-]?\d+)(\d{3})/;
  num += '';
  while (pattern.test(num)){
      num = num.replace(pattern, '$1' + ',' + '$2');
  }
  return num == '0.0' ? '0' : num;
}

/**
 * @description 온라인서식지 날짜버전 표기
 */
function setVersion() {
  const version = '2025.11';
  $('.date').text(version);
}

/**
 * @description [자동 입력] 현재 년,월,일
 */
function setDateAuto() {
  let today = new Date();
  let year = today.getFullYear();
  let shortYear = today.getFullYear().toString().slice(2);
  let month = today.getMonth() + 1;
  let date = today.getDate();

  month = month < 10 ? '0' + month : month;
  date = date < 10 ? '0' + date : date;
  
  $('.displayDate-shortYear').prop('readonly', true).val(shortYear);
  $('.displayDate-year').prop('readonly', true).val(year);
  $('.displayDate-month').prop('readonly', true).val(month);
  $('.displayDate-date').prop('readonly', true).val(date);
}

//s: 250925 수정

//드롭다운
function initDropdown() {
  $('.custom-dropdown').each(function(_, el) {
    el.setAttribute('tabindex', 0); // focus-within backgroud-color 용 속성
  });
  
  $(".custom-dropdown .selected-option").click(function () {
    $(this).closest(".custom-dropdown").toggleClass("active");
  });
  
  $(".custom-dropdown .options li").click(function () {
    const $dropdown = $(this).closest(".custom-dropdown");
    var selectedText = $(this).text();  
    var selectedTextSpan = $dropdown.find(".selected-option span:first-child");
    var selectedGiftSpan = $dropdown.find(".selected-option span:nth-child(2)");
    var selectedGiftText = '';

    //글로벌 요금제 경우 상품권 제공으로 인한 문자추가
    if (selectedText.includes('글로벌')) {
      selectedGiftText = "(국제통화 미이용시, GS25 상품권 "+ $(this).data("gift")+")";
      selectedGiftSpan.show();
      $('#joinRate').text('면제');
      $('#joinText').text('');
    } else {
      selectedGiftSpan.hide();
      $('#joinRate').text('9,900원');
      $('#joinText').text('(3개월분납/카드즉납)');
    }
    
    $(this).closest(".custom-dropdown").find("span").empty();
    
    selectedTextSpan.text(selectedText);
    selectedGiftSpan.text(selectedGiftText);
    $(this).closest(".custom-dropdown").removeClass("active");
  });
  
  $(document).on("click", function (event) {
    if (!$(event.target).closest(".custom-dropdown").length) {
      $(".custom-dropdown").removeClass("active");
    }
  });
}
// e: 250925 수정

// s: 250929 수정
// textarea 높이 자동 조정
document.addEventListener('DOMContentLoaded', () => {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        let lastValue = textarea.value;
        
        textarea.addEventListener('input', () => handleValueChange(textarea));
        
        const originalSetter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
        Object.defineProperty(textarea, 'value', {
        set(val) {
            originalSetter.call(this, val);
            this.dispatchEvent(new Event('input', { bubbles: true }));
        }
        });
        
        adjustHeight(textarea);
    });
    
    function handleValueChange(element) {
        adjustHeight(element);
    }
    
    function adjustHeight(element) {
        element.style.height = 'auto';
        element.style.height = `${element.scrollHeight}px`;
    }
});
// e: 250929 수정

/**
 * @description 기본 키 입력 제어
 * 1. Ctrl + p : 인쇄 단축키 막기
 * 2. [Shift] + Enter, [Shift] + Tab 키 제어 : 다음/이전 입력 요소로 이동(유효성 검사 실행 후)
 * @param {Event} e 
 */
function setDefalutKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
    e.preventDefault();
  }

  if (e.key !== 'Enter' && e.key !== 'Tab') {
    return;
  }

  e.preventDefault();
  const targets = document.querySelectorAll('input:not([disabled]):not([readonly]),div.custom-dropdown');
  const currentTarget = e.target;
  const currentIndex = Array.prototype.indexOf.call(targets, currentTarget);
  const isShift = (e.shiftKey); // true:반대방향 || false:정방향

  // /*====================================================================================================
  // 입력항목 [TAB, ENTER] 다음 이동 시 유효성 검사 필요하면 아래 주석 해제
  // ----------------------------------------------------------------------------------------------------
  const isPassed = isValid(currentTarget);
  console.warn(`유효성검사결과 = ${isPassed ? '통과' : '실패'}, 이동방향 = ${isShift ? '이전' : '다음'}`);
  if (!isShift && !isPassed) {
//	24년 취약점 점검 CWE-489 활성 디버그 코드 제거
//	console.error('유효성검사 실패, 다음 입력 요소로 이동 불가');
    currentTarget.focus();
    return;
  }
  // ==================================================================================================== */

  const nextIndex = (targets.length - 1 == currentIndex) ? currentIndex : currentIndex + 1;
  const prevIndex = (currentIndex == 0) ? currentIndex : currentIndex - 1;
  const focusingIndex = isShift ? prevIndex : nextIndex;
  if (focusingIndex < 0) {
//	24년 취약점 점검 CWE-489 활성 디버그 코드 제거
//  return console.error(`focusingIndex = ${focusingIndex}`);
	return;  
  }

  const isCurrentDropdown = currentTarget.className.includes('custom-dropdown');
  if (isCurrentDropdown) {
    currentTarget.classList.remove('active');
  }
  
  const focusingEl = targets[focusingIndex];
  const isDropdown = focusingEl.className.includes('custom-dropdown');
  if (isDropdown) {
    focusingEl.querySelector('.selected-option').click();
  }
  
  focusingEl.focus();
}

/**
 * @description setDefaultPropByDataType() 에 사용하는 요소별 속성 모음 객체
 */
const PROPS = {
  name: {
    pattern: '^(([가-힣a-zA-Z]+\\s{0,1})+[가-힣a-zA-Z]+)$', // \ escape 에 주의, 문자열이라 두번 썼을뿐 \s 실제 input pattern에는 \\s -> \s
    maxlength: 40,
    on: {
      input: function(e) {forceInputName(e.currentTarget)},
      blur: function(e) {forceBlurName(e.currentTarget)},
    }
  },
  /**
   * @description data-type = num1 또는 num3-10 형식인 input 설정
   * @description num1 : maxlength=1
   * @description num3-10 : maxlength=10, minlength=3
   */
  num: function (max, min) {
    return {
      pattern: `[0-9]{${min > -1 ? min + ',' : ''}${max}}`, // Y, M, D 같은 한자리 숫자 또는 num1-12
      maxlength: max,
      on: {
        input: function(e) {forceInputNumberAndFocusNext(e.currentTarget)},
        keydown: function(e) {handleBackspace(e, e.currentTarget)},
      }
    }
  },
  address: {
    pattern: '^.{1,}$', // 주소
    on: {
      blur: function(e) {forceBlurName(e.currentTarget)},
    }
  },
  model: {
    pattern: '^.{1,}$', // sim 카드 모델명
  },
  serial: {
    pattern: '[a-zA-Z0-9]{2,}', // sim 카드 일련번호
  },
  email1: {
    pattern: '^(?:\\b[\\w\\.-]+)$', // email 앞자리
  },
  email2: {
    pattern: '^(?:[\\w\\.-]+\\.\\w{2,4}\\b)$', // email 뒷자리
  },
}

/**
 * @description data-type을 가진 입력 요소에 속성 부여[pattern, maxlength, on[input, keydown, ...] ]
 */
function setDefaultPropByDataType() {
  Object.keys(PROPS).forEach(function(dataType) {
    if (dataType === 'num') {
      $('[data-type^=num]').each(function(_, input) {
        const minMax = $(input).data('type').replace('num', '').split('-');
        let min = -1;
        let max = 0;
        if (minMax.length > 1) {
          min = minMax[0];
          max = minMax[1];
        } else {
          max = minMax[0];
        }
    
        const propsNum = PROPS.num(max, min);
        Object.keys(propsNum).forEach(function(key) {
          if (key === 'on') {
            Object.keys(propsNum[key]).forEach(function(eventName) {
              $(input).on(eventName, propsNum[key][eventName]);
            });
  
          } else {
            $(input).prop(key, propsNum[key]);
          }
        });
      });

    } else {

      const $targets = $(`[data-type=${dataType}]`);
      Object.keys(PROPS[dataType]).forEach(function(key) {
        if (key === 'on') {
          Object.keys(PROPS[dataType][key]).forEach(function(eventName) {
            $targets.on(eventName, PROPS[dataType][key][eventName]);
          });

        } else {
          $targets.prop(key, PROPS[dataType][key]);
        }
      });
    }
  });

  // $('input[data-type=name]')
  //   .prop('pattern', PROPS.name.pattern)
  //   .prop('maxlength', PROPS.name.maxlength)
  //   .on('input', PROPS.name.on.input)
  //   .on('blur', PROPS.name.on.blur)
  // ;

  // $('input[data-type^=num]').each(function(_, input) {
  //   const minMax = $(input).data('type').replace('num', '').split('-');
  //   let min = -1;
  //   let max = 0;
  //   if (minMax.length > 1) {
  //     min = minMax[0];
  //     max = minMax[1];
  //   } else {
  //     max = minMax[0];
  //   }

  //   const propsNum = PROPS.num(max, min);
  //   $(input)
  //     .prop('pattern', propsNum.pattern)
  //     .prop('maxlength', propsNum.maxlength)
  //     .on('input', propsNum.on.input)
  //     .on('keydown', propsNum.on.keydown)
  // });
  
  // $('input[data-type=address]').prop('pattern', PROPS.address.pattern);
  // $('input[data-type=model]').prop('pattern', PROPS.model.pattern);
  // $('input[data-type=serial]').prop('pattern', PROPS.serial.pattern);

  // $('input[data-type=email1]').prop('pattern', PROPS.email1.pattern);
  // $('input[data-type=email2]').prop('pattern', PROPS.email2.pattern);
}

/**
 * @todo [이동전화 신규, 번호이동] 외 의 분기도 필요함
 * @description 업무 구분 변경시 화면 제어
 * - [이동전화 신규]일 경우 [번호이동가입정보] 영역 내 el.disabled = true;
 * - [번호이동]일 경우 [번호이동가입정보] 영역 내 el.disabled = false;
 * - 이 외의 분기는 정해진 내용 없음 -> [번호이동]일 경우에만 활성화?
 */
function onchangeWorkType() {
  $(document).on('change', 'input[name=work_type]', function(e) { 
    const isNewReg = (e.currentTarget.value == 'WORK_TYPE_NEW');
    toggleAreaAbleDisable($('#numberTransferRegInfo'), !isNewReg);
    toggleAreaAbleDisable($('#div_new_hope_numbers'), isNewReg);
  });
}

/**
 * @description 고객구분 change event
 * @since 2025/02/25(화) 이상봉님과 메일 및 통화로 고객구분[개인(청소년)] 인 경우에만 마지막 법정대리인 활성화
*/
function onchangeCustomerType() {
  $(document).on('change', 'input[name=customer_type]', function(e) {
    const customerType = e.currentTarget.value;
    const isMinor = (customerType == 'CUSTOMER_TYPE_MINOR');
    const $minorLegalRepresentativeConsentPage = $('div[data-page=8]');
    togglePageAbleDisable($minorLegalRepresentativeConsentPage, isMinor);
    
    const isCorpOrSole = (customerType == 'CUSTOMER_TYPE_SOLE_PROPRIETOR')
                      || (customerType == 'CUSTOMER_TYPE_CORPORATION');
    const $corpOrSoleArea = $('#div_corp_or_sole_reg_num');
    toggleAreaAbleDisable($corpOrSoleArea, isCorpOrSole);
  });
}

/**
 * @description 요금납부 방법 change event
 */
function onchangePayMethod() {
  $(document).on('change', 'input[name=pay_method]', function(e) {
    const payMethod = e.currentTarget.value;
    const isCard = (payMethod == 'PAY_METHOD_CARD');
    const isAccount = (payMethod == 'PAY_METHOD_ACCOUNT');
    // const isGiro = (payMethod == 'PAY_METHOD_GIRO');

    const $payMethodCardArea = $('[id^=pay_method_card_info_]');
    const $payMethodAccountPage = $('div[data-page=7]');

    togglePageAbleDisable($payMethodAccountPage, isAccount);
    
    toggleAreaAbleDisable($payMethodCardArea, isCard);
    $('#chk_isEqualSubsAndCard')
      .prop('checked', !isCard)
      .prop('disabled', !isCard);
  });

  // $('input[name=pay_method]')[0].click(); // [default]카드 자동이체 선택 
}

/**
 * @description 요금확인 방법 change event
 */
function onchangeCostCheckMethod() {
  $(document).on('change', 'input[name=cost_check_method]', function(e) {
    const costCheckMethod = e.currentTarget.value;
    const $costCheckMethodEmailArea = $('div#cost_check_method_3_email');
    const isEmail = (costCheckMethod == 'EMAIL');
    toggleAreaAbleDisable($costCheckMethodEmailArea, isEmail);
  });

  // $('input[name=cost_check_method]')[0].click(); // [default]문자 청구서 선택 
}

/**
 * @description 요금제 선택 change event
 * @description CMLink 요금제일 경우, CMLink 동의 항목 disabled=false
 */
function onchangeRates() {
  // $('[data-page=2],[data-page=3],[data-page=4],[data-page=5]').hide();
  // data-auto
  $('ul#ul_rates li').click(function(e) {
    const ratesData = $(e.currentTarget).data();
    Object.entries(ratesData).forEach(function(rd) {
      const key = rd[0];
      const value = rd[1];
      $(`[data-auto=${key}]`).val(value);
    });
    
    triggerAutoFontSize($('input[data-auto]'));
    
    const CMLink = 'cmlink';
    const isCMLinkRates = String(ratesData.name).toLowerCase().includes(CMLink);
    toggleCMLinkAgree(isCMLinkRates);
  });

  toggleCMLinkAgree(false);
}

/**
 * @description 가입신청고객 정보 > 요금납부 방법 > 이동전화 가입자와 카드주가 동일한 경우
 */
function onchangeIsEqualSubsAndCard() {
  const $subsBirthdayInputs = $('#div_subs_birthday input');
  const $cardBirthdayInputs = $('#div_card_birthday input');
  $('#chk_isEqualSubsAndCard').on('change', function(e) {
    const isEqual = e.currentTarget.checked;
    if (!isEqual) {
      $cardBirthdayInputs.each(function(_, input) {
        input.value = '';
      });
      return;
    };
    
    const isInvalid = Array.from($subsBirthdayInputs).some(function(input) { return !input.value});
    if (isInvalid) {
      e.currentTarget.checked = false;
      return;
    }

    $subsBirthdayInputs.each(function(i, input) {
      $cardBirthdayInputs[i].value = input.value;
    });
  });
}

/**
 * @description [업무 구분: 번호이동] && [변경 전 통신회사: MVNO] 인 경우 직접입력란 활성화
 */
function onchangeNumberTransferCompany() {
  $('input[name=before_company]').on('change', function(e) {
    const isMvno = (e.currentTarget.value == 'MVNO');
    $('#number_transfer_mvno_name').prop('disabled', !isMvno);
  });
}

/**
 * @description 성명 등 동일한 입력항목 자동입력
 * @description input[data-origin]에 blur 이벤트 발동시 입력값을 input[data-same]에 자동입력
 * @ data-same="SAME_APPL_NAME"       : [가입신청고객 (서명)] 란은 입력되면, 다른 [가입신청고객 (서명)]란에 자동입력 : 1[o], 3[o], 4[o], 6[o] 가입신청고객 란
 * @ data-same="SAME_APPL_CONTACT_1"  : 
 * @ data-same="SAME_APPL_CONTACT_2"  : 
 * @ data-same="SAME_APPL_CONTACT_3"  : 
 * @ data-same="SAME_CARD_OWNER_NAME" :
 * @ data-same="SAME_SELLER_NAME"     : [판매자] 입력시, 6p 판매직원 란에 자동입력
 * @ data-same="SAME_DEPOSITOR_NAME"  : 은행자동이체 납부신청서 : [예금주] 입력시, 하단에도 자동입력
 * @ data-same="SAME_DIFF_APPL_NAME"  : 은행자동이체 납부신청서 : [가입자 이름] 입력시, 하단에도 자동입력
 * @ data-same="SAME_LEGAL_REP_NAME"  : [법정대리인 이름] 입력시, 아래 법정대리인에 자동입력
 */
function onblurSameInput() {
  $('input[data-origin]').each(function(_, originInput) {
    const origin = $(originInput).data('origin');
    $(originInput).on('blur', function() {
      $(`input[data-same=${origin}]`).each(function(_, sameInput) {
        sameInput.value = (!sameInput.disabled) ? originInput.value : '';
        if (sameInput.value) {
          triggerAutoFontSize($(sameInput));
        }
      });
      
      // triggerAutoFontSize($('input[data-same=SAME_APPL_NAME]'));
    });
  });
}

function onblurDepositorName() {
  $('input[data-origin=SAME_DEPOSITOR_NAME]').on('blur', function(e) {
    const applName = $('#subscriber_name').val();
    const depositorName = $(e.currentTarget).val();

    if (applName !== depositorName) {
      return;
    }
    
    const $depoBirthdayInputs = $('#div_depo_birthday input');
    $('#div_subs_birthday input').each(function(i, birthDayInput) {
      $depoBirthdayInputs[i].value = birthDayInput.value;
    });
  });
}

function onblurDiffApplName() {
  $('#cms_appl_name_check_icon').hide();
  $('input[data-origin=SAME_DIFF_APPL_NAME]').on('blur', function(e) {
    const diffApplName = $(e.currentTarget).val();
    if (!diffApplName) {
      $('#cms_appl_name_check_icon').hide();
    } else {
      $('#cms_appl_name_check_icon').show();
    }
  })
}

function onblurAttorneyInFactName() {
  $('#attorney_in_fact_name_check_icon').hide();
  $('#input_attorney_in_fact_name').on('blur', function(e) {
    const attorneyName = $(e.currentTarget).val();
    if (!attorneyName) {
      $('#attorney_in_fact_name_check_icon').hide();
    } else {
      $('#attorney_in_fact_name_check_icon').show();
    }
  })
}


function clickRelationBetweenMinorAndRep(li) {
  const isETC = ('ETC' === $(li).data('value'));
  $('#input_relation_etc').val('');
  $('#input_relation_etc')
    .prop('disabled', !isETC)
    .prop('required', isETC)
    ;
}

function onclickPrintForm() {
  $('#btn_printForm').on('click', printForm);
}

function onclickResetForm() {
  $('#btn_resetForm').on('click', function() {
    if (window.confirm('초기화 하시겠습니까?')) {
      emptyInputs($('input,div.custom-dropdown'));
      $('input[value=AGREE_REQUIRED]').prop('checked', true);
      window.scroll({
        top: 0,
        behavior: 'smooth'
      });
    }
  });
}

/**
 * @description input 요소에 자동으로 폰트 사이즈 조정
 * @from jquery.inputfit.js
 * @link https://github.com/vxsx/jquery.inputfit.js/blob/master/jquery.inputfit.js
 * @event keyup.inputfit
 */
function initAutoFontSize() {
  // const $fontSizeInputs = $('input[data-auto],input[data-same$=_NAME]');
  const $fontSizeInputs = $('input[data-auto],input[data-type=name],input[data-same$=_NAME],input[data-type=address]');
  $fontSizeInputs.inputfit({
    min: 10,
    max: false,
  })
}

/**
 * @description 직접 입력하는 input이 아닌 경우 자동으로 폰트 사이즈 조정하는 이벤트 강제 발동
 * @param {jQuery Object} $target 
 */
function triggerAutoFontSize($target) {
  $target.trigger('keyup.inputfit');
}


/**
 * @description 백스페이스로 입력값을 모두 지웠을 때, 이전 sibling이 입력 요소이면 이전으로 이동
 * @param {Event} event 키 입력 이벤트
 * @param {Element} current 현재 요소
 */
function handleBackspace(event, current) {
  if (event.key === "Backspace" && !current.value) {
    let prev = current.previousElementSibling;
    if (prev && prev.tagName === "INPUT") {
      prev.focus();
    }
  }
}

/**
 * @description 입력 요소에 숫자만 입력하도록 강제하고, maxlength를 만족할 경우 다음 입력 요소로 이동
 * @param {Element} input 
 */
function forceInputNumberAndFocusNext(input) {
  forceInputNumber(input);
  focusNextInput(input);
}

/**
 * @description 입력 요소에 숫자만 입력하도록 강제
 * @param {Element} input 
 */
function forceInputNumber(input) {
  input.value = input.value.replace(/[^0-9]/g, '');
}

/**
 * @description 입력 요소의 maxlength를 만족할 경우 다음 입력 요소로 이동
 * @param {Element} input 
 */
// 생년월일 input 포커스 이동 및 숫자만 입력
function focusNextInput(current) {
  if (current.maxLength && current.maxLength === current.value.length) {
    let next = current.nextElementSibling;
    if (next && next.tagName === "INPUT") {
      next.value = '';
      next.focus();
    }
  }
}

/**
 * @description CMLink 요금제일 경우, CMLink 동의 항목 disabled=false
 * @param {Boolean} isRequired
 */
function toggleCMLinkAgree(isRequired) {
  // console.log(`CMLink Rates is ${isRequired ? 'required' : 'NOT required'}`);
  let cmlinkAgreeInputName;
  if (isRequired) {
    $('#cmlink_agree_text1').text('[필수 동의]');
    $('#cmlink_agree_text2').show();
    $('#cmlink_agree_check_icon').show();
    cmlinkAgreeInputName = $('input[data-origin=SAME_APPL_NAME]').val();
  } else {
    $('#cmlink_agree_text1').text('[선택 동의]');
    $('#cmlink_agree_text2').hide();
    $('#cmlink_agree_check_icon').hide();
    cmlinkAgreeInputName = '';
  }
  
  $('#cmlink_agree_input')
    .prop('disabled', !isRequired)
    // .prop('required', isRequired)
    .prop('readonly', isRequired)
    .val(cmlinkAgreeInputName)
  ;

  triggerAutoFontSize($('#cmlink_agree_input'));
}

/**
 * @description $targetPage 하위의 input 값 비우고 disabled = isAble[true/false] 및 $targetPage 화면 toggle(isable[true/false])
 * @param {*} $targetArea 
 * @param {*} isAble 
 */
function togglePageAbleDisable($targetPage, isAble) {
  toggleAreaAbleDisable($targetPage, isAble);
  if (isAble) {
    $targetPage.show();
  } else {
    $targetPage.hide();
  }
}

/**
 * @description $targetArea 하위의 input 값 비우고 disabled = isAble[true/false]
 * @param {*} $targetArea 
 * @param {*} isAble 
 */
function toggleAreaAbleDisable($targetArea, isAble) {
  const $inputs = $targetArea.find('input,div.custom-dropdown');
  $inputs.prop('disabled', !isAble);
  emptyInputs($inputs);
}

function toggleAbleDisable($targets, isAble) {
  $targets.prop('disabled', !isAble);
}

function toggleRequired($targets, isRequired) {
  $targets.prop('required', isRequired);
}

function toggleReadonly($targets, isReadonly) {
  $targets.prop('readonly', isReadonly);
}

/**
 * @description input 배열을 받아 값 비우기
 * @param {Array<Element>} $inputs 
 */
function emptyInputs($inputs) {
  // console.log('emptyInputs 값 비우기');
  $inputs.each(function(_, input) {
    if (input.tagName == 'DIV') {
      $(input).find('div.selected-option span').text('');
      return;
    }
    
    if (input.type == 'checkbox' || input.type == 'radio') {
      if (input.name.includes('agree_')){ // 필수동의항목인 경우
        $(input)
          .prop('checked', (input.value == 'AGREE_REQUIRED')) // 필수동의[동의]에 체크
          .prop('readonly', true)
          .prop('disabled', true)
      } else {
        input.checked = false;
      }
    } else {
      input.value = '';
    }
  });

  setDateAuto();
}

/**
 * @description img 요소의 src가 base64로 되어있을 경우 이미지 다운로드
 */
function downloadImage() {
  let time = 1000;
  return function () {
    let index = 1;
    const imgs = document.querySelectorAll('img');
    const targetAppend = document.querySelector('div.action-btn-group');
    imgs.forEach(function(img) {
      const a = document.createElement('a');
      const ext = img.src.replace(/data:image\/(\w{3,4}).+/g, '$1');
      a.download = `online_appl_image_${index}.${ext}`;
      a.id = `tempDownload_${index}`;
      a.innerText = `이미지_다운로드_${index}`;
      a.href = img.src;
      // console.log(`image ext = ${img.src.replace(/data:image\/(\w{3,4}).+/g, '$1')}`);

      targetAppend.append(a);
      index = index + 1;
      setTimeout(function() {
        a.click();
        a.remove();
      }, time += 500);
    });
  }
}

/**
 * @description 입력 요소 유효성 검사
 * @param {Element} el 
 * @returns boolean
 */
function isValid(el) {

  const isRequired = (el.required || el.getAttribute('required') !== null);
  const isDisabled = (el.disabled || el.getAttribute('disabled') !== null);
  const tagName = el.tagName;

  if (tagName !== 'INPUT' && tagName !== 'DIV') {
//	24년 취약점 점검 CWE-489 활성 디버그 코드 제거
//	console.error(tagName);
    return true;
  }
  if (isDisabled) {
    console.warn(`el.disabled is true, input is passed.`);
    return true;
  }
  if (!isRequired) {
    console.warn(`el.required is false, optional input is passed.`);
    return true;
  }
  
  const isDropdown = tagName == 'DIV'
                  && el.className.includes('custom-dropdown')
                  && el.getAttribute('required') !== null;
  if (isDropdown) {
    return !!el.querySelector('.selected-option span').innerText;
  }

  if (el.type == 'radio') {
    return Array.from(document.querySelectorAll('input[name=' + el.name + ']')).some(function (radio) { return radio.checked });
  }
  if (el.type == 'checkbox') {
    return el.checked;
  }

  const regexp = new RegExp(el.pattern);
  cutByMaxlength(el);
  if (el.type == 'text') {
    const result = regexp.test(el.value);
    return result;
  }
  if (el.type == 'number') {
    const result = regexp.test(el.value);
    return result;
  }
  if (el.type == 'tel') {
    const result = regexp.test(el.value);
    return result;
  }

  return true;
}

/**
 * @description 가입자 연락처와 판매자 연락처는 달라야 함
 * @description 가입자 연락처와 판매자 연락처가 같을 경우, 경고창 띄우고 진행 불가
 * @description [필수]판매자 연락처
 * @description [옵션]가입자 연락처
 * @returns booelan
 */
function isDiffPhoneNumber() {
  const subscriberPhoneNubmer = Array.from($('input[id^=subscriber_phone_nubmer]')).map(function(input) { return input.value; }).join('');
  const $sellerPhoneNubmer = $('#seller_phone_nubmer');
  const sellerPhoneNubmer = $sellerPhoneNubmer.val();

  // "가입자 연락처"와 "판매자 연락처" 비교
  if (subscriberPhoneNubmer == sellerPhoneNubmer) {
    // 진행 불가
    alert('"가입자연락처"와 "판매자연락처"는 달라야 함');
    $sellerPhoneNubmer.val('');
    $sellerPhoneNubmer.focus();
    return false;
  }
  
  const isNumberTransfer = ($('input[name=work_type]:checked').val() == 'WORK_TYPE_NUMBER_TRANSFER');
  if (isNumberTransfer) {
    // "번호이동할 전화번호"와 "판매자 연락처" 비교
    const transferPhoneNubmer = Array.from($('input[id^=transfer_phone_number]')).map(function(input) { return input.value; }).join('');
    if (transferPhoneNubmer == sellerPhoneNubmer) {
      // 진행 불가
      alert('"번호이동할 전화번호"와 "판매자연락처"는 달라야 함');
      $sellerPhoneNubmer.val('');
      $sellerPhoneNubmer.focus();
      return false;
    }
  }

  return true;
}

/**
 * @description 인쇄 전 전체 유효성 검사
 */
function isValidForm() {
  const isAllPassed = Array.from($('input,div.custom-dropdown')).every(function(el) {
    const isPassed = isValid(el);
    if (!isPassed) {
      el.focus({focusVisible: true});
    }
    return isPassed;
  });

  return isAllPassed;
}

/**
 * @description 인쇄
 */
function printForm() {
  if (!isValidForm()) {
    return;
  }
  if (!validateDateInput()){
    return;
  }
  if (!isDiffPhoneNumber()) {
    return;
  }


  const confirmMessage = [
    '성명: ', $('#subscriber_name').val(), '\n',
    '법정생년월일: ', Array.from($('#div_subs_birthday input')).reduce(function(acc, input) { return acc += input.value; }, ''), '\n', 
    '요금제: ', $('#span_selected_rates').text(), '\n',
    '\n',
    '가입신청서는 고객에게 제공해 주세요', '\n',
    '(신청서 등록 후, 유통망에서 별도 보관 금지)', '\n',
    '\n',
    '정확히 입력하셨나요?',
  ].join('');

  if (window.confirm(confirmMessage)) {
    window.print();
  }
}

function cutByMaxlength(el) {
  if (!el.maxlength) return;
  if (el.value && el.value.length > el.maxlength) {
    el.value = el.value.substr(0, el.maxlength);
  }
}

function getBytes(str, bytes, index, charCode) {
  for (bytes = index = 0; charCode = str.charCodeAt(index++); bytes += charCode >> 11 ? 3 : charCode >> 7 ? 2 : 1);
  return bytes;
}

function forceInputName(input) {
  input.value = input.value.replace(/[^ㄱ-ㅎ가-힣a-zA-Z\s]/g, '').replace(/\s{2,}/, ' ');
}

function forceBlurName(input) {
  // input.value = input.value.replace(/^\s+|\s+$/g, '');
  input.value = $.trim(input.value);
}

/**
 * @description placeholder y, m, d 인 jquery input 목록을 받아 ['yyyy','mm','dd'] 배열로 반환
 * @param {jquery inputs} $yyyymmddInputs 
 * @returns 
 */
function getYYYYMMDD($yyyymmddInputs) {
  return Array.from($yyyymmddInputs).reduce((res, input) => {
    if ('Y' == input.placeholder) { res[0] += input.value; }
    else if ('M' == input.placeholder) { res[1] += input.value; }
    else if ('D' == input.placeholder) { res[2] += input.value; }
    return res
  }, ['', '', '']);
}

/**
 * @description 각각 유효한 날짜인지 검증
 * @target #div_subs_birthday input : [페이지1] 가입자 법정생년월일
 * @target #valid_card_yy, #valid_card_mm : [페이지1][요금납부방법==카드자동이체] 카드유효기간
 * @target #div_card_birthday input : [페이지1][요금납부방법==카드자동이체] 카드주 법정생년월일
 * @target #div_depo_birthday input : [페이지7][요금납부방법==은행자동이체] 은행 자동납부신청서 예금주 법정생년월일
 * @target #div_legal_birthday input : [페이지8][고객구분==개인(청소년)] 청소년 법정대리인 법정생년월일
 * @target #?? input : [페이지8] 위임대리인 법정생년월일 은 안함
 */
function validateDateInput() {

  // [페이지1]가입자 법정생년월일
  if (!isValidDate(...getYYYYMMDD($('#div_subs_birthday input')))) {
    alert('유효한 법정생년월일을 입력하세요');
    $('#div_subs_birthday input').val('');
    $('#div_subs_birthday input:first-child').focus();
    return false;
  }

  // 요금납부방법[카드자동이체]인 경우 검사
  const isCard = ($('input[name=pay_method]:checked').val() == 'PAY_METHOD_CARD')
  if (isCard) {
    // [페이지1]카드유효기간
    if (!isValidDateForCard()) {
      alert('사용가능한 카드유효기간을 입력하세요');
      $('#valid_card_mm').val('');
      $('#valid_card_yy').val('').focus();
      return false;
    }

    // [페이지1]카드주 법정생년월일
    if (!isValidDate(...getYYYYMMDD($('#div_card_birthday input')))) {
      alert('유효한 카드주 법정생년월일을 입력하세요');
      $('#div_card_birthday input').val('');
      $('#div_card_birthday input:first-child').focus();
      return false;
    }
  }

  // 요금납부방법[은행자동이체]인 경우 검사
  const isAccount = ($('input[name=pay_method]:checked').val() == 'PAY_METHOD_ACCOUNT')
  if (isAccount) {
    // [페이지7]은행 자동납부신청서 예금주 법정생년월일 - 
    if (!isValidDate(...getYYYYMMDD($('#div_depo_birthday input')))) {
      alert('유효한 예금주 법정생년월일을 입력하세요');
      $('#div_depo_birthday input').val('');
      $('#div_depo_birthday input:first-child').focus();
      return false;
    }
  }

  // 고객구분[개인(청소년)]인 경우 검사
  const isMinor = ($('input[name=customer_type]:checked').val() == 'CUSTOMER_TYPE_MINOR');
  if (isMinor) {
    // [페이지8]청소년 법정대리인 법정생년월일
    if (!isValidDate(...getYYYYMMDD($('#div_legal_birthday input')))) {
      alert('유효한 청소년 법정대리인 생년월일을 입력하세요');
      $('#div_legal_birthday input').val('');
      $('#div_legal_birthday input:first-child').focus();
      return false;
    }
  }

  return true;
}

/**
 * @description 유효한 날짜인지 검증
 * @param {string} year 4자리 
 * @param {string} month 2자리
 * @param {string} day 2자리
 * @returns {boolean}
 */
function isValidDate(year, month, day) {
  const parsedYear = parseInt(year, 10);
  const parsedMonth = parseInt(month, 10);
  const parsedDay = parseInt(day, 10);

  if (
    isNaN(parsedYear) ||
    isNaN(parsedMonth) ||
    isNaN(parsedDay) ||
    parsedMonth < 1 ||
    parsedMonth > 12 ||
    parsedDay < 1
  ) {
    return false;
  }

  const maxDaysInMonth = new Date(parsedYear, parsedMonth, 0).getDate();

  return parsedDay <= maxDaysInMonth;
};

/**
 * @description 요금납부방법[카드자동이체]인 경우 카드유효기간 검사
 * @returns {boolean}
 */
function isValidDateForCard() {
  const year = `20${$('#valid_card_yy').val()}`
  const month = $('#valid_card_mm').val();
  const cd = new Date();
  return (
    isValidDate(year, month, '01')
    &&
    (
      Number(year) > cd.getFullYear()
      ||
      (Number(year) == cd.getFullYear() && Number(month) >= cd.getMonth() + 1)
    )
  );
}

/**
 * @description 00700 국제전화 가입신청서 화면으로 이동, 새 탭으로 열기
 * @since 2025/04/28(월) 온라인 서식지 개발 요청 (4차요청)
 */
function open00700() {
  const url = 'https://www.00700.com/global';
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (win) win.opener = null;
}

