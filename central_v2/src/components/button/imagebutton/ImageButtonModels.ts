import { useTranslation } from 'react-i18next';
import upload from '../../../images/buttonIconUpload.svg';
import url from '../../../images/buttonIconURL.svg';

export enum ImageButtonType {
  IMAGEUPLOAD = 'imageupload',
  IMAGEURL = 'imageurl'
}

type ImageButtonContentMapProps = {
  [key in ImageButtonType]: {
    icon?: string;
    textKey?: string;
  };
};

// textKey data is duplicated to improve clarity of object and centralize all button content properties
export const imageButtonContentMap: ImageButtonContentMapProps = {
  [ImageButtonType.IMAGEUPLOAD]: {
    icon: upload,
    textKey: ImageButtonType.IMAGEUPLOAD,
  },
  [ImageButtonType.IMAGEURL]: {
    icon: url,
    textKey: ImageButtonType.IMAGEURL,
  },
};
