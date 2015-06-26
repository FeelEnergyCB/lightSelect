'use strict';

lightSelect({
  selector: '.select'
});

function lightSelect(select) {

  var selector = select.selector || 'select',
      customClass = select.customClass || 'lightSelect',
      selects = document.querySelectorAll(selector),
      template = document.createElement('div'),
      markup = '<input class="' + customClass + '_hidden" type="hidden" name="" value="" /> \
                <div class="' + customClass + '_in"> \
                  <span class="' + customClass + '_title"></span> \
                  <i class="' + customClass + '_arrow"></i> \
                </div> \
                <ul class="' + customClass + '_list"> \
                </ul>',
      selectClassList, selectName, selectOption, tempElem, tempElemUl, activeElem, completeElem,
      hasSelected = false;

      template.insertAdjacentHTML("afterBegin", markup);

  for (var i = 0, ilen = selects.length; i < ilen; i++) {

    tempElem = template.cloneNode(true);

    selectClassList = selects[i].className;
    selectName = selects[i].name;

    tempElem.className = customClass + ' ' + selectClassList;
    tempElem.querySelector( '.' + customClass + '_hidden' ).name = selectName;
    selectOption = selects[i].querySelectorAll( 'option' );
    tempElemUl = tempElem.querySelector( '.' + customClass + '_list' );

    for (var j = 0, jlen = selectOption.length; j < jlen; j++) {
      tempElemUl.insertAdjacentHTML("beforeEnd", '<li class="' + customClass + '_item" data-value="' + selectOption[j].value +'">' + selectOption[j].innerHTML + '</li> ');
      if ( selectOption[j].selected ) {
        hasSelected = true;
        tempElemUl.querySelector('li:last-child').className += ' is-active';
      }
    }

    if ( !hasSelected ) {
      tempElem.querySelector('.' + customClass + '_item:first-child').className += ' is-active';
    }

    activeElem = tempElem.querySelector('.' + customClass + '_item.is-active');

    tempElem.querySelector('.' + customClass + '_hidden').value = activeElem.getAttribute('data-value');
    tempElem.querySelector('.' + customClass + '_title').innerHTML = activeElem.innerHTML;
    
    
    
    completeElem = selects[i].parentNode.replaceChild(tempElem, selects[i]);

  }
}
