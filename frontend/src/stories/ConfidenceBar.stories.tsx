import type { Meta, StoryObj } from '@storybook/react';
import { ConfidenceBar } from '../components/ConfidenceBar';

const meta: Meta<typeof ConfidenceBar> = {
  title: 'Components/ConfidenceBar',
  component: ConfidenceBar,
  tags: ['autodocs'],
  decorators: [Story => <div style={{ width: 280 }}><Story /></div>],
  argTypes: {
    confidence: {
      control: 'radio',
      options: ['high', 'medium', 'low'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ConfidenceBar>;

export const High:   Story = { args: { confidence: 'high' } };
export const Medium: Story = { args: { confidence: 'medium' } };
export const Low:    Story = { args: { confidence: 'low' } };
