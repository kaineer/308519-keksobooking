'use strict';

function random(x) {
  return Math.floor((Math.random() * x));
}

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

function featuresList() {
  var list = [];
  var a = Math.floor((Math.random() * 1000000));
  a = a + '';
  for (var i = 0; i < (a).length; i++) {
    if (a[i] > '4') {
      list.push(featuresValues[i]);
    }
  }
  return list;
}

var adverts = [];
for (var i = 0; i < 8; i++) {
  adverts[i] = {
    'author': {
      'avatar': 'img/avatars/user' + avatarValues.splice(random(avatarValues.length), 1) + '.png'
    },
    'offer': {
      'title': titleValues.splice(random(titleValues.length), 1),
      'address': '{{location.x}}, {{location.y}}',
      'price': random(999000) + 1000,
      'type': typeValues[random(2)],
      'rooms': random(4) + 1,
      'guests': random(10) + 1,
      'checkin': checkValues[random(2)],
      'checkout': checkValues[random(2)],
      'features': featuresList(),
      'description': '',
      'photos': [],
      'location': {
        'x': random(600) + 300,
        'y': random(400) + 100
      }
    }
  };
}

document.querySelector('.map').classList.remove('map--faded');

var similarListElement = document.querySelector('.map__pins');
var similarLabelTemplate = document.querySelector('template').content.querySelector('.map__pin');

var renderAdvert = function (advert) {
  var advertLabel = similarLabelTemplate.cloneNode(true);
  advertLabel.style.left = advert.offer.location.x - 20 + 'px';
  advertLabel.style.top = advert.offer.location.y - 58 + 'px';
  advertLabel.querySelector('img').src = advert.author.avatar;
  advertLabel.querySelector('img').width = '40';
  advertLabel.querySelector('img').height = '40';
  advertLabel.querySelector('img').draggable = 'false';
  return advertLabel;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < adverts.length; i++) {
  var rrr = renderAdvert(adverts[i]);

  fragment.appendChild(rrr);
}
similarListElement.appendChild(fragment);

var similarAdvertTemplate = document.querySelector('template').content;

var advertElement = similarAdvertTemplate.cloneNode(true);

advertElement.querySelector('h3').textContent = adverts[0].offer.title;
advertElement.querySelector('.popup__price').innerHTML = adverts[0].offer.price + '&#x20bd;/ночь';

switch (adverts[0].offer.type) {
  case 'flat': advertElement.querySelector('h4').textContent = 'Квартира';
    break;
  case 'house': advertElement.querySelector('h4').textContent = 'Дом';
    break;
  case 'bungalo': advertElement.querySelector('h4').textContent = 'Бунгало';
    break;
}

var form = ' комнаты ';
if (adverts[0].offer.rooms === 1) {
  form = ' комната ';
}
if (adverts[0].offer.rooms === 5) {
  form = ' комнат ';
}

if (adverts[0].offer.guests > 1) {
  advertElement.querySelectorAll('p')[2].textContent = adverts[0].offer.rooms + form + ' для ' + adverts[0].offer.guests + ' гостей';
} else {
  advertElement.querySelectorAll('p')[2].textContent = adverts[0].offer.rooms + form + ' для ' + adverts[0].offer.guests + ' гостя';
}

advertElement.querySelectorAll('p')[3].textContent = 'Заезд после ' + adverts[0].offer.checkin + ' выезд до ' + adverts[0].offer.checkout;

var flag;
var j;
for (i = 0; i < featuresValues.length; i++) {
  flag = false;
  j = 0;
  while (!flag && j < adverts[0].offer.features.length) {
    if (adverts[0].offer.features[j] === featuresValues[i]) {
      flag = true;
    }
    j++;
  }
  if (!flag) {
    var featuresListAll = advertElement.querySelectorAll('.popup__features');
    featuresListAll[0].removeChild(advertElement.querySelector('.feature--' + featuresValues[i]));
  }
}

advertElement.querySelectorAll('p')[4].textContent = adverts[0].offer.description;
advertElement.querySelector('.popup__avatar').src = adverts[0].author.avatar;

document.querySelector('.map').insertBefore(advertElement, document.querySelector('.map__filters-container'));
