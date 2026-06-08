import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FeedbackPanel } from '../components/FeedbackPanel';
import { Annotation, AnalysisResult } from '../types';

const mockResult: AnalysisResult = {
  overallScore: 68,
  summary: 'The writing has clear intent but several passages reduce its effectiveness. Tightening the language and leading with the key message will significantly improve impact.',
  strengths: ['Clear logical structure', 'Appropriate professional tone'],
  focusAreas: ['Reduce passive voice', 'Cut filler phrases for directness'],
  annotations: [
    {
      id: 'ann-1',
      text: 'I am writing to you in order to',
      category: 'conciseness',
      severity: 'warning',
      title: 'Wordy opening phrase',
      feedback: '"In order to" adds no meaning. Use "to" instead for cleaner prose.',
      suggestion: 'I am writing to follow up on',
      confidence: 'high',
    },
    {
      id: 'ann-2',
      text: 'at your earliest convenience',
      category: 'tone',
      severity: 'suggestion',
      title: 'Clichéd closing phrase',
      feedback: 'This phrase is overused in professional emails and can feel impersonal. A specific timeframe is clearer.',
      suggestion: 'by Thursday if possible',
      confidence: 'medium',
    },
    {
      id: 'ann-3',
      text: 'Please do not hesitate to reach out',
      category: 'word_choice',
      severity: 'suggestion',
      title: 'Weak call-to-action',
      feedback: 'This phrase is a well-worn cliché that adds little value. A more direct invitation is stronger.',
      suggestion: 'Feel free to reply or call me directly',
      confidence: 'high',
    },
  ],
};

function PanelWrapper() {
  const [selected, setSelected] = useState<Annotation | null>(null);
  return (
    <div style={{ width: 360, height: 600, background: '#fafafa', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <FeedbackPanel result={mockResult} selectedAnnotation={selected} onSelect={setSelected} />
    </div>
  );
}

const meta: Meta = {
  title: 'Components/FeedbackPanel',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Overview: Story = { render: () => <PanelWrapper /> };
export const Empty:    Story = {
  render: () => (
    <div style={{ width: 360, height: 400, background: '#fafafa', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <FeedbackPanel result={null} selectedAnnotation={null} onSelect={() => {}} />
    </div>
  ),
};
