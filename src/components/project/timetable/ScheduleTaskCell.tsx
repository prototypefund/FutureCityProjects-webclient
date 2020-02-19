import React from "react"

import { IProjectTask, IWorkPackage } from "api/schema"
import DropdownComponent from "components/common/DropdownComponent"
import Icon from "components/common/Icon"
import { useTranslation } from "services/i18n"

interface IProps {
  availablePackages: IWorkPackage[]
  onAssign?: any
  task: IProjectTask
}

const ScheduleTaskCell: React.FC<IProps> = (props: IProps) => {
  const { t } = useTranslation()
  const { availablePackages, onAssign, task } = props

  const wrappedPackages = availablePackages.map((workPackage) =>
    <a
      key={workPackage.id}
      onClick={() => onAssign({ ...task, workPackage: workPackage.id })}
      title={workPackage.name}
    >
      {workPackage.name.substr(0, 23)}{workPackage.name.length > 23 && "…"}
    </a>
)

  return <td className="task-cell">
    {task.description}
    <DropdownComponent
      button={<Icon name="plus" size={18} />}
      className="navigation-item"
      title={t("form.project.tasks.assignWorkPackage")}
    >
      {wrappedPackages}
    </DropdownComponent>
  </td>
}

export default ScheduleTaskCell