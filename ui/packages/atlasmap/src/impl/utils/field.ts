/*
    Copyright (C) 2017 Red Hat, Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import {
  ConfigModel,
  ErrorInfo,
  ErrorLevel,
  ErrorScope,
  ErrorType,
  Field,
  MappedField,
  MappingModel,
} from '@atlasmap/core';

import { LookupTableData } from '../../UI';
import { initializationService } from './ui';

export type EnumValue = {
  name: string;
  ordinal: number;
};


export function changeDocument(
  id: string, type: any, value: string, valueType: string, selectValue: string,valueKey:string,isSource:boolean
): void {
  const cfg = ConfigModel.getConfig();
  let sourceDatas = cfg.getDocsWithoutPropertyDoc(isSource)
  console.log("tttt", cfg.getDocsWithoutPropertyDoc(isSource),valueKey)
let documentString;
  let sourceData: any;
  sourceDatas.map((data:any) => {
    if (data.id === id && data) {
      sourceData = data
    }
  })
  console.log("first,",sourceData.inspectionSource)

if(type==="XML"){
  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(sourceData.inspectionSource, 'text/xml');
  // let lastValue = selectValue.split("/")
  // let elements = xmlDoc.getElementsByTagName(lastValue[lastValue.length - 1])[0];
  let elements = xmlDoc.documentElement;
  let myFun = (elements: any, array: any, i: number) => {
    if (array[i] && elements.nodeName === array[i]) {
      if (array.length - 1 > i) {
        for(let elements1 of elements.childNodes) {
          if (elements1.nodeType === 1 && array[i+1] && elements1.nodeName === array[i+1]) {
           myFun(elements1, array, ++i)
              break;
          }
        }
      }
      else {
        if (valueType === "COMPLEX") {
          let capitalizeFirstLetter = (string: string) => {
            return string.charAt(0).toUpperCase() + string.slice(1);
          }
          let node = xmlDoc.createElementNS(elements.namespaceURI, capitalizeFirstLetter(value));
          let childNodes = elements.childNodes[0];
          if (childNodes?.nextSibling === null)
            childNodes.nodeValue = ''; 
          elements.appendChild(node);
        } else if (valueType === "ATTRIBUTE") {
          elements.setAttribute(valueKey, value);
        } else {
          let newText = xmlDoc.createTextNode(value);
          let childNodes = elements.childNodes[0];
          if (childNodes)
            childNodes.nodeValue = '';
          elements.appendChild(newText);
        }
      }
    } else {
      return;
    }
  }
  myFun(elements, selectValue.split("/").filter(element => element), 0)
 
  let serializer = new XMLSerializer();
  documentString = serializer.serializeToString(xmlDoc);
} else if (type === "JSON") {
  documentString = JSON.parse(sourceData.inspectionSource)
  let myFun = (obj: any, array: any, i: number) => {
    if ([array[i]] && obj[array[i]]  ) {
      if(array.length - 1 > i){
      obj[array[i]] = myFun(obj[array[i]], array, ++i)
      return obj
    } else {
      if(valueType === "COMPLEX")
        obj[array[i]] = {...obj [array[i]] ,[value]:{}}
      else if(valueType === "ATTRIBUTE")
        obj[array[i]] = {...obj [array[i]] ,[valueKey]:value}
      else 
        obj[array[i]] = {...obj[array[i]] ,[valueKey]:value}
      return obj
    }
    }else{
      return
    }
  }
 documentString = JSON.stringify(myFun(documentString,selectValue.split("/").filter(element => element),0))
} else {
  cfg.errorService.addError(
    new ErrorInfo({
      message: `Something Went Wrong.`,
      level: ErrorLevel.ERROR,
      scope: ErrorScope.APPLICATION,
      type: ErrorType.USER,
    }),
  );
}
  cfg.documentService.addNonJavaDocument(documentString, id,  sourceData.name, type, sourceData.inspectionType, isSource).then(() => {
    cfg.fileService.updateDigestFile().finally(() => {
      cfg.initializationService.updateStatus();
      cfg.errorService.addError(
        new ErrorInfo({
          message: `Changes Completed.`,
          level: ErrorLevel.INFO,
          scope: ErrorScope.APPLICATION,
          type: ErrorType.USER,
        }),
      );

    });
  })
}
export function createConstant(
  constName: string,
  constValue: string,
  constType: string,
  addToActiveMapping?: boolean,
): void {
  const cfg = ConfigModel.getConfig();
  cfg.documentService.createConstant(
    constName,
    constValue,
    constType,
    addToActiveMapping,
  );
}

export function deleteConstant(constName: string): void {
  const cfg = ConfigModel.getConfig();
  cfg.documentService.deleteConstant(constName);
}

export function editConstant(
  constName: string,
  constValue: string,
  constType: string,
  origName?: string,
): void {
  const cfg = ConfigModel.getConfig();
  cfg.documentService.editConstant(constName, constValue, constType, origName);
}

export function getConstantType(constName: string): string {
  const cfg = ConfigModel.getConfig();
  return cfg.documentService.getConstantType(constName);
}

export function getConstantTypeIndex(constName: string): number {
  const cfg = ConfigModel.getConfig();
  return cfg.documentService.getConstantTypeIndex(constName);
}

export function createProperty(
  propName: string,
  propType: string,
  propScope: string,
  isSource: boolean,
  addToActiveMapping?: boolean,
): void {
  const cfg = ConfigModel.getConfig();
  cfg.documentService.createProperty(
    propName,
    propType,
    propScope,
    isSource,
    addToActiveMapping,
  );
}

export function deleteProperty(
  propName: string,
  propScope: string,
  isSource: boolean,
): void {
  const cfg = ConfigModel.getConfig();
  cfg.documentService.deleteProperty(propName, propScope, isSource);
}

export function editProperty(
  propName: string,
  propType: string,
  propScope: string,
  isSource: boolean,
  newName?: string,
  newScope?: string,
): void {
  const cfg = ConfigModel.getConfig();
  cfg.documentService.editProperty(
    propName,
    propType,
    propScope,
    isSource,
    newName,
    newScope,
  );
}

export function getPropertyType(
  propName: string,
  propScope: string,
  isSource: boolean,
): string {
  const cfg = ConfigModel.getConfig();
  return cfg.documentService.getPropertyType(propName, propScope, isSource);
}

export function getPropertyTypeIndex(
  propName: string,
  propScope: string,
  isSource: boolean,
): number {
  const cfg = ConfigModel.getConfig();
  return cfg.documentService.getPropertyTypeIndex(
    propName,
    propScope,
    isSource,
  );
}

/**
 * Create a new mapping or modify the existing active mapping using the specified source and target IDs.
 *
 * @param source
 * @param target
 */
