'use strict';

(function(window) {

  !window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
    WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
      var target = this;
   
      registry.unshift([target, type, listener, function (event) {
        event.currentTarget = target;
        event.preventDefault = function () { event.returnValue = false };
        event.stopPropagation = function () { event.cancelBubble = true };
        event.target = event.srcElement || target;
   
        listener.call(target, event);
      }]);
   
      this.attachEvent("on" + type, registry[0][3]);
    };
   
    WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
      for (var index = 0, register; register = registry[index]; ++index) {
        if (register[0] == this && register[1] == type && register[2] == listener) {
          return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
        }
      }
    };
   
    WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
      return this.fireEvent("on" + eventObject.type, eventObject);
    };
  })(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);

  var lightSelect =  function(select) {

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
        selectClassList, selectName, selectOption, tempElem, tempElemUl, tempElemLis, activeElem, completeElem,
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

      tempElem.querySelector('.' + customClass + '_in').addEventListener('click', openSel, false);
      tempElem.querySelector('.' + customClass + '_list').addEventListener('click', selOption, false);

      completeElem = selects[i].parentNode.replaceChild(tempElem, selects[i]);

    }

    function openSel(event) {
      var node = this;

      while ( node.className.indexOf(customClass + ' ') < 0 ) {
        node = node.parentNode;
      }
      if ( node.className.indexOf('is-opened') < 0 ) {
        node.className += ' is-opened';
      } else {
        node.className =  node.className.replace(/ is-opened/g, "");
      }
    }

    function selOption(event) {
      if ( event.target.className.indexOf(customClass + '_item') < 0 ) return;
      var node = event.target,
          valueNode = node.getAttribute('data-value'),
          textNode = node.innerHTML,
          listLis = this.querySelectorAll('.' + customClass + '_item');



      for (var i = 0, len = listLis.length; i < len; i++) {
        if ( listLis[i].className.indexOf('is-active') >= 0 ) {
          listLis[i].className =  node.className.replace(/ is-active/g, "");
        }
      }

      node.className += ' is-active';
      while ( node.className.indexOf(customClass + ' ') < 0 ) {
        node = node.parentNode;
      }

      node.querySelector('.' + customClass + '_hidden').value = valueNode;
      node.querySelector('.' + customClass + '_title').innerHTML = textNode;
    }

    document.addEventListener('click', function(event) {
      var node = event.target,
          listNodes = document.querySelectorAll( '.' + customClass );

      for (var i = 0, len = listNodes.length; i < len; i++) {
        listNodes[i].className =  listNodes[i].className.replace(/ is-opened/g, "");
      }

      if ( event.target.className.indexOf(customClass) >= 0) {

        while ( node.className.indexOf(customClass + ' ') < 0 ) {
          node = node.parentNode;
        }
        if ( node.className.indexOf('is-opened') < 0 ) {
          node.className += ' is-opened';
        }

      }
    });


    document.addEventListener('keyup', function(event) {
      var listNodes;
      if (event.keyCode !== 27) return;

      listNodes = document.querySelectorAll( '.' + customClass );
      for (var i = 0, len = listNodes.length; i < len; i++) {
        listNodes[i].className =  listNodes[i].className.replace(/ is-opened/g, "");
      }
    });

  }



  window.lightSelect = lightSelect;

}(window));




lightSelect({
  selector: '.select'
});
