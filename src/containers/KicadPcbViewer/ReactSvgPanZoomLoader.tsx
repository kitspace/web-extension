import React from 'react'
import PropTypes from 'prop-types'
import { SvgLoader } from 'react-svgmt'

/**
 * Loading the svg file using react-svgmt
 * @param props
 * @returns {*}
 * @constructor
 */
export function ReactSvgPanZoomLoader(props: ReactSvgPanZoomLoaderProps) {
  return (
    <div>
      {props.render(<SvgLoader svgXML={props.svgXML}>{props.proxy}</SvgLoader>)}
    </div>
  )
}

ReactSvgPanZoomLoader.defaultProps = {
  proxy: '',
}

ReactSvgPanZoomLoader.propTypes = {
  svgXML: PropTypes.string,
  render: PropTypes.func.isRequired,
  proxy: PropTypes.node,
}

export interface ReactSvgPanZoomLoaderProps {
  svgXML?: string
  render: Function
  proxy: any
}