export function createMapping(source: Field | undefined, target?: Field): void {
  const cfg = ConfigModel.getConfig();
  const ms = initializationService.cfg.mappingService;

  if (target) {
    if (
      source &&
      cfg.mappings?.activeMapping &&
      (source.partOfMapping || target.partOfMapping)
    ) {
      let exclusionReason = null;

      if (!source.partOfMapping) {
        exclusionReason = ms.getFieldSelectionExclusionReason(
          cfg.mappings?.activeMapping!,
          source,
        );
      } else {
        exclusionReason = ms.getFieldSelectionExclusionReason(
          cfg.mappings?.activeMapping!,
          target,
        );
      }

      if (exclusionReason !== null) {
        cfg.errorService.addError(
          new ErrorInfo({
            message: `The field '${target.name}' cannot be selected, ${exclusionReason}.`,
            level: ErrorLevel.ERROR,
            mapping: cfg.mappings?.activeMapping!,
            scope: ErrorScope.MAPPING,
            type: ErrorType.USER,
          }),
        );
        return;
      }
      if (
        target.partOfMapping &&
        cfg.mappings.activeMapping.targetFields[0]!.field!.path === target!.path
      ) {
        addToCurrentMapping(source);
        return;
      }
      if (
        source.partOfMapping &&
        cfg.mappings.activeMapping.sourceFields[0]!.field!.path === source!.path
      ) {
        addToCurrentMapping(target);
        return;
      }
    }
  }
  if (source) {
    cfg.mappingService.addNewMapping(source, false);
  } else {
    cfg.mappingService.newMapping();
  }
  if (target) {
    addToCurrentMapping(target);
  }
}

