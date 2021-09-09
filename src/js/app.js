import '../css/style.css';
import './plugins';
import locations from './store/locations';
import favourite from './store/favourite';
import formUI from './views/form';
import ticketsUI from './views/tickets';
import currencyUI from './views/currency';
import favouriteTicket from './views/favouriteTicket';

document.addEventListener('DOMContentLoaded', e => {
  const form = formUI.form;
  const container = document.querySelector('.tickets-sections');
  const deleteFavourite = document.querySelector('.dropdown-content');
  const favouriteCounter = document.querySelector('.favorites-counter span');
  // Events
  initApp();
  form.addEventListener('submit', e => {
    e.preventDefault();
    onFormSubmit();
  });
  container.addEventListener('click', (e) => {
    let target = e.target;
    if(target.classList.contains('add-favorite')){
      const parent = target.closest('.ticket-item');
      const ticketData = {
        airline_logo: parent.querySelector('.ticket-airline-img').getAttribute('src'),
        airline_name: parent.querySelector('.ticket-airline-name').textContent,
        origin_name: parent.querySelector('.ticket-origin').textContent,
        destination_name: parent.querySelector('.ticket-destination .ticket-destination').textContent,
        departure_at: parent.querySelector('.ticket-time-departure').textContent,
        price: parent.querySelector('.ticket-price').textContent,
        transfers: parent.querySelector('.ticket-transfers').textContent,
        flight_number: parent.querySelector('.ticket-flight-number').textContent,
        index: parent.dataset.index,
      };
      favourite.setTicketInfo(ticketData);
      favouriteTicket.renderFavourite(favourite.getTicketInfo());
      parent.remove();
      favouriteCounter.textContent = favouriteTicket.renderCount();
    }
  });
  deleteFavourite.addEventListener('click', (e) => {
    const target = e.target;
    if(target.classList.contains('delete-favorite')) {
      const count = target.closest('.favorite-item').dataset.index;
      document.querySelector(`[data-index="${count}"]`).remove();
      favouriteTicket.removeItem(count);
      favouriteTicket.checkData();
      favouriteCounter.textContent = favouriteTicket.renderCount();
    }
  });
  // handlers
  async function initApp() {
    favouriteTicket.init();
    await locations.init();
    formUI.setAutocompleteData(locations.shortCities);
  }

  async function onFormSubmit() {
    const origin = locations.getCityCodeByKey(formUI.originValue);
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currecyValue;
    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency,
    });
    ticketsUI.renderTickets(locations.lastSearch);
  }
});
