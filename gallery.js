const items = Array.from(document.querySelectorAll('.gallery-item'));
const overlay = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
let currentIndex = 0;

function updateLightbox() {
   const item = items[currentIndex];
   const image = item.querySelector('img');
   const caption = item.querySelector('figcaption');
   lightboxImage.src = image.src;
   lightboxImage.alt = image.alt;
   lightboxCaption.textContent = caption ? caption.textContent : '';
}

function openLightbox(index) {
   currentIndex = index;
   updateLightbox();
   overlay.classList.add('active');
}

function closeLightbox() {
   overlay.classList.remove('active');
}

function changeSlide(direction) {
   currentIndex = (currentIndex + direction + items.length) % items.length;
   updateLightbox();
}

items.forEach((item, index) => {
   item.addEventListener('click', () => openLightbox(index));
});

overlay.addEventListener('click', event => {
   if (event.target === overlay) closeLightbox();
});

document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
document.querySelector('.lightbox-prev').addEventListener('click', () => changeSlide(-1));
document.querySelector('.lightbox-next').addEventListener('click', () => changeSlide(1));

document.addEventListener('keydown', event => {
   if (!overlay.classList.contains('active')) return;
   if (event.key === 'Escape') closeLightbox();
   if (event.key === 'ArrowLeft') changeSlide(-1);
   if (event.key === 'ArrowRight') changeSlide(1);
});
