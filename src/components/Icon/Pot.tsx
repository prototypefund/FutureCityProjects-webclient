import React from "react"

interface IProps {
  size: number
}

export default class Pot extends React.Component<IProps> {
  public render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.516 30.2" height={this.props.size}>
        <g fill="currentColor">
          <path d="M3.163 13.253V25.5a4.69 4.69 0 0 0 4.782 4.6H28.57c1.245.027 2.45-.444 3.346-1.307s1.414-2.048 1.436-3.293V13.253h-1.6V25.5a3.12 3.12 0 0 1-3.193 3.068H7.945A3.13 3.13 0 0 1 4.752 25.5V13.253z"/>
          <path d="M34.9 14.335l-.007 1.524-3.063.007v1.532h3.07c.407 0 .797-.163 1.083-.452a1.53 1.53 0 0 0 .442-1.087v-1.517a1.52 1.52 0 0 0-1.525-1.539h-3.07v1.532zM1.632 15.86l3.063.007V17.4h-3.07c-.407 0-.797-.163-1.083-.452A1.53 1.53 0 0 1 .1 15.86v-1.517a1.52 1.52 0 0 1 1.525-1.539h3.07v1.532h-3.07z"/>
          <path d="M3.1 12.923h30.1v1.45H3.1z"/>
          <path d="M4.952 11.868c.274-1.05.76-2.03 1.43-2.885 2.076-2.668 5.86-4.288 11.877-4.288s9.805 1.62 11.877 4.288c.67.854 1.155 1.836 1.428 2.885.115.408.182.827.2 1.25h1.6a8.51 8.51 0 0 0-1.947-5.055c-2.393-3.075-6.654-4.9-13.148-4.9S7.503 4.988 5.11 8.063a8.51 8.51 0 0 0-1.946 5.055h1.59c.018-.423.085-.842.2-1.25z"/>
          <path d="M17.493 2.4c.008-.147.045-.29.11-.423a.62.62 0 0 1 .655-.342.62.62 0 0 1 .655.342c.066.132.103.276.11.423v1.53h1.532V2.4a2.51 2.51 0 0 0-.272-1.108C19.91.526 19.113.057 18.26.1c-.852-.044-1.648.424-2.025 1.19a2.51 2.51 0 0 0-.275 1.111v1.53h1.532z"/>
        </g>
      </svg>
    )
  }
}