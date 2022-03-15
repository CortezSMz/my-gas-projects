/* This script runs once on each card */

const card = document.getElementById('card').parentNode.parentNode;

const day = document.getElementById('day');

if (document.getElementById('user').innerText != '') {
  card.classList.add('reserved');
  if (card.innerHTML.includes('Holiday')) card.classList.add('holiday');
  else document.getElementById('intention').hidden = true;
} else card.classList.add('available');

const week = document.getElementById('week');

card.parentNode.parentNode.classList.add(week.innerText.split('&')[0]);

const today = new Date()
  .toLocaleString('pt-BR', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
  .replace(/\//g, '-');

if (week.innerText.split('&')[1] == today) card.classList.add('today');
