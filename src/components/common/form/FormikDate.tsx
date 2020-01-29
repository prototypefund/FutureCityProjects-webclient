import de from "date-fns/locale/de"
import React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FormGroup, Label } from "reactstrap"

import { SelfAssessment } from "api/schema"
import { includeDefaultNamespaces, withTranslation } from "services/i18n"
import FormikElement, { IBaseFormikProps } from "./FormikElement"

interface IProps extends IBaseFormikProps {
  value: SelfAssessment
  labels: object,
}

class FormikRange extends FormikElement<IProps> {
  public render() {
    const { field, form, value } = this.props
    const labelText = this.labelText()

    return <FormGroup>
      {labelText.length > 0 && <Label for={field.name}>{labelText}</Label>}

      {this.helpElement()}

      <DatePicker
        className="form-control"
        dateFormat="P"
        locale={de}
        onChange={(val) => {
          form.setFieldValue(field.name, val)
        }}
        selected={(value && new Date(value)) || null}
      />

      {this.errorElement()}
    </FormGroup>
  }
}

export default withTranslation(includeDefaultNamespaces())(FormikRange)