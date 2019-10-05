$(document).ready(function () {
  $('.toolContainer, .toolContainerSmall').on('click', function () {
    let open;
    let selector = findInner($(this));
    if ($(selector).attr('class').indexOf('open') != -1) {
      let toolContainerCloseAnim = anime({
        targets: selector,
        height: 0,
        easing: 'easeInOutQuart',
        complete: toolContainerAnim($(this).find('span'), 'close')
      });
      $(selector).removeClass('open');
    } else {
      let toolContainerOpenAnim = anime({
        targets: selector,
        height: $(`${selector} .converter`).height() + 40,
        easing: 'easeInOutQuart',
        complete: toolContainerAnim($(this).find('span'), 'open')
      });
      $(selector).addClass('open');
    }
  });

  $('.toolContainer').on('click', function () {
    writeLink();
  });

  readLink();

  $('textarea').each(function () {
    this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
  }).on('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  $('#emojiText').on('keyup', function () {
    $('#emojiTextRes').val(emojiText($(this).val()));
    $('.emojiText .characterCount').text(characterCount('#emojiTextRes'));
  });

  $('#clappify').on('keyup', function () {
    $('#clappifyRes').val(clappify($(this).val()));
    $('.clappify .characterCount').text(characterCount('#clappifyRes'));
  });

  $('#clappifyDeluxeText').on('keyup', function () {
    $('#clappifyDeluxeRes').val(clappifyDeluxe($(this).val(), $('#clappifyDeluxeEmote').val()));
    $('.clappifyDeluxe .characterCount').text(characterCount('#clappifyDeluxeRes'));
  });
  $('#clappifyDeluxeEmote').on('keyup', function () {
    $('#clappifyDeluxeRes').val(clappifyDeluxe($('#clappifyDeluxeText').val(), $(this).val()));
    $('.clappifyDeluxe .characterCount').text(characterCount('#clappifyDeluxeRes'));
  });

  $('textarea.input').on('keyup', function () {
    let $count = $(this).parent().find('span');
    if ($count.text() > 2000) {
      $count.css('color', '#F44336');
    } else {
      if (!document.styleSheets[2].disabled) {
        $count.css('color', 'white');
      } else {
        $count.css('color', 'black');
      }

    }
  });

  let clipboard = new ClipboardJS('.button');

  $(window).on('resize', function () {
    $('.toolContainerInner').each(function () {
      if ($(this).hasClass('open')) {
        let toolContainerCorrectAnim = anime({
          targets: this,
          height: $('.toolContainerInner .converter').height() + 40,
          easing: 'easeInOutQuart'
        });
      }
    });
    moveFix();
  });

  $('#siteSwitch').on('click', function () {
    if ($(this).text() == 'Home') {
      switchText(this, 'Info');
    } else {
      switchText(this, 'Home');
    }
    move();
  });

  $('#themeSwitch').on('click', function () {
    switchCSS({ "object": this });
    writeLink();
  });

  $('.gridBoxGenerator .button').each(function () {
    $(this).append(`<div class='infoButton'>`);
  });

  $.get('md/modules.md', function (text) {
    let converter = new showdown.Converter({
      tasklists: 'true',
      omitExtraWLInCodeBlocks: 'true',
      tables: 'true',
      headerLevelStart: 'true',
      customizedHeaderId: true
    })
    let html = converter.makeHtml(text)
    $(".infobar #moduleInfo").html(html);
  });

  $('.gridBoxGenerator .button .infoButton').on('click', function () {
    $(this).parent().click();
    let scrollTo = $(this).parent().attr('value').toLowerCase().replace(new RegExp('/', 'g'), '_');
    let infoBoxOpenAnim = anime({
      targets: `aside.infobar`,
      easing: 'easeInOutExpo',
      left: 0,
      complete: function (i, el) {
        $('aside.infobar .infobarCloser').fadeIn(200);
      }
    });

    scrollToAnchor(scrollTo, (($(document).width() / 100) * 0.4));
  });

  $('aside.infobar .infobarCloser').on('click', function () {
    let left = 0;
    if ($(window).width() > 1160) {
      left = '-35vw';
    } else {
      left = '-100vw';
    }
    let infoBoxOpenAnim = anime({
      begin: function (i, el) {
        $('aside.infobar .infobarCloser').fadeOut(200);
      },
      targets: 'aside.infobar',
      easing: 'easeInOutExpo',
      left: left
    })
  });

  $('.gridBoxGenerator .button:not(.disabled)').on('click', function () {
    $(this).toggleClass('selected');
    $('#customaRes code').text(getSelectedModules());
    $('code.hljs').each(function (i, block) {
      hljs.highlightBlock(block);
    });
  });
});

// Converters

