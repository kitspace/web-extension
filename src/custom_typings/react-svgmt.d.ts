declare module 'react-svgmt' {
  import React from 'react'

  export interface SvgLoaderProps {
    path?: string
    svgXML?: string
    onSVGReady?: Function
    children: any
  }

  declare class SvgLoader extends React.Component<SvgLoaderProps, any> {}
}
