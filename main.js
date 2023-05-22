const items = document.querySelectorAll('.item');
const controls = document.querySelectorAll('.control');
const headerItems = document.querySelectorAll('.item-header');
const descriptionItems = document.querySelectorAll('.item-description');
const activeDelay = 0.76;
const interval = 5000;
let current = 0;
let intervalF;

const slider = {
  init: () => {
    controls.forEach(control => control.addEventListener('click', (e) => { slider.clickedControl(e) }));
    controls[current].classList.add('active');
    items[current].classList.add('active');
  },
  nextSlide: () => {
    slider.reset();
    if (current === items.length - 1) current = -1;
    current++;
    controls[current].classList.add('active');
    items[current].classList.add('active');
    slider.transitionDelay(headerItems);
    slider.transitionDelay(descriptionItems);
  },
  clickedControl: (e) => {
    slider.reset();
    clearInterval(intervalF);

    const control = e.target;
    const dataIndex = Number(control.dataset.index);

    control.classList.add('active');
    items.forEach((item, index) => {
      if (index === dataIndex) {
        item.classList.add('active');
      }
    });
    current = dataIndex;
    slider.transitionDelay(headerItems);
    slider.transitionDelay(descriptionItems);
    intervalF = setInterval(slider.nextSlide, interval);
  },
  reset: () => {
    items.forEach(item => item.classList.remove('active'));
    controls.forEach(control => control.classList.remove('active'));
  },
  transitionDelay: (items) => {
    let seconds;

    items.forEach(item => {
      const children = item.childNodes;
      let count = 1;
      let delay;

      item.classList.value === 'item-header' ? seconds = 0.015 : seconds = 0.007;

      children.forEach(child => {
        if (child.classList) {
          item.parentNode.classList.contains('active') ? delay = count * seconds + activeDelay : delay = count * seconds;
          child.firstElementChild.style.transitionDelay = `${delay}s`;
          count++;
        }
      });
    });
  },
};

let panels = document.querySelectorAll('.panel');
let fronts = document.querySelectorAll('.front');
let backs = document.querySelectorAll('.back');
let replay_btn = document.querySelector('.replay');

const mirrorTL = gsap.timeline();
const titleTL = gsap.timeline();

gsap.set(replay_btn, { opacity: 0 });

replay_btn.addEventListener('click', (e) => {
  mirrorTL.restart();
  titleTL.restart();
  gsap.to(e.target, 0.5, { opacity: 0 });
});

mirrorTL
  .to(fronts, 2.5, { backgroundPosition: '30px 0px', ease: 'expo.inOut' })
  .to(panels, 2.5, { z: -300, rotationY: 180, ease: 'expo.inOut' }, '-=2.3')
  .from(
    backs,
    2.5,
    {
      backgroundPosition: '-30px 0px',
      ease: 'expo.inOut',
      onComplete: () => {
        gsap.to(replay_btn, 1, { opacity: 1 });
      },
    },
    '-=2.3'
  );

titleTL
  .to('.layer', 1, { clipPath: 'polygon(3% 0, 100% 0%, 100% 100%, 0% 100%' })
  .to('.layer h1', 2, { x: 400, ease: 'expo.inOut' }, '-=0.5')
  .to('.cta', 2, { x: 0, ease: 'expo.inOut' }, '-=2');

intervalF = setInterval(slider.nextSlide, interval);
slider.init();
