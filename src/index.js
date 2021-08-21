import fetchCountries from './js/fetchCountries';
import { alert, info, success, error } from '../node_modules/@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';
import listCountries from './templates/list-countries-markup.hbs';
import oneCountry from './templates/one-country-markup.hbs';
import debounce from 'lodash.debounce';
import './sass/main.scss';

const refs = {
  input: document.querySelector('.country-search__input'),
  info: document.querySelector('.country-search__info'),
  notify: document.querySelector('.pnotify'),
};

refs.input.addEventListener('input', debounce(handlerInput, 500));

function createListMarkup(countries) {
  const markUp = listCountries(countries);
  refs.info.insertAdjacentHTML('beforeend', markUp);
}

function createCountryMarkup(countries) {
  const markUp = oneCountry(countries);
  refs.info.insertAdjacentHTML('beforeend', markUp);
}

function clearCountiesContainer() {
  refs.info.innerHTML = '';
}

function onSearch(countries) {
  if (countries.length === 1) {
    createCountryMarkup(countries);
    success({
      text: `Congratulations! Basic country info is found.`,
      delay: 500,
      maxTextHeight: null,
    });
  } else if (countries.length <= 10) {
    createListMarkup(countries);
  } else if (countries.length >= 10) {
    error({
      text: 'Too many matches found! Please make your request more specific',
      delay: 500,
      maxTextHeight: null,
    });
  } else {
    clearCountiesContainer();
  }
}

function handlerInput(e) {
  const value = refs.input.value;
  const countriesArr = fetchCountries(value);
  clearCountiesContainer();

  if (value === '') {
    info({
      text: 'Enter country name',
      delay: 1000,
      maxTextHeight: null,
    });
  }
  countriesArr.then(countries => {
    onSearch(countries);
  });
}