/**
 * Converts input text to Emoji Text
 * @param {String} input Input from a textfield which gets converted in this method
 * @returns {String} Return field, which stores the converted text 
 */
function emojiText(input) {
  if (input != "") {
    let splitToConvert = input.split("");
    let readyResult = "";
    for (let i = 0; i < splitToConvert.length; i++) {
      splitToConvert[i] = splitToConvert[i].toLowerCase();

      if (isNumeric(splitToConvert[i]) ||
          isLetter(splitToConvert, i) ||
          splitToConvert[i] == ' ' ||
          splitToConvert[i] == '?' ||
          splitToConvert[i] == '!') {
        switch (splitToConvert[i]) {
          case ' ': readyResult += '    '; break;
          case '!': readyResult += ':exclamation: '; break;
          case '?': readyResult += ':question: ';    break;
          case '0': readyResult += ':zero: ';        break;
          case '1': readyResult += ':one: ';         break;
          case '2': readyResult += ':two: ';         break;
          case '3': readyResult += ':three: ';       break;
          case '4': readyResult += ':four: ';        break;
          case '5': readyResult += ':five: ';        break;
          case '6': readyResult += ':six: ';         break;
          case '7': readyResult += ':seven: ';       break;
          case '8': readyResult += ':eight: ';       break;
          case '9': readyResult += ':nine: ';        break;
          default:  readyResult += `:regional_indicator_${splitToConvert[i]}: `; break;
        }
      }
    }
    return readyResult;
  }
}
/**
 * Adds ':clap:' to input text
 * @param {String} input Input from a textfield which gets converted in this method
 * @returns {String} Return field, which stores the converted text
 */
function clappify(input) {
  return clappifyDeluxe(input, ":clap:");
}
/**
 * Adds a custom emote to the input text
 * @param {String} input Input from a textfield which gets converted in this method
 * @param {String} emote Input from a textfield which is being injected in above defined text
 * @returns {String} Return field, which stores the converted text
 */
function clappifyDeluxe(input, emote) {
  return input.replace(/ |$/g, ` ${emote} `);
}
/**
 * Checks if a String is a number
 * @param {String} n String to checkk whether it is numeric or not
 * @returns {Boolean} returns if input is numeric
 */
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
/**
 * Checks if a specific character is a letter according to ASCII or if it is an Umlaut (Ger), if that is the chase, it gets converted into characters -> ä = ae, ö = oe, ü = ue, ß = ss
 * @param {Array} array Array of characters
 * @param {int} i Position in above defined array 
 * @returns {boolean} Returns whether the character meets the requirements stated above or not
 */
function isLetter(array, i) {
  let currentChar = array[i];
  if (((currentChar > '@') && (currentChar < '[')) || ((currentChar > '`') && (currentChar < '{'))) {
    return true;
  } else {
    switch (currentChar) {
      case '\u00e4':
        array[i] = 'a';
        array.insert(i + 1, 'e');
        return true;
      case '\u00f6':
        array[i] = 'o';
        array.insert(i + 1, 'e');
        return true;
      case '\u00fc':
        array[i] = 'u';
        array.insert(i + 1, 'e');
        return true;
      case '\u00df':
        array[i] = 's';
        array.insert(i + 1, 's');
        return true;
      default:
        return false;
    }
  }
}
/**
 * Used to return how many characters are within a given element
 * @param {String} el String of an element to be found with jquery within the function
 * @returns {int} Number of letters/characters within the handed over element
 */
function characterCount(el) {
  return $(el).val().split('').length;
}

// Expanding Functions

/**
 * Function used to insert object in an array at a given place
 * @param {int} index Index of Array that this function is expanding
 * @param {Object} item Object which will be put into the defined place in the array
 */
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};
function findInner(el) {
  let selectorArray = el.attr('class').split(" ");
  for (let i = 0; i < selectorArray.length; i++) {
    if (selectorArray[i].indexOf('toolContainer') != -1) {
      selectorArray[i] = '.toolContainerInner';
    } else {
      selectorArray[i] = `.${selectorArray[i]}`;
    }
  }
  return selectorArray.join("");
}

// Animations

function toolContainerAnim(el, state) {
  if (state == 'open') {
    el.addClass('upsidedown');
  } else {
    el.removeClass('upsidedown');
  }
}
/**
 * Function expanding HTMLElement to conveniently change the Text of a view buttons on the page
 * @param {String} newText New Text the button should hold
 */
