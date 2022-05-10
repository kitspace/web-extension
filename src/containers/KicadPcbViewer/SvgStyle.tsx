import React from 'react'
import { board as kicadTheme } from './kicadThemeDefault.json'

const styleString =
  `g.kicad_svg_layer {
     stroke: white;
     fill: white;
   }
   ` +
  Object.keys(kicadTheme)
    .filter(key => key !== 'copper')
    .map(
      key => `
          g.kicad_svg_layer.${key} {
            stroke: ${kicadTheme[key]};
            fill: ${kicadTheme[key]};
          }
          `,
    )
    .join('') +
  Object.keys(kicadTheme.copper)
    .map(
      key => `
         g.kicad_svg_layer.copper.${key} {
           stroke: ${kicadTheme.copper[key]};
           fill: ${kicadTheme.copper[key]};
         }
         `,
    )
    .join('')

export function SvgStyle() {
  return (
    <style global jsx>
      {styleString}
    </style>
  )
}
