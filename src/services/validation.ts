import { IProjectTask, IWorkPackage } from "api/schema"

export interface IValidationErrors {
  [key: string]: string
}

export const validateResourceRequirement = (values: any) => {
  const errors: IValidationErrors = {}

  const description = values.description.trim()
  if (description.length === 0) {
    errors.description = "validate.general.notBlank"
  } else if (description.length < 5) {
    errors.description = "validate.general.tooShort"
  } else if (description.length > 280) {
    errors.description = "validate.general.tooLong"
  }

  if (typeof values.cost === "number") {
    if (values.cost < 0 || values.cost > 99999999) {
      errors.cost = "validate.general.outOfRange"
    }
  } else if (values.cost) {
    errors.cost = "validate.general.noNumber"
  }

  return errors
}

export const validateTask = (values: IProjectTask) => {
  const errors: IValidationErrors = {}

  const description = values.description.trim()
  if (description.length === 0) {
    errors.description = "validate.general.notBlank"
  } else if (description.length < 5) {
    errors.description = "validate.general.tooShort"
  } else if (description.length > 500) {
    errors.description = "validate.general.tooLong"
  }

  return errors
}

export const validateWorkPackage = (values: IWorkPackage) => {
  const errors: IValidationErrors = {}

  const description = values.description ? values.description.trim() : ""
  if (description.length > 500) {
    errors.description = "validate.general.tooLong"
  }

  const name = values.name ? values.name.trim() : ""
  if (name.length === 0) {
    errors.name = "validate.general.notBlank"
  } else if (name.length < 2) {
    errors.name = "validate.general.tooShort"
  } else if (name.length > 100) {
    errors.name = "validate.general.tooLong"
  }

  const mainResponsibility = values.mainResponsibility ? values.mainResponsibility.trim() : ""
  if (mainResponsibility.length > 100) {
    errors.mainResponsibility = "validate.general.tooLong"
  }

  return errors
}