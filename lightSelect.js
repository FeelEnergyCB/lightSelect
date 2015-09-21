'use strict';

var lightSelect = (function() {

  if ( !document.addEventListener ) {
    return function() {};
  }

  return function(select) {

    var selector = select.selector || 'select',
        customClass = select.customClass || 'lightSelect',
        selects = document.querySelectorAll(selector),
        template = document.createElement('div'),
        markup = '<input class="' + customClass + '__hidden" type="hidden" name="" value="" /> \
                  <div class="' + customClass + '__in"> \
                    <span class="' + customClass + '__title"></span> \
                    <i class="' + customClass + '__arrow"></i> \
                  </div> \
                  <ul class="' + customClass + '__list"> \
                  </ul>',
        hasSelected = false,
        selectClassList, selectName, selectOption, tempElem, tempElemUl, activeElem, completeElem;

        template.insertAdjacentHTML("afterBegin", markup);


    for (var i = 0, ilen = selects.length; i < ilen; i++) {

      tempElem = template.cloneNode(true);

      selectClassList = selects[i].className;
      selectName = selects[i].name;
      selectOption = selects[i].querySelectorAll('option');

      tempElem.className = customClass + ' ' + selectClassList;
      tempElem.querySelector( '.' + customClass + '__hidden' ).name = selectName;
      tempElemUl = tempElem.querySelector( '.' + customClass + '__list' );

      for (var j = 0, jlen = selectOption.length; j < jlen; j++) {
        tempElemUl.insertAdjacentHTML('beforeEnd', '<li class="'
          + customClass + '__item" data-value="'
          + selectOption[j].value +'">'
          + selectOption[j].innerHTML + '</li>');

        if (selectOption[j].selected) {
          hasSelected = true;
          tempElemUl.querySelector('li:last-child').className += ' ' + customClass + '__item_active';
        }

      }

      if ( !hasSelected ) {
        tempElem.querySelector('.' + customClass + '__item:first-child').className += ' ' + customClass + '__item_active';
      }

      activeElem = tempElem.querySelector('.' + customClass + '__item_active');

      tempElem.querySelector('.' + customClass + '__hidden').value = activeElem.getAttribute('data-value');
      tempElem.querySelector('.' + customClass + '__title').innerHTML = activeElem.innerHTML;

      tempElem.querySelector('.' + customClass + '__in').addEventListener('click', openSel, false);
      tempElem.querySelector('.' + customClass + '__list').addEventListener('click', selOption, false);

      completeElem = selects[i].parentNode.replaceChild(tempElem, selects[i]);

    }

    function openSel(event) {
      event.stopPropagation();

      var node = this,
          cl = customClass + '_opened';

      node = findParent(node);

      if ( node.className.indexOf(cl) < 0 ) {
        closeAll();
        node.className += ' ' + cl;
      } else {
        node.className =  node.className.replace(new RegExp(' ' + cl, 'g'), '');
      }
    }

    function selOption(event) {
      event.stopPropagation();

      if ( event.target.className.indexOf(customClass + '__item') < 0 ) return;

      var node = event.target,
          valueNode = node.getAttribute('data-value'),
          textNode = node.innerHTML,
          listLis = this.querySelectorAll('.' + customClass + '__item');

      for (var i = 0, len = listLis.length; i < len; i++) {
        if ( listLis[i].className.indexOf(customClass + '__item_active') >= 0 ) {
          listLis[i].className =  node.className.replace(new RegExp(' ' + customClass + '__item_active', 'g'), '');
        }
      }

      node.className += ' ' + customClass + '__item_active';

      node = findParent(node);

      node.querySelector('.' + customClass + '__hidden').value = valueNode;
      node.querySelector('.' + customClass + '__title').innerHTML = textNode;

      closeAll();
    }

    function closeAll() {
      var listNodes = document.querySelectorAll( '.' + customClass );

      for (var i = 0, len = listNodes.length; i < len; i++) {
        listNodes[i].className =  listNodes[i].className.replace(new RegExp(' ' + customClass + '_opened', 'g'), '');
      }
    }

    function findParent(elem) {
      while ( elem.className.indexOf(customClass + ' ') < 0 ) {
        elem = elem.parentNode;
      }
      return elem;
    }

    document.addEventListener('click', closeAll);

    document.addEventListener('keyup', function(event) {
      if (event.keyCode !== 27) return;
      closeAll();
    });

  }

}());