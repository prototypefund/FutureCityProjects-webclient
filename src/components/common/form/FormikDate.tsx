import de from "date-fns/locale/de"
import React from "react"
import DatePicker from "react-datepicker"
import { FormGroup, Label } from "reactstrap"

import { includeDefaultNamespaces, withTranslation } from "services/i18n"
import FormikElement, { IBaseFormikProps } from "./FormikElement"

interface IProps extends IBaseFormikProps {
  value: string
  labels: object,
}

class FormikDate extends FormikElement<IProps> {
  public render() {
    const { id, field, form, value } = this.props
    const labelText = this.labelText()

    return <FormGroup>
      {labelText.length > 0 && <Label for={field.name}>{labelText}</Label>}

      {this.helpElement()}

      <DatePicker
        className="form-control"
        dateFormat="P"
        id={id || field.name}
        name={field.name}
        locale={de} // @todo customize
        onChange={(val) => {
          form.setFieldValue(field.name, val)
        }}
        selected={(value && new Date(value)) || null}
      />

      {this.errorElement()}
    </FormGroup>
  }
}

export default withTranslation(includeDefaultNamespaces())(FormikDate)
