'use strict';
// модуль, который работает с формой объявления

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormFieldset = adForm.querySelectorAll('fieldset');

  // блок с картой находится в неактивном состоянии, форма подачи заявления заблокирована
  var toggleDisabledForm = function (formDisabled) {
    adForm.classList.toggle('ad-form--disabled', formDisabled);
    for (var i = 0; i < adFormFieldset.length; i++) {
      adFormFieldset[i].disabled = formDisabled;
    }
  };
  var inputLocation = adForm.querySelector('input[name="address"]');

  var fillAddress = function () {
    inputLocation.value = window.map.getMainPinCords();
  };

  fillAddress();

  // п. 2.5. ТЗ Поля «Время заезда» и «Время выезда» синхронизированы:
  // при изменении значения одного поля, во втором выделяется соответствующее ему.
  // Например, если время заезда указано «после 14», то время выезда будет равно «до 14» и наоборот

  var adFormTimeInField = adForm.querySelector('#timein');
  var adFormTimeOutField = adForm.querySelector('#timeout');

  var syncFormTimeFields = function (timeSrc, timeDst) {
    timeDst.value = timeSrc.value;
  };

  adFormTimeInField.addEventListener('change', function () {
    syncFormTimeFields(adFormTimeInField, adFormTimeOutField);
  });

  adFormTimeOutField.addEventListener('change', function () {
    syncFormTimeFields(adFormTimeOutField, adFormTimeInField);
  });

  // Поле «Количество комнат» синхронизировано с полем «Количество мест» таким образом,
  // что при выборе количества комнат вводятся ограничения на допустимые варианты выбора количества гостей
  // 1 комната — «для 1 гостя»;   2 комнаты — «для 2 гостей» или «для 1 гостя»;
  // 3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»;
  // 100 комнат — «не для гостей»;
  var adFormRoomNumberField = adForm.querySelector('#room_number');
  var adFormCapacityField = adForm.querySelector('#capacity');

  var checkRoomCapacity = function () {
    var roomNumber = parseInt(adFormRoomNumberField.value, 10);
    var guestCount = parseInt(adFormCapacityField.value, 10);

    if (roomNumber === 100 && guestCount > 0) {
      adFormCapacityField.setCustomValidity('Доступно только не для гостей');
    } else if (roomNumber < 100 && guestCount === 0) {
      adFormCapacityField.setCustomValidity('Выберите количество гостей');
    } else if (guestCount > roomNumber) {
      adFormCapacityField.setCustomValidity('Максимум гостей: ' + roomNumber);
    } else {
      adFormCapacityField.setCustomValidity('');
    }
    adFormCapacityField.checkValidity();
  };

  adFormCapacityField.addEventListener('change', checkRoomCapacity);
  adFormRoomNumberField.addEventListener('change', checkRoomCapacity);

  var adFormPriceField = adForm.querySelector('#price');
  var adFormRoomTypeField = adForm.querySelector('#type');

  var changeFormMinPriceForHouseType = function () {
    var minPrice = window.data.getMinPriceForHouseType(adFormRoomTypeField.value);
    adFormPriceField.setAttribute('min', minPrice);
    adFormPriceField.setAttribute('placeholder', minPrice);
  };

  adFormRoomTypeField.addEventListener('change', changeFormMinPriceForHouseType);

  toggleDisabledForm(true);
  changeFormMinPriceForHouseType();
  checkRoomCapacity();

  window.form = {
    adForm: adForm,
    fillAddress: fillAddress,
    toggleDisabledForm: toggleDisabledForm,
    checkRoomCapacity: checkRoomCapacity,
    changeFormMinPriceForHouseType: changeFormMinPriceForHouseType
  };

})();
