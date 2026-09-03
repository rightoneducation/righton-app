import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CodeBox,
  CodeRow,
} from '../lib/styledcomponents/SignUpStyledComponents';

/**
 * Ported from central_v2's VerificationCodeInput (branch
 * drew-hart--centralv2-bugs) so both apps behave identically: paste a whole
 * code, arrow between boxes, backspace back through them, and land focused on
 * the first box.
 *
 * The behaviour is copied as-is; only the presentation differs — this app's
 * boxes come from the teacher sign-up frames rather than central_v2's, and the
 * digit labels go through the catalogue instead of being hardcoded English.
 */

// Stable keys: the boxes are positional, but an index key would let React
// reuse the wrong input when the array identity changes.
const BOX_KEYS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

interface VerificationCodeInputProps {
  code: string[];
  onCodeChange: (code: string[]) => void;
  hasError?: boolean;
  children?: React.ReactNode;
  autoFocus?: boolean;
}

export default function VerificationCodeInput({
  code,
  onCodeChange,
  hasError = false,
  children = null,
  autoFocus = false,
}: VerificationCodeInputProps) {
  const { t } = useTranslation();
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
    <CodeRow>
      {code.map((value, index) => (
        <CodeBox
          key={`code-box-${BOX_KEYS[index]}`}
          isFilled={Boolean(value)}
          hasError={hasError}
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
            // React's own autoFocus: fires once on mount, never on re-render,
            // so typing can't get yanked back to the first box
            autoFocus: autoFocus && index === 0,
            autoComplete: index === 0 ? 'one-time-code' : 'off',
            'aria-label': t('signup.verifyDigit', { number: index + 1 }),
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
    </CodeRow>
  );
}
