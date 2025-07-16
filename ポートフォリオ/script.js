class Marquee {
  constructor() {
    this.els = document.querySelectorAll('.marquee');
    if (!this.els) return;

    this.init()
  }
  init() {
    this.els.forEach(el => {
      // 要素が非表示の場合は処理をスキップ
      if (getComputedStyle(el).display === 'none') return;
      
      const options = {
        speed: el.dataset.marqueeSpeed || 60,
        direction: el.dataset.marqueeDirection || 'left',
        pauseOnHover: el.dataset.marqueeHover === 'true'
      };
      this.Marquee(el, options);
    })
  }
  Marquee(el, options) {
    const { speed, direction, pauseOnHover } = options;
    const wrapper = el.querySelector('.marquee-wrapper');
    const content = el.querySelector('.marquee-content');
    this.appendContent(content, wrapper);
    this.updateWrapperWidth(content, wrapper);
    const animation = this.Animation(wrapper, speed, direction);

    this.hoverEvent(el, animation, pauseOnHover);
    this.observerEvent(el, animation);
  }
  updateWrapperWidth(content, wrap) {
    const contentWidth = content.getBoundingClientRect().width;
    const gap = parseInt(getComputedStyle(content).columnGap);
    wrap.style.width = `${contentWidth + gap}px`;
  }
  appendClone(content, wrap) {
    const clone = content.cloneNode(true);
    wrap.appendChild(clone);
  }
  appendContent(content, wrap) {
    const innerWidth = window.innerWidth;
    const contentWidth = content.getBoundingClientRect().width;

    this.appendClone(content, wrap);

    if (contentWidth < innerWidth) {
      const numClones = Math.ceil(innerWidth / contentWidth);
      for (let i = 0; i < numClones; i++) {
        this.appendClone(content, wrap);
      }
    }
  }
  Animation(wrap, speed, direction) {
    const wrapWidth = wrap.getBoundingClientRect().width;
    const keyframes = direction === 'left' ?
      [{ translate: '0 0' }, { translate: '-100% 0' }] :
      [{ translate: '-100% 0' }, { translate: '0 0' }];
    const options = {
      duration: (wrapWidth / speed) * 1000,
      iterations: Infinity,
    }
    return wrap.animate(keyframes, options);
  }
  hoverEvent(el, animation, hasOpt) {
    if (!hasOpt) return;
    el.addEventListener('mouseenter', () => animation.pause());
    el.addEventListener('mouseleave', () => animation.play());
  }
  observerEvent(el, animation) {
    const observerOptions = {
      root: null,
      threshold: 0,
    };

    const observer = new IntersectionObserver((entry) => {
      entry[0].isIntersecting ? animation.play() : animation.pause();
    }, observerOptions);

    observer.observe(el);
  }
}

const marquee = new Marquee();