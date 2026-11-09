const items = Array.from(document.querySelectorAll('.gallery-item'));
const overlay = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
let currentIndex = 0;

function updateLightbox() {
   if (!items.length || !lightboxImage) return;
   const item = items[currentIndex];
   const image = item.querySelector('img');
   const caption = item.querySelector('figcaption')?.cloneNode(true);
   caption?.querySelectorAll('.caption-detail').forEach(detail => detail.remove());
   lightboxImage.src = image.currentSrc || image.src;
   lightboxImage.alt = image.alt;
   if (lightboxCaption) {
      lightboxCaption.textContent = caption ? caption.textContent : '';
   }
}

function openLightbox(index) {
   if (!items.length || !overlay) return;
   currentIndex = index;
   updateLightbox();
   overlay.classList.add('active');
   resetIdleTimer();
}

function closeLightbox() {
   if (!overlay) return;
   overlay.classList.remove('active', 'idle');
   clearTimeout(idleTimer);
   items[currentIndex]?.scrollIntoView({ block: 'center' });
}

let idleTimer;
function resetIdleTimer() {
   if (!overlay) return;
   overlay.classList.remove('idle');
   clearTimeout(idleTimer);
   idleTimer = setTimeout(() => overlay.classList.add('idle'), 1500);
}

function changeSlide(direction) {
   if (!items.length) return;
   currentIndex = (currentIndex + direction + items.length) % items.length;
   updateLightbox();
}

items.forEach((item, index) => {
   item.addEventListener('click', () => openLightbox(index));
});

if (overlay) {
   overlay.addEventListener('click', event => {
      resetIdleTimer();
      if (event.target === overlay) closeLightbox();
   });
   overlay.addEventListener('mousemove', resetIdleTimer);
}

if (lightboxImage) {
   lightboxImage.addEventListener('click', event => {
      if (swipeHandled) {
         swipeHandled = false;
         return;
      }
      const half = event.offsetX < lightboxImage.clientWidth / 2 ? -1 : 1;
      changeSlide(half);
   });
   lightboxImage.addEventListener('mousemove', event => {
      lightboxImage.style.cursor = event.offsetX < lightboxImage.clientWidth / 2 ? 'w-resize' : 'e-resize';
   });
}

let touchStartX = null;
let swipeHandled = false;
if (overlay) {
   overlay.addEventListener('touchstart', event => {
      touchStartX = event.changedTouches[0].clientX;
   }, { passive: true });
   overlay.addEventListener('touchend', event => {
      if (touchStartX === null) return;
      const delta = event.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(delta) > 40) {
         swipeHandled = true;
         changeSlide(delta < 0 ? 1 : -1);
      }
   }, { passive: true });
}

const closeButton = document.querySelector('.lightbox-close');
const previousButton = document.querySelector('.lightbox-prev');
const nextButton = document.querySelector('.lightbox-next');

if (closeButton) closeButton.addEventListener('click', closeLightbox);
if (previousButton) previousButton.addEventListener('click', () => changeSlide(-1));
if (nextButton) nextButton.addEventListener('click', () => changeSlide(1));

document.addEventListener('keydown', event => {
   if (!overlay || !overlay.classList.contains('active')) return;
   if (event.key === 'Escape') closeLightbox();
   if (event.key === 'ArrowLeft') changeSlide(-1);
   if (event.key === 'ArrowRight') changeSlide(1);
});
