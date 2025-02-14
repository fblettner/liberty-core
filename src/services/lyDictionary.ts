/*
 * Copyright (c) 2022 NOMANA-IT and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 * *
 */

import { IEnumProps } from "@ly_types/lyEnums";
import { ILookupProps } from "@ly_types/lyLookup";
import { lyGetEnums } from "@ly_services/lyEnums";
import { lyGetLookup } from "@ly_services/lyLookup";
import { ISequenceProps } from "@ly_types/lySequence";
import { lyGetSequence } from "@ly_services/lySequence";
import { INextNumberProps } from "@ly_types/lyNextNum";
import { lyGetNextNumber } from "@ly_services/lyNextNum";

export class ToolsDictionary {

  private static customGetEnums?: (props: IEnumProps) => Promise<any>;
  private static customGetSequence?: (props: ISequenceProps) => Promise<any>;
  private static customGetNextNumber?: (props: INextNumberProps) => Promise<any>;
  private static customGetLookup?: (props: ILookupProps) => Promise<any>;

  public static setCustomGetEnums(fn: (props: IEnumProps) => Promise<any>) {
    ToolsDictionary.customGetEnums = fn;
  }

  public static setCustomGetSequence(fn: (props: ISequenceProps) => Promise<any>) {
    ToolsDictionary.customGetSequence = fn;
  }

  public static setCustomGetNextNumber(fn: (props: INextNumberProps) => Promise<any>) {
    ToolsDictionary.customGetNextNumber = fn;
  }

  public static setCustomGetLookup(fn: (props: ILookupProps) => Promise<any>) {
    ToolsDictionary.customGetLookup = fn;
  }
  
  public static getNextNumber = async (props: INextNumberProps) => {
    if (ToolsDictionary.customGetNextNumber) {
      return await ToolsDictionary.customGetNextNumber(props);
    }
    return await lyGetNextNumber(props); // Default implementation
  };

  public static getSequence = async (props: ISequenceProps) => {
    if (ToolsDictionary.customGetSequence) {
      return await ToolsDictionary.customGetSequence(props);
    }
    return await lyGetSequence(props); // Default implementation
  };

  public static getEnums = async (props: IEnumProps) => {
    if (ToolsDictionary.customGetEnums) {
      return await ToolsDictionary.customGetEnums(props);
    }
    return await lyGetEnums(props); // Default implementation
  };

  public static getLookup = async (props: ILookupProps) => {
    if (ToolsDictionary.customGetLookup) {
      return await ToolsDictionary.customGetLookup(props);
    }
    return await lyGetLookup(props); // Default implementation
  };

  public static JdeToDate = (jde: number): Date|null => {
    if (jde === 0)
      return null;
    const year = Math.floor(jde / 1000) + 1900;
    const dayOfYear = jde % 1000;
    const date = new Date(year, 0, dayOfYear);
    return date;
  };

  public static DateToJde = (iso: string): string => {
    const date = new Date(iso);
    const year = date.getFullYear() - 1900;
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const dayOfYear = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${year * 1000 + dayOfYear}`;
  };
}




