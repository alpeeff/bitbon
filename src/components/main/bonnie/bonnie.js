import lottie from 'lottie-web';
import * as step_1 from './bonnie-steps/bonnie-step1.json';
import * as step_2 from './bonnie-steps/bonnie-step2.json';
import * as step_3 from './bonnie-steps/bonnie-step3.json';

const container = document.querySelector('#bonnie');

export default () => {
  if (container) {
    lottie.loadAnimation({
      container: document.getElementById('bonnie'),
      renderer: 'svg',
      autoplay: true,
      loop: true,
      animationData: step_1.default,
      name: 'step_1',
    });
  }
};
