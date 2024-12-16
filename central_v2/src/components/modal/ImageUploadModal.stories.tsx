import React, { useState } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import ImageUploadModal from './ImageUploadModal';
import Theme from '../../lib/Theme';
import i18n from '../../i18n.mock';
import { ScreenSize, BorderStyle } from '../../lib/CentralModels';

export default {
  // structuring our stories per: https://atomicdesign.bradfrost.com/chapter-2/#the-atomic-design-methodology
  title: 'Design System/2_Molecules/ImageUploadModal',
  component: ImageUploadModal,
} as Meta<typeof ImageUploadModal>;

const Template: StoryFn<typeof ImageUploadModal> = function CardTemplate(args) {
  const isMediumScreen = useMediaQuery(Theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(Theme.breakpoints.up('lg'));
  const screenSize = isLgScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <ImageUploadModal
          {...args}
          screenSize={screenSize}
        />
      </I18nextProvider>
    </ThemeProvider>
  );
};

export const DefaultDashedBorder = Template.bind({});
DefaultDashedBorder.args = {
  isModalOpen: true,
  handleImageSave: (file: File) => console.log(file),
  handleCloseModal: () => console.log('close'),
  borderStyle: BorderStyle.DASHED_BORDER,
};

export const SVGDashedBorder = Template.bind({});
SVGDashedBorder.args = {
  isModalOpen: true,
  handleImageSave: (file: File) => console.log(file),
  handleCloseModal: () => console.log('close'),
  borderStyle: BorderStyle.SVG,
};

export const CornerBorder = Template.bind({});
CornerBorder.args = {
  isModalOpen: true,
  handleImageSave: (file: File) => console.log(file),
  handleCloseModal: () => console.log('close'),
  borderStyle: BorderStyle.CORNER_BORDER,
};

export const SolidBorder = Template.bind({});
SolidBorder.args = {
  isModalOpen: true,
  handleImageSave: (file: File) => console.log(file),
  handleCloseModal: () => console.log('close'),
  borderStyle: BorderStyle.SOLID_BORDER,
};
