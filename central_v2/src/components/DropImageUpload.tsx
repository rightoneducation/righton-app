import React from 'react';
import { useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend, NativeTypes } from 'react-dnd-html5-backend';

interface FileDropZoneProps {
  onFilesDropped: (files: File) => void;
  children: React.ReactNode;
}

interface FileDropItem {
  files: File[];
}

function FileDropZone({ onFilesDropped, children }: FileDropZoneProps){
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item, monitor) => {
      const { files } = monitor.getItem<FileDropItem>();
      // only want to upload 1 file
      onFilesDropped(files[0]);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        textAlign: 'center',
        backgroundColor: isOver && canDrop ? 'rgba(0,0,0,0.15)' : '#FFF',
        transition: 'background-color 1s ease-in',
        width: '100%',
        height: '100%',
        flexGrow: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
      }}
    >
      {children}
    </div>
  );
}

interface DropImageUploadProps {
  handleImageSave: (file: File) => void;
  children?: React.ReactNode;
}

export default function DropImageUpload({ handleImageSave, children }: DropImageUploadProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <FileDropZone onFilesDropped={handleImageSave} >
        {children}
      </FileDropZone>
    </DndProvider>
  );
}