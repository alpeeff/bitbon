import lottie from 'lottie-web';
import * as step_1 from './bonnie-steps/bonnie-step1.json';
import * as step_2 from './bonnie-steps/bonnie-step2.json';
import * as step_3 from './bonnie-steps/bonnie-step3.json';

let animation = null;

const options = {
  root: null,
  threshold: 0.2,
};

const steps = {
  step_1,
  step_2,
  step_3,
};

const loopSteps = {
  step_1: true,
  step_2: false,
};

const container = document.querySelector('#bonnie');

const callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animation.play();
    } else {
      animation.pause();
    }
  });
};

const reinitBonnie = (step, toStep) => {
  const timeout = window.setTimeout(() => {
    document.querySelector('.bonnie__step.active').classList.remove('active');
    step.classList.add('active');
    animation.destroy();
    animation = lottie.loadAnimation({
      container,
      renderer: 'svg',
      autoplay: true,
      loop: loopSteps[`step_${toStep}`],
      animationData: steps[`step_${toStep}`].default,
    });
    window.clearTimeout(timeout);
  }, 500);
};

export default () => {
  const observer = new IntersectionObserver(callback, options);
  const stepsWrapper = document.querySelector('.bonnie__steps');
  const overlay = document.querySelector('.bonnie__overlay');
  if (stepsWrapper && overlay) {
    stepsWrapper.addEventListener('click', (event) => {
      const target = event.target;
      if (target.classList.contains('bonnie__btn--next')) {
        const toStep = target.getAttribute('data-bonnie-step');
        const step = document.querySelector(
          `.bonnie__step[data-bonnie-step="${toStep}"]`
        );
        if (step) {
          reinitBonnie(step, toStep);
          overlay.classList.add('active');
        }
      } else if (target.classList.contains('bonnie__btn--close')) {
        const toStep = target.getAttribute('data-bonnie-step');
        const step = document.querySelector(
          `.bonnie__step[data-bonnie-step="${toStep}"]`
        );
        if (step) {
          reinitBonnie(step, toStep);
          overlay.classList.remove('active');
        }
      }
    });
  }
  if (container) {
    animation = lottie.loadAnimation({
      container,
      renderer: 'svg',
      autoplay: false,
      loop: true,
      animationData: step_1.default,
      name: 'step_1',
    });
  }
  if (animation) {
    document.addEventListener('scroll', () => {
      observer.observe(container);
    });
  }
};
