
import { IAtlasmapField } from '../../Views/models';
import {
  AddFieldTypeaheadV2
} from '../AddFieldTypeaheadV2';
import {
  ConfirmationDialog,
  IConfirmationDialogProps,
} from './ConfirmationDialog';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from '@patternfly/react-core';

export interface IDocument {
  id: string;
  type:string;
  value:string;
  valueType:string;
  selectValue:string;
  valueKey:string;
  isSource:boolean;
}
interface ValueTypeOption {
  label: string;
  value: string;
}
export interface IDocumentDialogProps {
  id?: string;
  type?:string;
  isSource?:boolean;
  isOpen: IConfirmationDialogProps['isOpen'];
  onCancel: IConfirmationDialogProps['onCancel'];
  onConfirm: (updatedDocNameInfo: IDocument) => void;
  title: string;
  addableSources: IAtlasmapField[];
  valueTypeOptions: ValueTypeOption[];
  value?: string;
  valueType?: string;
  selectValue?: string;
  valueKey?:string;
}
export const DocumentDialog: FunctionComponent<
  IDocumentDialogProps
> = ({ id,  title,type, isOpen,isSource, onCancel, onConfirm, addableSources, valueTypeOptions, value: initialValue = '', valueType: initialValueType = '',selectValue: initialSelectValue = '',valueKey : initialKey='' }) => {
  const [value, setValue] = useState(initialValue);
  const [valueType, setValueType] = useState(initialValueType);
  const [selectValue, setSelectValue] = useState(initialSelectValue);
  const [valueKey, setValueKey] = useState(initialKey);
  const [isDocumentValid, setDocumentValid] = useState(false);
  const reset = useCallback(() => {
    setValue(initialValue);
    setValueType(initialValueType);
    setSelectValue(initialSelectValue);
    setValueKey(initialKey)
  }, [initialValue,initialValueType,initialSelectValue,initialKey]);


  const handleOnConfirm = useCallback(() => {
    if (id  && type) {
      onConfirm({ id: id, type:type ,value:value,valueType:valueType,selectValue:selectValue,valueKey:valueKey,isSource:isSource?isSource:false});
    }
    reset();
  }, [ id,  onConfirm, reset,type ,value,valueType,selectValue,valueKey]);

  const handleOnCancel = useCallback(() => {
    onCancel();
    reset();
  }, [onCancel, reset]);
  function validateConstant(value:string,valueType:string,selectValue:string,valueKey:string): void {
    if(valueType === "ATTRIBUTE" || (type==="JSON" && valueType === "TEXT")){
      setDocumentValid(value.length > 0&&valueType.length > 0&&selectValue.length > 0&&valueKey.length > 0);
    }else{
      setDocumentValid(value.length > 0&&valueType.length > 0&&selectValue.length > 0);
    }
  }
  function handleOnValueKeyChange(valueKey: string) {
    validateConstant(value,valueType,selectValue,valueKey);
    setValueKey(valueKey);
  }

  function handleSelectValue(selectValue: string,group:string) {
    validateConstant(value,valueType,selectValue,valueKey);
    if(!(group.length > 0)){
      setDocumentValid(false);
    }else{
      setSelectValue(selectValue)
    }
    }
  
  function handleOnValueChange(value: string) {
    validateConstant(value,valueType,selectValue,valueKey);
    setValue(value);
  }
  
    function handleValueTypeChange(valueType: string) {
    validateConstant(value,valueType,selectValue,valueKey);
    setValueType(valueType);
  }

  // resync the internal state to the values passed in as props
  useEffect(reset, [reset]);
console.log("firstraj",type)
  return (
    <ConfirmationDialog
      title={title}
      onCancel={handleOnCancel}
      onConfirm={isDocumentValid?handleOnConfirm:undefined}
      isOpen={isOpen}
    >
      <Form>
        <FormGroup label={'Value'} fieldId={'constvalue'} isRequired={true}>
          <TextInput
            value={value}
            onChange={handleOnValueChange}
            id={'constvalue'}
            autoFocus={true}
            isRequired={true}
            data-testid={'Document-value-text-input'}
          />
        </FormGroup>
        {(valueType === "ATTRIBUTE" || (type==="JSON" && valueType === "TEXT"))&&
        <FormGroup label={'Key'} fieldId={'name'} isRequired={true}>
          <TextInput
            value={valueKey}
            onChange={(value) => handleOnValueKeyChange(value)}
            id={id}
            name={valueKey}
            isRequired={true}
            data-testid={id + '-parameter-text-input'}
          />
        </FormGroup>}

        <FormGroup label={'select'} fieldId={'constvalue'} isRequired={true}>
          <AddFieldTypeaheadV2
            id={id?id:""}
            type={type}
            ariaLabelTypeAhead={'Select Document to add to the mapping'}
            placeholderText={'Select Document to add to the mapping'}
            isSource={true}
            fields={addableSources?.map((s) => ({
              label: s?.path,
              group: s?.amField!?.docDef.name,
              id: s?.amField!?.docDef.id,
              type: s?.type
            }))}
            onChange={handleSelectValue}
            value={selectValue}
            data-testid={'add-Document-to-mapping'}
          />
        </FormGroup>
        <FormGroup label={'Value type'} fieldId={'valueType'}>
          <FormSelect
            value={valueType}
            aria-label={'Select value type'}
            onChange={handleValueTypeChange}
            data-testid={'Document-type-form-select'}
            isRequired={true}
          >
            <FormSelectOption key={"PlaceHolder"} value={''} label={"Select value type"} />
            {valueTypeOptions.map(({ label, value }, idx) => {
                if(type==="JSON"&& value ==='ATTRIBUTE')
                  return
                else
                  return ( <FormSelectOption key={idx} value={value} label={label} />) 
            })}
          </FormSelect>
        </FormGroup>
      </Form>
    </ConfirmationDialog>
  );
};
