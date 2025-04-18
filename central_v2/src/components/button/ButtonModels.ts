import login from '../../images/buttonIconLogin.svg';
import signup from '../../images/buttonIconSignup.svg';
import view from '../../images/buttonIconView.svg';
import launch from '../../images/buttonIconLaunch.svg';
import logout from '../../images/buttonIconLogOut.svg';
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
  LOGIN = 'login',
  SIGNUP = 'signup',
  VIEW = 'view',
  LAUNCH = 'launch',
  UPLOAD = 'upload',
  UPLOADIMAGE = 'uploadimage',
  NEXTSTEP = 'nextstep',
  VERIFY = 'verify',
  GETSTARTED = 'getstarted',
  RESETLINK = 'resetlink',
  RESET = 'reset',
  PREVIOUSQUESTION = 'previousquestion',
  BACKTOEXPLORE = 'backtoexplore',
  FAVORITE = 'favorite',
  CLONEANDEDIT = 'cloneandedit',
  NEXTQUESTION = 'nextquestion',
  SAVE = 'save',
  SAVEDRAFT = 'savedraft',
  DISCARD = 'discard',
  DISCARDBLUE = 'discardblue',
  ADDSTEP = 'addstep',
  BROWSEFILES = 'browsefiles',
  CHANGEIMAGE = 'changeimage',
  NEXTCARD = 'nextcard',
  LAUNCHGAME = 'launchgame',
  LOGOUT = 'logout',
  CREATEQUESTION = 'createquestion',
  QUESTIONBANK = 'questionbank',
  BACK = 'back',
  EDITPICTURE = 'editpicture',
  EDITINFORMATION = 'editinformation',
  CHANGEPASSWORD = 'changepassword',
  CREATE = 'create',
  CHOOSE = 'choose',
  CLONE = 'clone',
  SIGNOUT = 'signout',
  TEST = 'test',
  RETRY = 'retry',
  CANCEL = 'cancel'
}

export enum ButtonColor {
  RED,
  BLUE,
  LIGHTBLUE,
  NULL
}

type ButtonContentMapProps = {
  [key in ButtonType]: {
    icon?: string;
    textKey?: string;
    color?: ButtonColor;
    rightIcon?: string;
    width?: string;
  };
};

// textKey data is duplicated to improve clarity of object and centralize all button content properties
export const buttonContentMap: ButtonContentMapProps = {
  [ButtonType.LOGIN]: {
    icon: login,
    textKey: ButtonType.LOGIN,
    color: ButtonColor.RED,
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
  [ButtonType.UPLOADIMAGE]: {
    icon: upload,
    textKey: ButtonType.UPLOADIMAGE,
    width: '200px'
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
    color: ButtonColor.RED,
  },
  [ButtonType.RESET]: {
    textKey: ButtonType.RESET,
    color: ButtonColor.RED,
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
    width: '200px'
  },
  [ButtonType.SAVEDRAFT]: {
    icon: save,
    textKey: ButtonType.SAVEDRAFT,
    width: '200px',
    color: ButtonColor.LIGHTBLUE
  },
  [ButtonType.DISCARD]: {
    icon: discard,
    textKey: ButtonType.DISCARD,
    color: ButtonColor.RED,
  },
  [ButtonType.DISCARDBLUE]: {
    icon: discard,
    textKey: ButtonType.DISCARD
  },
  [ButtonType.ADDSTEP]: {
    icon: add,
    textKey: ButtonType.ADDSTEP,
  },
  [ButtonType.BROWSEFILES]: {
    icon: upload,
    textKey: ButtonType.BROWSEFILES,
    width: '200px'
  },
  [ButtonType.CHANGEIMAGE]: {
    icon: upload,
    textKey: ButtonType.CHANGEIMAGE,
    width: '220px',
    color: ButtonColor.NULL
  },
  [ButtonType.NEXTCARD]: {
    icon: next,
    textKey: ButtonType.NEXTCARD,
    width: '200px'
  },
  [ButtonType.LAUNCHGAME]: {
    icon: launch,
    textKey: ButtonType.LAUNCHGAME,
  },
  [ButtonType.LOGOUT]: {
    icon: logout,
    textKey: ButtonType.LOGOUT,
    color: ButtonColor.NULL,
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
  },
  [ButtonType.CREATE]: {
    icon: add,
    textKey: ButtonType.CREATE,
    color: ButtonColor.RED,
  },
  [ButtonType.CHOOSE]: {
    icon: add, 
    textKey: ButtonType.CHOOSE,
  },
  [ButtonType.CLONE]: {
    icon: clone, 
    textKey: ButtonType.CLONE,
  },
  [ButtonType.SIGNOUT]: {
    textKey: ButtonType.SIGNOUT,
    color: ButtonColor.RED,
  },
  [ButtonType.TEST]: {
    textKey: ButtonType.TEST,
    color: ButtonColor.RED,
  },
  [ButtonType.RETRY]: {
    textKey: ButtonType.RETRY
  },
  [ButtonType.CANCEL]: {
    textKey: ButtonType.CANCEL,
    color: ButtonColor.RED,
  },
};
