import type { Preview } from '@storybook/react';
import '../src/App.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light',  value: '#f8f9fb' },
        { name: 'white',  value: '#ffffff' },
      ],
    },
    a11y: { config: {} },
  },
};

export default preview;