function switchText(object, newText) {
  $(object).fadeToggle(200, function () {
    $(object).text(newText);
    $(object).fadeToggle(200);
  });
}
function move() {
  if (!$('.info').hasClass('active')) {
    let moveInfo = anime({
      targets: 'main',
      translateX: 0 - $(window).width(),
      easing: 'easeInOutExpo',
      elasticity: 300,
      complete: changeClass('info')
    });
  } else {
    let moveInfo = anime({
      targets: 'main',
      translateX: 0,
      easing: 'easeInOutExpo',
      elasticity: 300,
      complete: changeClass('home')
    });
  }
}
function moveFix() {
  if ($('.info').hasClass('active')) {
    let moveInfo = anime({
      targets: 'main',
      translateX: 0 - $(window).width(),
      easing: 'easeInOutExpo',
      elasticity: 300
    });
  } else {
    let moveInfo = anime({
      targets: 'main',
      translateX: 0,
      easing: 'easeInOutExpo',
      elasticity: 300
    });
  }
}
function scrollToAnchor(aid, aidOffset) {
  let oldScrollTop = $('aside.infobar').scrollTop();
  $('aside.infobar').scrollTop(0);
  let scrollVal = ($(`h3#${aid}`).offset().top) - aidOffset - $('html, body').scrollTop();
  $('aside.infobar').scrollTop(oldScrollTop);

  let target = 'aside.infobar';
  let scrollToAnimation = anime({
    targets: `aside.infobar`,
    easing: 'easeInOutExpo',
    scrollTop: scrollVal
  });
}

function switchCSS(option) {
  let state = '';
  let object = '';
  if (option['state'] == undefined) {
    state = $(option['object']).text().toLowerCase();
    option = option['object'];
  } else {
    state = option['state'];
    option = '#themeSwitch';
  }
  if (state.indexOf('dark') != -1) {
    switchText(option, 'White Mode');
    document.styleSheets[2].disabled = false;
  } else {
    switchText(option, 'Dark Mode');
    document.styleSheets[2].disabled = true;
  }
}
function changeClass(state) {
  if (state == 'info') {
    $('.info').addClass('active');
    $('.home').removeClass('active');
    $('body').css('overflow-y', 'hidden');
    $('html, body').stop().animate({
      scrollTop: 0
    }, 1000, 'swing');
  } else {
    $('.home').addClass('active');
    $('.info').removeClass('active');
    $('body').css('overflow-y', 'auto');
  }
}
function getSelectedModules() {
  let selectedButtons = $('.gridBoxGenerator .button.selected');
  let returnString = '';
  for (let i = 0; i < selectedButtons.length; i++) {
    returnString += `@import url('https://raw.githack.com/Customa/Customa/master/${$(selectedButtons[i]).attr('value')}.m.css');\n`;
  }

  return returnString;
}

function readStringFromFileAtPath(pathOfFileToReadFrom) {
  let request = new XMLHttpRequest();
  request.open("GET", pathOfFileToReadFrom, false);
  request.send(null);
  let returnValue = request.responseText;

  return returnValue;
}

function readLink() {
  // URL Syntax = .../?gen=[genID1]&[genID2]&...?theme=dark
  let url = window.location.href.split('?');
  let type = '';
  let option = '';
  let part = '';
  let setCSS = false;
  for (let i = 0; i < url.length; i++) {
    if (i != 0) {
      part = url[i].split('=');
      type = part[0];
      option = part[1];
      switch (type) {
        case 'gen':
          let generators = option.split('&');
          for (let j = 0; j < generators.length; j++) {
            $(`.toolContainer.${generators[j]}`).click();
          }
          break;
        case 'theme':
          switchCSS({ "state": option });
          setCSS = true;
          break;
        default:
          break;
      }
    }
  }
  if (!setCSS) {
    switchCSS({ "state": 'white' });
  }
}

function writeLink() {
  let link = window.location.href.split('?')[0];
  let generators = fetchGenerators();
  let genLink = `?gen=`;
  for (let i = 0; i < generators.length; i++) {
    genLink += generators[i];
    if (generators.length != 1 && i != generators.length - 1) {
      genLink += '&';
    }
  }
  if (genLink == '?gen=') {
    genLink = '';
  }
  link += genLink;
  if (fetchTheme() == 'dark') {
    link += `?theme=${fetchTheme()}`;
  }
  window.history.pushState(null, null, link);
}

function fetchGenerators() {
  let openContainers = $('.toolContainerInner.open');
  let openClasses = '';
  let className = '';
  for (let i = 0; i < openContainers.length; i++) {
    let className = openContainers[i].className.split(" ");
    for (let j = 0; j < className.length; j++) {
      if (className[j] != 'toolContainerInner' && className[j] != 'open') {
        openClasses += `${className[j]} `;
      }
    }
  }
  openClasses = openClasses.split(" ").slice(0, this.length - 1);
  return openClasses;
}

function fetchTheme() {
  if (!document.styleSheets[2].disabled) {
    return 'dark';
  } else {
    return '';
  }
}
