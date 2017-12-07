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
      'title': titleValues.splice(random(titleValues.length - 1), 1),
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

// заполнение карточки объявления ==================================================
function advertAssembling(advertElement, advertNumber) {

  advertElement.querySelector('h3').textContent = advertNumber.offer.title;
  advertElement.querySelector('.popup__price').innerHTML = advertNumber.offer.price + '&#x20bd;/ночь';


  var advertTitles = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало'
  };

  advertElement.querySelector('h4').textContent = advertTitles[advertNumber.offer.type];

  var form = ' комнаты ';
  if (advertNumber.offer.rooms === 1) {
    form = ' комната ';
  }
  if (advertNumber.offer.rooms === 5) {
    form = ' комнат ';
  }

  if (advertNumber.offer.guests > 1) {
    advertElement.querySelectorAll('p')[2].textContent = advertNumber.offer.rooms + form + ' для ' + advertNumber.offer.guests + ' гостей';
  } else {
    advertElement.querySelectorAll('p')[2].textContent = advertNumber.offer.rooms + form + ' для ' + advertNumber.offer.guests + ' гостя';
  }

  advertElement.querySelectorAll('p')[3].textContent = 'Заезд после ' + advertNumber.offer.checkin + ' выезд до ' + advertNumber.offer.checkout;

  advertElement.removeChild(advertElement.querySelector('.popup__features'));

  advertElement.insertBefore(document.querySelector('template').content.querySelector('.popup__features').cloneNode(true), advertElement.querySelector('p')[4]);

  var featuresListAll = advertElement.querySelectorAll('.popup__features');
  for (i = 0; i < featuresValues.length; i++) {
    if (advertNumber.offer.features.indexOf(featuresValues[i]) === -1) {
      featuresListAll[0].removeChild(advertElement.querySelector('.feature--' + featuresValues[i]));
    }
  }

  advertElement.querySelectorAll('p')[4].textContent = advertNumber.offer.description;
  advertElement.querySelector('.popup__avatar').src = advertNumber.author.avatar;

  return advertElement;
}

// ================>>>>>>
document.querySelector('.map').insertBefore(document.querySelector('template').content.querySelector('article').cloneNode(true), document.querySelector('.map__filters-container'));
// закрытие карточки объявления по крестику
document.querySelector('.popup').querySelector('.popup__close').addEventListener('click', function () {
  document.querySelector('.popup').classList.add('hidden');
  document.querySelector('.map__pin--active').classList.remove('map__pin--active');
});

document.querySelector('.popup').classList.add('hidden');
// ===============================

// делаем неактивными поля для заполнения объявления
var fieldset = document.querySelectorAll('fieldset');
for (i = 0; i < fieldset.length; i++) {
  fieldset[i].disabled = true;
}

// ======================что делает клик по КРАСНОЙ метке
var mainLabel = document.querySelector('.map__pin--main');
mainLabel.addEventListener('click', function () {
  // убираем затемнение
  document.querySelector('.map').classList.remove('map--faded');

  // и рисуем метки
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
    var advertLabel = fragment.appendChild(renderAdvert(adverts[i]));
    advertLabel.value = i;
    advertLabel.setAttribute('tabindex', i);
    advertLabel.addEventListener('click', function () {
      // Удаляем флаг активной у предыдущей
      if (document.querySelector('.map__pin--active') !== null) {
        document.querySelector('.map__pin--active').classList.remove('map__pin--active');
      } else {
        document.querySelector('.popup').classList.remove('hidden');
      }
      // ставим флаг активной у текущей
      // рисуем попап, то есть карточку объявления
      this.classList.add('map__pin--active');

      advertAssembling(document.querySelector('.popup'), adverts[this.value]);

    });

  }

  document.querySelector('.map__pins').appendChild(fragment);

  // делаем активными поля для заполнения объявления
  for (i = 0; i < fieldset.length; i++) {
    fieldset[i].disabled = false;
  }

}); // конец =========== что делает клик по КРАСНОЙ метке

