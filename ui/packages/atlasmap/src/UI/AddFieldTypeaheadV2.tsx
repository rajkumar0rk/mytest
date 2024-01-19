
import {
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';
import React, { FunctionComponent, useCallback, useState } from 'react';

import styles from './AddFieldTypeaheadV2.module.css';

export interface IAddFieldTypeaheadFieldV2 {
  label: string;
  group: string;
  id: string;
  type:string;
}

export interface IAddFieldTypeaheadPropsV2 {
  id: string,
  type?: string,
  fields: IAddFieldTypeaheadFieldV2[];
  ariaLabelTypeAhead: string;
  placeholderText: string;
  isSource: boolean;
  onChange: (value:string,group:string) => void;
  value:string;

}

export const AddFieldTypeaheadV2: FunctionComponent<IAddFieldTypeaheadPropsV2> = ({
  id,
  fields,
  ariaLabelTypeAhead,
  placeholderText,
  isSource,
  onChange,
  value
}) => {
  const [values, setValues] = useState(value)
 
  const renderOptions = (
    fields: IAddFieldTypeaheadFieldV2[],
    placeholderField: IAddFieldTypeaheadFieldV2,
    id?: string
  ) => {
    fields.unshift(placeholderField);
    console.log("first", placeholderField, id)
    return fields.map((option) => {
      if (option.id === id && option.type==="COMPLEX") {
        const optValue = option.group + '\\' + option.label;
        return <FormSelectOption
          isPlaceholder={option.group.length === 0}
          isDisabled={false}
          label={option.label}
          key={
            optValue + (isSource ? '-document' : '-target') + fields.indexOf(option)
          }
          value={optValue}
          data-testid={`add-field-option-${optValue}`}
          className={styles.field} />
      }
      else {
        return
      }
    })

  }

  const handleOnChange = useCallback(
    (value: string, _e: React.FormEvent<HTMLSelectElement>) => {
      
      const valueComps = value.split('\\');
      const selField = fields.find(
        (f) => f.label === valueComps[1] && f.group === valueComps[0],
      );
      if (selField) {
        setValues(value);
        onChange(selField.label,selField.group);
      } 
    },
    [fields, values],
  );

  const placeholderField: IAddFieldTypeaheadFieldV2 = {
    label: placeholderText,
    group: '',
    id: id,
    type:'COMPLEX'
  };

  return (
    <div>
      <FormSelect
        value={values}
        aria-label={ariaLabelTypeAhead}
        className={styles.select}
        data-testid={'mapping-details-add-field'}
        id={value}
        isRequired={true}
        onChange={handleOnChange}
        placeholder={placeholderText}
      >
        {renderOptions(fields, placeholderField, id)}
      </FormSelect>
    </div>
  );
};
