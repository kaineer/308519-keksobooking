'use strict';
var ESC_KEYCODE = 27;

function random(x, y) {
  if (typeof (y) === 'undefined') {
    return Math.floor((Math.random() * (x + 1)));
  } else {
    return Math.floor((Math.random() * (y - x + 1)) + x);
  }
}

function pluralize(form1, form2, form5, number) {
  var units = number % 10;
  var tens = Math.floor(number / 10);

  if (tens === 1 || units > 4) {
    return form5;
  } else if (units === 1) {
    return form1;
  } else {
    return form2;
  }
};

var avatarValues = ['01', '02', '03', '04', '05', '06', '07', '08'];
var titleValues = ['Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'];
var typeValues = ['flat', 'house', 'bungalo'];
var checkValues = ['12:00', '13:00', '14:00'];
var featuresValues = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var advertTitles = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало'
};

function featuresList() {
  var list = [];
  var randomFeatures = random(64);
  for (var i = 0; i < 6; i++) {
    if (randomFeatures % 2) {
      randomFeatures = (randomFeatures - 1) / 2;
      list.push(featuresValues[i]);
    } else {
      randomFeatures = randomFeatures / 2;
    }
  }
  return list;
}

var generateLocation = function () {
  return {
    x: random(300, 900),
    y: random(100, 500)
  };
};

var generateAuthor = function () {
  return {
    avatar: 'img/avatars/user' + avatarValues.splice(random(avatarValues.length - 1), 1) + '.png'
  };
};

var generateAdvert = function () {
  var loc = generateLocation();

  return {
    author: generateAuthor(),
    offer: {
      title: titleValues.splice(random(titleValues.length - 1), 1),
      address: loc.x + ', ' + loc.y,
      price: random(1000, 1000000),
      type: typeValues[random(2)],
      rooms: random(4) + 1,
      guests: random(10) + 1,
      checkin: checkValues[random(2)],
      checkout: checkValues[random(2)],
      features: featuresList(),
      description: '',
      photos: [],
      location: loc
    }
  };
};

var adverts = [];

var generateAdverts = function () {
  for (var i = 0; i < 8; i++) {
    adverts.push(generateAdvert());
  }
};

var renderFeatures = function (features, element) {
  var featuresFragment = document.createDocumentFragment();
  element.innerHTML = '';

  features.forEach(function (feature) {
    var span = document.createElement('li');
    span.classList.add('feature');
    span.classList.add('feature--' + feature);
    featuresFragment.appendChild(span);
  });

  element.appendChild(featuresFragment);
};

// заполнение карточки объявления ==================================================
function renderAdvert(advertElement, advert) {
  var offer = advert.offer;

  advertElement.querySelector('h3').textContent = offer.title;
  advertElement.querySelector('.popup__price').innerHTML = offer.price + '&#x20bd;/ночь';

  advertElement.querySelector('h4').textContent = advertTitles[offer.type];

  var para = advertElement.querySelectorAll('p');

  para[2].textContent = (
    offer.rooms + ' ' + pluralize('комната', 'комнаты', 'комнат', offer.rooms) +
    ' для ' + offer.guests + ' ' + pluralize('гостя', 'гостей', 'гостей', offer.guests)
  );

  para[3].textContent = (
    'Заезд после ' + offer.checkin + ' выезд до ' + offer.checkout
  );

  para[4].textContent = offer.description;

  renderFeatures(offer.features, advertElement.querySelector('.popup__features'));

  advertElement.querySelector('.popup__avatar').src = advert.author.avatar;

  return advertElement;
}

var initPopup = function () {
  document.querySelector('.map').insertBefore(
      document.querySelector('template').content.querySelector('article').cloneNode(true),
      document.querySelector('.map__filters-container')
  );

  // закрытие карточки объявления
  function closePopup() {
    document.querySelector('.popup').classList.add('hidden');
    document.querySelector('.map__pin--active').classList.remove('map__pin--active');
  }
  document.querySelector('.popup').querySelector('.popup__close').addEventListener('click', closePopup);
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEYCODE && document.querySelector('.map__pin--active') !== null) {
      closePopup();
    }
  });

  document.querySelector('.popup').classList.add('hidden');
};

var fieldsets = {
  nodes: document.querySelectorAll('fieldset'),

  disable: function () {
    for (var i = 0; i < this.nodes; i++) {
      this.nodes[i].disabled = true;
    }
  },

  enable: function () {
    for (var i = 0; i < this.nodes; i++) {
      this.nodes[i].disabled = false;
    }
  }
};

var OFFSET_X = 20;
var OFFSET_Y = 58;

var similarLabelTemplate = document.querySelector('template').content.querySelector('.map__pin');
// рисуем пины
var renderPin = function (advert) {
  var advertLabel = similarLabelTemplate.cloneNode(true);
  advertLabel.style.left = advert.offer.location.x - OFFSET_X + 'px';
  advertLabel.style.top = advert.offer.location.y - OFFSET_Y + 'px';
  var advertLabelImage = advertLabel.querySelector('img');
  advertLabelImage.src = advert.author.avatar;
  advertLabelImage.width = '40';
  advertLabelImage.height = '40';
  advertLabelImage.draggable = 'false';
  return advertLabel;
};

var onPinClick = function (event) {
  var popup = document.querySelector('.popup');
  var activePin = document.querySelector('.map__pin--active');
  var pin = event.target.closest('.map__pin');

  if (activePin !== null) {
    activePin.classList.remove('map__pin--active');
  } else {
    popup.classList.remove('hidden');
  }

  pin.classList.add('map__pin--active');
  renderAdvert(popup, adverts[pin.dataset.value]);
};

var renderPins = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < adverts.length; i++) {
    var pin = renderPin(adverts[i]);
    pin.dataset.value = i;
    pin.setAttribute('tabindex', 0);
    pin.addEventListener('click', onPinClick);
    fragment.appendChild(pin);
  }
  document.querySelector('.map__pins').appendChild(fragment);
};

var onMainPinClick = function () {
  // убираем затемнение
  document.querySelector('.map').classList.remove('map--faded');

  renderPins();

  fieldsets.enable();
};

var initMainPin = function () {
  document.querySelector('.map__pin--main').addEventListener('click', onMainPinClick);
};

var initMap = function () {
  generateAdverts();
  initPopup();
  fieldsets.disable();
  initMainPin();
};

initMap();
