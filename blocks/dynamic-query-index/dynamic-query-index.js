import { createOptimizedPicture } from '../../scripts/aem.js';

function createCard(data) {
  const card = document.createElement('div');
  card.classList.add('dynamic-card');

  const imgUrl = data.image.includes('/default')
    ? '../../icons/getinTouch.png'
    : data.image;
  const img = createOptimizedPicture(imgUrl, data.title || 'Image', false, [{ width: '750' }]);

  const header = document.createElement('h3');
  header.textContent = data.title;

  const description = document.createElement('p');
  // description.textContent = data.description || 'No description available';
  description.textContent = data.description;

  card.append(img, header, description);
  return card;
}

async function fetchJsonData(jsonURL) {
  const resp = await fetch(jsonURL);
  if (!resp.ok) throw new Error(`Failed to fetch JSON from ${jsonURL}`);
  return resp.json();
}

function createCarousel(data) {
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('carousel-container');

  const carouselTrack = document.createElement('div');
  carouselTrack.classList.add('carousel-track');

  const cardElements = data.map(createCard);
  carouselTrack.append(...cardElements);

  const dotsContainer = document.createElement('div');
  dotsContainer.classList.add('dots-container');

  cardElements.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      carouselTrack.scrollTo({ left: index * 300, behavior: 'smooth' });
      document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
    dotsContainer.appendChild(dot);
  });

  carouselContainer.append(carouselTrack, dotsContainer);
  return carouselContainer;
}

export default async function decorate(block) {
  const queryIndexLink = block.querySelector('a[href$=".json"]');
  if (!queryIndexLink) return;

  const parentDiv = document.createElement('div');
  parentDiv.classList.add('dynamic-magazine-block');

  try {
    const jsonURL = queryIndexLink.href;
    const jsonData = await fetchJsonData(jsonURL);
    const carousel = createCarousel(jsonData.data);
    parentDiv.append(carousel);
    queryIndexLink.replaceWith(parentDiv);
  } catch (error) {
    console.error('Error creating dynamic magazine block:', error);
  }
}
