import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import ParticipantList from '../components/ParticipantList';
import { IParticipants } from 'shared';

export default {
  title: 'ParticipantList',
  component: ParticipantList,
  argTypes: {
    onClose: { action: 'closing ' },
    onRemoveParticipant: { action: 'removing participant' },
  },
  args: {
    isOpen: true,
    isAdmin: false,
  },
} as ComponentMeta<typeof ParticipantList>;

const participants: IParticipants = {
  '1': 'Jeannie',
  '2': 'Ryan',
  '3': 'Ayalen',
  '4': 'Giuseppe',
  '5': 'Sara',
};

const Template: ComponentStory<typeof ParticipantList> = (args) => (
  <div className="max-w-sm m-auto h-screen relative">
    <ParticipantList {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  participants,
  userID: '1',
};
