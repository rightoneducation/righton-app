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
  LOGIN,
  SIGNUP,
  VIEW,
  LAUNCH,
  UPLOAD,
  NEXTSTEP,
  VERIFY,
  GETSTARTED,
  RESETLINK,
  RESET,
  PREVIOUSQUESTION,
  BACKTOEXPLORE,
  FAVORITE,
  CLONEANDEDIT,
  NEXTQUESTION,
  SAVE,
  DISCARD,
  ADDSTEP,
  BROWSEFILES,
  CHANGEIMAGE,
  NEXTCARD,
  LAUNCHGAME,
  CREATEQUESTION,
  QUESTIONBANK,
  BACK,
  EDITPICTURE,
  EDITINFORMATION,
  CHANGEPASSWORD
}

export enum ButtonColor {
  RED,
  BLUE
}

type ButtonContentMapProps = {
  [key in ButtonType]: {
    icon?: string,
    text: string,
    color?: ButtonColor,
    rightIcon?: string
  }
}

export const buttonContentMap: ButtonContentMapProps = {
  [ButtonType.LOGIN]: {
    icon: login,
    text: 'Login',
    color: ButtonColor.RED
  },
  [ButtonType.SIGNUP]: {
    icon: signup,
    text: 'Sign Up',
  },
  [ButtonType.VIEW]: {
    icon: view,
    text: 'View',
  },
  [ButtonType.LAUNCH]: {
    icon: launch,
    text: 'Launch',
  },
  [ButtonType.UPLOAD]: {
    icon: upload,
    text: 'Upload',
  },
  [ButtonType.NEXTSTEP]: {
    text: 'Next Step',
  },
  [ButtonType.VERIFY]: {
    text: 'Verify',
  },
  [ButtonType.GETSTARTED]: {
    text: 'Get Started!',
  },
  [ButtonType.RESETLINK]: {
    text: 'Send Reset Link',
    color: ButtonColor.RED
  },
  [ButtonType.RESET]: {
    text: 'Reset',
    color: ButtonColor.RED
  },
  [ButtonType.PREVIOUSQUESTION]: {
    icon: previous,
    text: 'Previous Question',
  },
  [ButtonType.BACKTOEXPLORE]: {
    icon: previous,
    text: 'Back to Explore Questions',
  },
  [ButtonType.FAVORITE]: {
    icon: favorite,
    text: 'Favorite',
  },
  [ButtonType.CLONEANDEDIT]: {
    icon: clone,
    text: 'Clone and Edit',
  },
  [ButtonType.NEXTQUESTION]: {
    text: 'Next Question',
    rightIcon: next,
  },
  [ButtonType.SAVE]: {
    icon: save,
    text: 'Save',
  },
  [ButtonType.DISCARD]: {
    icon: discard,
    text: 'Discard',
    color: ButtonColor.RED,
  },
  [ButtonType.ADDSTEP]: {
    icon: add,
    text: 'Add Step',
  },
  [ButtonType.BROWSEFILES]: {
    icon: upload,
    text: 'Browse Files',
  },
  [ButtonType.CHANGEIMAGE]: {
    icon: upload,
    text: 'Change Image',
  },
  [ButtonType.NEXTCARD]: {
    icon: next,
    text: 'Next Card',
  },
  [ButtonType.LAUNCHGAME]: {
    icon: launch,
    text: 'Launch Game',
  }, 
  [ButtonType.CREATEQUESTION]: {
    icon: create,
    text: 'Create Question',
  },
  [ButtonType.QUESTIONBANK]: {
    icon: bank,
    text: 'Question Bank',
  },
  [ButtonType.BACK]: {
    icon: previous,
    text: 'Back',
  },
  [ButtonType.EDITPICTURE]: {
    text: 'Edit Picture',
  },
  [ButtonType.EDITINFORMATION]: {
    text: 'Edit Information',
  },
  [ButtonType.CHANGEPASSWORD]: {
    text: 'Change Password',
  }
}