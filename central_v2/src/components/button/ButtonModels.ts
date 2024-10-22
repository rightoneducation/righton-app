import { useTranslation } from 'react-i18next';
import login from '../images/buttonIconLogin.svg';
import signup from '../images/buttonIconSignup.svg';
import view from '../images/buttonIconView.svg';
import launch from '../images/buttonIconLaunch.svg';
import upload from '../images/buttonIconUpload.svg';
import previous from '../images/buttonIconPrevious.svg';
import favorite from '../images/buttonIconFavorite.svg';
import clone from '../images/buttonIconClone.svg';
import next from '../images/buttonIconNext.svg';
import save from '../images/buttonIconSave.svg';
import discard from '../images/buttonIconDiscard.svg';
import add from '../images/buttonIconAdd.svg';
import create from '../images/buttonIconCreate.svg';
import bank from '../images/buttonIconBank.svg';

export enum ButtonType {
  LOGIN = "login",
  SIGNUP = "signup",
  VIEW = "view",
  LAUNCH = "launch",
  UPLOAD = "upload",
  NEXTSTEP = "nextstep",
  VERIFY = "verify",
  GETSTARTED = "getstarted",
  RESETLINK = "resetlink",
  RESET = "reset",
  PREVIOUSQUESTION = "previousquestion",
  BACKTOEXPLORE = "backtoexplore",
  FAVORITE = "favorite",
  CLONEANDEDIT = "cloneandedit",
  NEXTQUESTION = "nextquestion",
  SAVE = "save",
  DISCARD = "discard",
  ADDSTEP = "addstep",
  BROWSEFILES = "browsefiles",
  CHANGEIMAGE = "changeimage",
  NEXTCARD = "nextcard",
  LAUNCHGAME = "launchgame",
  CREATEQUESTION = "createquestion",
  QUESTIONBANK = "questionbank",
  BACK = "back",
  EDITPICTURE = "editpicture",
  EDITINFORMATION = "editinformation",
  CHANGEPASSWORD = "changepassword"
}

export enum ButtonColor {
  RED,
  BLUE
}

type ButtonContentMapProps = {
  [key in ButtonType]: {
    icon?: string,
    text?: string,
    color?: ButtonColor,
    rightIcon?: string
  }
}

const { t } = useTranslation();

export const buttonContentMap: ButtonContentMapProps = {
  [ButtonType.LOGIN]: {
    icon: login,
    text: t([ButtonType.LOGIN]),
    color: ButtonColor.RED
  },
  [ButtonType.SIGNUP]: {
    icon: signup,
    text: t([ButtonType.SIGNUP]),
  },
  [ButtonType.VIEW]: {
    icon: view,
    text: t([ButtonType.VIEW]),
  },
  [ButtonType.LAUNCH]: {
    icon: launch,
    text: t([ButtonType.LAUNCH]),
  },
  [ButtonType.UPLOAD]: {
    icon: upload,
    text: t([ButtonType.UPLOAD]),
  },
  [ButtonType.NEXTSTEP]: {
    text: t([ButtonType.NEXTSTEP]),
  },
  [ButtonType.VERIFY]: {
    text: t([ButtonType.VERIFY]),
  },
  [ButtonType.GETSTARTED]: {
    text: t([ButtonType.GETSTARTED]),
  },
  [ButtonType.RESETLINK]: {
    text: t([ButtonType.RESETLINK]),
    color: ButtonColor.RED
  },
  [ButtonType.RESET]: {
    text: t([ButtonType.RESET]),
    color: ButtonColor.RED
  },
  [ButtonType.PREVIOUSQUESTION]: {
    icon: previous,
    text: t([ButtonType.PREVIOUSQUESTION]),
  },
  [ButtonType.BACKTOEXPLORE]: {
    icon: previous,
    text: t([ButtonType.BACKTOEXPLORE]),
  },
  [ButtonType.FAVORITE]: {
    icon: favorite,
    text: t([ButtonType.FAVORITE]),
  },
  [ButtonType.CLONEANDEDIT]: {
    icon: clone,
    text: t([ButtonType.CLONEANDEDIT]),
  },
  [ButtonType.NEXTQUESTION]: {
    text: t([ButtonType.NEXTQUESTION]),
    rightIcon: next,
  },
  [ButtonType.SAVE]: {
    icon: save,
    text: t([ButtonType.SAVE]),
  },
  [ButtonType.DISCARD]: {
    icon: discard,
    text: t([ButtonType.DISCARD]),
    color: ButtonColor.RED,
  },
  [ButtonType.ADDSTEP]: {
    icon: add,
    text: t([ButtonType.ADDSTEP]),
  },
  [ButtonType.BROWSEFILES]: {
    icon: upload,
    text: t([ButtonType.BROWSEFILES]),
  },
  [ButtonType.CHANGEIMAGE]: {
    icon: upload,
    text: t([ButtonType.CHANGEIMAGE]),
  },
  [ButtonType.NEXTCARD]: {
    icon: next,
    text: t([ButtonType.NEXTCARD]),
  },
  [ButtonType.LAUNCHGAME]: {
    icon: launch,
    text: t([ButtonType.LAUNCHGAME]),
  }, 
  [ButtonType.CREATEQUESTION]: {
    icon: create,
    text: t([ButtonType.CREATEQUESTION]),
  },
  [ButtonType.QUESTIONBANK]: {
    icon: bank,
    text: t([ButtonType.QUESTIONBANK]),
  },
  [ButtonType.BACK]: {
    icon: previous,
    text: t([ButtonType.BACK]),
  },
  [ButtonType.EDITPICTURE]: {
    text: t([ButtonType.EDITPICTURE]),
  },
  [ButtonType.EDITINFORMATION]: {
    text: t([ButtonType.EDITINFORMATION]),
  },
  [ButtonType.CHANGEPASSWORD]: {
    text: t([ButtonType.CHANGEPASSWORD]),
  }
}