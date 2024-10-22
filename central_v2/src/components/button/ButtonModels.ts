import { useTranslation } from 'react-i18next';
import login from '../../images/buttonIconLogin.svg';
import signup from '../../images/buttonIconSignup.svg';
import view from '../../images/buttonIconView.svg';
import launch from '../../images/buttonIconLaunch.svg';
import upload from '../../images/buttonIconUpload.svg';
import previous from '../../images/buttonIconPrevious.svg';
import favorite from '../../images/buttonIconFavorite.svg';
import clone from '../../images/buttonIconClone.svg';
import next from '../../images/buttonIconNext.svg';
import save from '../../images/buttonIconSave.svg';
import discard from '../../images/buttonIconDiscard.svg';
import add from '../../images/buttonIconAdd.svg';
import create from '../../images/buttonIconCreate.svg';
import bank from '../../images/buttonIconBank.svg';

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
    textKey?: string,
    color?: ButtonColor,
    rightIcon?: string
  }
}

// textKey data is duplicated to improve clarity of object and centralize all button content properties
export const buttonContentMap: ButtonContentMapProps = {
  [ButtonType.LOGIN]: {
    icon: login,
    textKey: ButtonType.LOGIN,
    color: ButtonColor.RED
  },
  [ButtonType.SIGNUP]: {
    icon: signup,
    textKey: ButtonType.SIGNUP,
  },
  [ButtonType.VIEW]: {
    icon: view,
    textKey: ButtonType.VIEW,
  },
  [ButtonType.LAUNCH]: {
    icon: launch,
    textKey: ButtonType.LAUNCH,
  },
  [ButtonType.UPLOAD]: {
    icon: upload,
    textKey: ButtonType.UPLOAD,
  },
  [ButtonType.NEXTSTEP]: {
    textKey: ButtonType.NEXTSTEP,
  },
  [ButtonType.VERIFY]: {
    textKey: ButtonType.VERIFY,
  },
  [ButtonType.GETSTARTED]: {
    textKey: ButtonType.GETSTARTED,
  },
  [ButtonType.RESETLINK]: {
    textKey: ButtonType.RESETLINK,
    color: ButtonColor.RED
  },
  [ButtonType.RESET]: {
    textKey: ButtonType.RESET,
    color: ButtonColor.RED
  },
  [ButtonType.PREVIOUSQUESTION]: {
    icon: previous,
    textKey: ButtonType.PREVIOUSQUESTION,
  },
  [ButtonType.BACKTOEXPLORE]: {
    icon: previous,
    textKey: ButtonType.BACKTOEXPLORE,
  },
  [ButtonType.FAVORITE]: {
    icon: favorite,
    textKey: ButtonType.FAVORITE,
  },
  [ButtonType.CLONEANDEDIT]: {
    icon: clone,
    textKey: ButtonType.CLONEANDEDIT,
  },
  [ButtonType.NEXTQUESTION]: {
    textKey: ButtonType.NEXTQUESTION,
    rightIcon: next,
  },
  [ButtonType.SAVE]: {
    icon: save,
    textKey: ButtonType.SAVE,
  },
  [ButtonType.DISCARD]: {
    icon: discard,
    textKey: ButtonType.DISCARD,
    color: ButtonColor.RED,
  },
  [ButtonType.ADDSTEP]: {
    icon: add,
    textKey: ButtonType.ADDSTEP,
  },
  [ButtonType.BROWSEFILES]: {
    icon: upload,
    textKey: ButtonType.BROWSEFILES,
  },
  [ButtonType.CHANGEIMAGE]: {
    icon: upload,
    textKey: ButtonType.CHANGEIMAGE,
  },
  [ButtonType.NEXTCARD]: {
    icon: next,
    textKey: ButtonType.NEXTCARD,
  },
  [ButtonType.LAUNCHGAME]: {
    icon: launch,
    textKey: ButtonType.LAUNCHGAME,
  }, 
  [ButtonType.CREATEQUESTION]: {
    icon: create,
    textKey: ButtonType.CREATEQUESTION,
  },
  [ButtonType.QUESTIONBANK]: {
    icon: bank,
    textKey: ButtonType.QUESTIONBANK,
  },
  [ButtonType.BACK]: {
    icon: previous,
    textKey: ButtonType.BACK,
  },
  [ButtonType.EDITPICTURE]: {
    textKey: ButtonType.EDITPICTURE,
  },
  [ButtonType.EDITINFORMATION]: {
    textKey: ButtonType.EDITINFORMATION,
  },
  [ButtonType.CHANGEPASSWORD]: {
    textKey: ButtonType.CHANGEPASSWORD,
  }
}