const isDev = import.meta.env.DEV;

export const productUrl = isDev
  ? 'http://localhost:3000'
  : 'https://ktb-web-web-prod-xq4sdwfkdnh3pk3y.ktbhealth.workers.dev';

export const storybookUrl = isDev
  ? 'http://localhost:3100'
  : 'https://ktb-storybook-storybook-prod-afkmlig6dy3b3t3x.ktbhealth.workers.dev';
