import { DocumentDialog, IDocument } from '../../UI';
import React, { ReactElement, useCallback, useState } from 'react';
import { ValueTypes } from '@atlasmap/core';
import { useToggle } from '../utils';

type ChangeDocumentCallback = (documentNameInfo: IDocument) => void;

export function useDocumentDialog(title: string,flatSources:any): [
  ReactElement,
  (cb: ChangeDocumentCallback, documentNameInfo: IDocument) => void,
] {
  const [onDocumentCb, setOnDocumentCb] =
    useState<ChangeDocumentCallback | null>(null);
  const [initialDocument, setInitialDocument] =
    useState<IDocument | null>({
      id: '',
      type:'',
      value: '',
      valueType: '',
      selectValue: '',
      valueKey:'',
      isSource:false
    });
  const { state, toggleOn, toggleOff } = useToggle(false);
  const onConfirm = useCallback(
    (sourceInfo: IDocument) => {
      if (onDocumentCb) {
        onDocumentCb(sourceInfo);
        toggleOff();
      }
    },
    [onDocumentCb, toggleOff],
  );
  
  const dialog = (
        <DocumentDialog
        title={title}
        isOpen={state}
        onCancel={toggleOff}
        onConfirm={onConfirm}
        addableSources={flatSources}
        {...(initialDocument || {})}
        valueTypeOptions={ValueTypes.map(([value, label]) => ({
                  value,
                  label,
                }))}
        />
      );
    
  const onOpenDocumentDialog = useCallback(
    (callback: ChangeDocumentCallback, sourceInfo: IDocument) => {
      setOnDocumentCb(() => callback);
      setInitialDocument(sourceInfo);
      toggleOn();
    },
    [toggleOn],
  );
  return [dialog, onOpenDocumentDialog];
}
