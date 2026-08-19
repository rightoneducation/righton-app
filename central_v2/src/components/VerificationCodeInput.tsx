import React, { useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { TextContainerStyled } from '../lib/styledcomponents/CreateQuestionStyledComponents';

const BOX_KEYS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const CodeBoxesContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
});

const CodeBox = styled(TextContainerStyled)(({ theme }) => ({
  width: '40px',
  maxHeight: '54px',
  textAlign: 'center',
  input: {
    textAlign: 'center',
  },
  '& .MuiInputBase-root': {
    fontFamily: 'Rubik',
    fontWeight: 700,
    fontSize: '20px',
    color: theme.palette.primary.darkBlue,
  },
  '& .MuiOutlinedInput-root': {
    height: '54px',
    '&.Mui-error fieldset': {
      borderWidth: '2px',
      borderColor: '#F60E44',
    },
  },
}));

interface VerificationCodeInputProps {
  code: string[];
  onCodeChange: (code: string[]) => void;
  hasError?: boolean;
  children?: React.ReactNode;
}

export default function VerificationCodeInput({
  code,
  onCodeChange,
  hasError = false,
  children = null,
}: VerificationCodeInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { length } = code;

  const focusBox = (index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    const target = inputRefs.current[clamped];
    target?.focus();
    target?.select();
  };

  // writes digits left-to-right from `start`, then parks the caret past the last one
  const fillFrom = (start: number, digits: string) => {
    if (!digits) return;
    const newCode = [...code];
    let cursor = start;
    for (let i = 0; i < digits.length && cursor < length; i += 1) {
      newCode[cursor] = digits[i];
      cursor += 1;
    }
    onCodeChange(newCode);
    focusBox(cursor);
  };

  const handleChange = (value: string, index: number) => {
    const digits = value.replace(/\D/g, '');
    const newCode = [...code];
    newCode[index] = digits.slice(-1);
    onCodeChange(newCode);
    if (digits) focusBox(index + 1);
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    event.preventDefault();
    const digits = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!digits) return;
    // a full-length paste always fills from the start, wherever it was dropped
    fillFrom(digits.length >= length ? 0 : index, digits);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === 'Backspace') {
      if (code[index]) return; // onChange clears this box
      event.preventDefault();
      if (index > 0) {
        const newCode = [...code];
        newCode[index - 1] = '';
        onCodeChange(newCode);
        focusBox(index - 1);
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  return (
    <CodeBoxesContainer>
      {code.map((value, index) => (
        <CodeBox
          key={`code-box-${BOX_KEYS[index]}`}
          error={hasError}
          variant="outlined"
          value={value}
          inputRef={(el: HTMLInputElement | null) => {
            inputRefs.current[index] = el;
          }}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            handleChange(event.target.value, index)
          }
          inputProps={{
            maxLength: 1,
            inputMode: 'numeric',
            autoComplete: index === 0 ? 'one-time-code' : 'off',
            'aria-label': `Verification code digit ${index + 1}`,
            onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) =>
              handleKeyDown(event, index),
            onPaste: (event: React.ClipboardEvent<HTMLInputElement>) =>
              handlePaste(event, index),
            onFocus: (event: React.FocusEvent<HTMLInputElement>) =>
              event.currentTarget.select(),
          }}
        />
      ))}
      {children}
    </CodeBoxesContainer>
  );
}
