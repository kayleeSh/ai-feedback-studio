import type { Meta, StoryObj } from '@storybook/react';
import { CategoryTag } from '../components/CategoryTag';

const meta: Meta<typeof CategoryTag> = {
  title: 'Components/CategoryTag',
  component: CategoryTag,
  tags: ['autodocs'],
  argTypes: {
    category: {
      control: 'select',
      options: ['clarity', 'tone', 'structure', 'word_choice', 'conciseness', 'grammar'],
    },
    severity: {
      control: 'select',
      options: ['critical', 'warning', 'suggestion'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CategoryTag>;

export const Critical: Story = {
  args: { category: 'clarity', severity: 'critical', size: 'md' },
};

export const Warning: Story = {
  args: { category: 'tone', severity: 'warning', size: 'md' },
};

export const Suggestion: Story = {
  args: { category: 'conciseness', severity: 'suggestion', size: 'md' },
};

export const Small: Story = {
  args: { category: 'grammar', severity: 'warning', size: 'sm' },
};