/**
 * Create a new mapping.
 */
export function newMapping(): void {
  const cfg = ConfigModel.getConfig();
  cfg.mappingService.newMapping();
}

/**
 * Removes a mapping.
 */
export function removeMapping(mappingModel: MappingModel): void {
  ConfigModel.getConfig().mappingService.removeMapping(mappingModel);
}

/**
 * Add the specified field to the current mapping.
 *
 * @param field
 */
export function addToCurrentMapping(field: Field): void {
  const cfg = ConfigModel.getConfig();
  cfg.mappingService.addFieldToActiveMapping(field);
}

/**
 * Remove the specified field from the current mapping.
 *
 * @param field
 */
export function removeFromCurrentMapping(field: Field): void {
  const cfg = ConfigModel.getConfig();
  const mapping = cfg.mappings?.activeMapping;
  if (mapping) {
    const mappedField = mapping.getMappedFieldForField(field);
    if (mappedField) {
      mapping.removeMappedField(mappedField);
      cfg.mappingService.updateMappedField(mapping);
    }
  }
}

/**
 * Add the specified field to the current mapping.
 *
 * @param field
 */
export function removeMappedFieldFromCurrentMapping(field: MappedField): void {
  const cfg = ConfigModel.getConfig();
  const mapping = cfg.mappings?.activeMapping;
  if (mapping && field) {
    mapping.removeMappedField(field);
    cfg.mappingService.updateMappedField(mapping);
  }
}

/**
 * Return the enumeration mapping lookup table associated with the active mapping.
 *
 */
export function getEnumerationValues(): LookupTableData[] {
  const cfg = ConfigModel.getConfig();
  const activeMapping = cfg.mappings?.activeMapping;
  if (!activeMapping) {
    return [];
  }
  return initializationService.cfg.mappingService.getEnumerationValues(
    cfg,
    activeMapping,
  );
}

/**
 * Retrieve the enumeration values for the specified field node ID.
 *
 * @param nodeId - enumeration field node ID
 */
export function getFieldEnums(nodeId: string): EnumValue[] {
  const uuidNode =
    initializationService.cfg.mappings!.activeMapping!.transition.expression!.getNode(
      nodeId,
    );
  if (uuidNode && uuidNode.mappedField?.field.enumeration) {
    return uuidNode.mappedField.field.enumValues;
  }
  return [];
}

/**
 * Set the value for a enumeration reference field.  This way the enumeration field may be
 * used in conditional expressions.  Not used for enumeration mappings.
 *
 * @param selectedEnumNodeId - enumeration field node ID
 * @param selectedEnumValueIndex - enumeration index value
 */
export function setSelectedEnumValue(
  selectedEnumNodeId: string,
  selectedEnumValueIndex: number,
) {
  const mapping = initializationService.cfg.mappings!.activeMapping!;
  const uuidNode = mapping.transition.expression!.getNode(selectedEnumNodeId);
  if (uuidNode && uuidNode.mappedField?.field.enumeration) {
    initializationService.cfg.mappingService.setEnumFieldValue(
      uuidNode.mappedField.field,
      selectedEnumValueIndex,
    );
    mapping.transition.expression.updateFieldReference(mapping);
    initializationService.cfg.mappingService.notifyMappingUpdated();
  }
}

export function updateEnumerationValues(
  enumerationValues: LookupTableData[],
): void {
  const cfg = ConfigModel.getConfig();
  const activeMapping = cfg.mappings?.activeMapping;
  if (!activeMapping) {
    return;
  }
  initializationService.cfg.mappingService.updateEnumerationValues(
    cfg,
    activeMapping,
    enumerationValues,
  );
}

export function isEnumerationMapping(): boolean {
  const cfg = ConfigModel.getConfig();
  return initializationService.cfg.mappingService.isEnumerationMapping(
    cfg.mappings?.activeMapping!,
  );
}
