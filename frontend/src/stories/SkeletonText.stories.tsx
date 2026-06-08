import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonText } from '../components/SkeletonText';

const meta: Meta<typeof SkeletonText> = {
  title: 'Components/SkeletonText',
  component: SkeletonText,
  tags: ['autodocs'],
  decorators: [Story => (
    <div style={{ width: 480, padding: 24, background: '#fff', borderRadius: 12 }}>
      <Story />
    </div>
  )],
};

export default meta;
type Story = StoryObj<typeof SkeletonText>;

export const Default: Story = {};
