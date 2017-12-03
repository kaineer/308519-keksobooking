'use strict';

function random(x, y) {
  if (typeof (y) === 'undefined') {
    return Math.floor((Math.random() * (x + 1)));
  } else {
    return Math.floor((Math.random() * (y - x + 1)) + x);
  }
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

var adverts = [];
var locationX;
var locationY;
for (var i = 0; i < 8; i++) {
  locationX = random(300, 900);
  locationY = random(100, 500);
  adverts[i] = {
    'author': {
      'avatar': 'img/avatars/user' + avatarValues.splice(random(avatarValues.length - 1), 1) + '.png'
    },
    'offer': {
      'title': titleValues.splice(random(titleValues.length), 1),
      'address': locationX + ', ' + locationY,
      'price': random(1000, 1000000),
      'type': typeValues[random(2)],
      'rooms': random(4) + 1,
      'guests': random(10) + 1,
      'checkin': checkValues[random(2)],
      'checkout': checkValues[random(2)],
      'features': featuresList(),
      'description': '',
      'photos': [],
      'location': {
        'x': locationX,
        'y': locationY
      }
    }
  };
}

document.querySelector('.map').classList.remove('map--faded');

var OFFSET_X = 20;
var OFFSET_Y = 58;

var similarLabelTemplate = document.querySelector('template').content.querySelector('.map__pin');

var renderAdvert = function (advert) {
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

var fragment = document.createDocumentFragment();
for (i = 0; i < adverts.length; i++) {
  fragment.appendChild(renderAdvert(adverts[i]));
}

document.querySelector('.map__pins').appendChild(fragment);


function advertAssembling(advertElement, advertNumber) {

  advertElement.querySelector('h3').textContent = adverts[advertNumber].offer.title;
  advertElement.querySelector('.popup__price').innerHTML = adverts[advertNumber].offer.price + '&#x20bd;/ночь';

  // switch (adverts[0].offer.type) {
  //   case 'flat':
  //     advertElement.querySelector('h4').textContent = 'Квартира';
  //     break;
  //   case 'house':
  //     advertElement.querySelector('h4').textContent = 'Дом';
  //     break;
  //   case 'bungalo':
  //     advertElement.querySelector('h4').textContent = 'Бунгало';
  //     break;
  // }

  function advertTitles(advertValue) {
    switch (advertValue) {
      case 'flat':
        return 'Квартира';
      case 'house':
        return 'Дом';
      case 'bungalo':
        return 'Бунгало';
    }
    return 'чево чево';
  }

  advertElement.querySelector('h4').textContent = advertTitles(adverts[advertNumber].offer.type);

  var form = ' комнаты ';
  if (adverts[advertNumber].offer.rooms === 1) {
    form = ' комната ';
  }
  if (adverts[advertNumber].offer.rooms === 5) {
    form = ' комнат ';
  }

  if (adverts[advertNumber].offer.guests > 1) {
    advertElement.querySelectorAll('p')[2].textContent = adverts[advertNumber].offer.rooms + form + ' для ' + adverts[advertNumber].offer.guests + ' гостей';
  } else {
    advertElement.querySelectorAll('p')[2].textContent = adverts[advertNumber].offer.rooms + form + ' для ' + adverts[advertNumber].offer.guests + ' гостя';
  }

  advertElement.querySelectorAll('p')[3].textContent = 'Заезд после ' + adverts[advertNumber].offer.checkin + ' выезд до ' + adverts[advertNumber].offer.checkout;

  var flag;
  var j;
  for (i = 0; i < featuresValues.length; i++) {
    flag = false;
    j = 0;
    while (!flag && j < adverts[advertNumber].offer.features.length) {
      if (adverts[advertNumber].offer.features[j] === featuresValues[i]) {
        flag = true;
      }
      j++;
    }
    if (!flag) {
      var featuresListAll = advertElement.querySelectorAll('.popup__features');
      featuresListAll[advertNumber].removeChild(advertElement.querySelector('.feature--' + featuresValues[i]));
    }
  }

  advertElement.querySelectorAll('p')[4].textContent = adverts[advertNumber].offer.description;
  advertElement.querySelector('.popup__avatar').src = adverts[advertNumber].author.avatar;

  return advertElement;
}

document.querySelector('.map').insertBefore(advertAssembling(document.querySelector('template').content.cloneNode(true), 0), document.querySelector('.map__filters-container'));
