import React from 'react';
import Modal from 'react-modal';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

/**
 * react-modal with the page behind it locked for exactly as long as it is
 * open: the lock follows `isOpen`, the same value that opens it. react-modal's
 * own body class is turned off, so this is the only lock.
 */
export default function AppModal({ isOpen, ...props }: Modal.Props) {
  useBodyScrollLock(isOpen);
  return <Modal isOpen={isOpen} bodyOpenClassName={null} {...props} />;
}
