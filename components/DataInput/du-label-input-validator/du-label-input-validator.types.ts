import { type DuLabelProps } from "../du-label/du-label.types";
import { type DuInputFieldProps, type DuInputFieldType } from "../du-input-field/du-input-field.types";

export interface DuLabelInputValidatorProps extends DuLabelProps,
  Omit<DuInputFieldProps, "type"> {
  inputType?: DuInputFieldType;
}
