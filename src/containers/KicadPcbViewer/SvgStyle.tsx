import React from 'react'
import kicadTheme from './kicadThemeDefault.json'

const styleString =
  `.kicad_svg_layer {
     stroke: white;
     fill: white;
     stroke-opacity: 0.8;
     fill-opacity: 0.8;
   }
   .stroked-text {
     fill-opacity: 0;
   }
   ` +
  Object.keys(kicadTheme.board)
    .filter(key => key !== 'copper')
    .map(
      key => `
          .kicad_svg_layer.${key} {
            stroke: ${kicadTheme.board[key]};
            fill: ${kicadTheme.board[key]};
          }
          `,
    )
    .join('') +
  Object.keys(kicadTheme.board.copper)
    .map(
      key => `
         .kicad_svg_layer.copper.${key} {
           stroke: ${kicadTheme.board.copper[key]};
           fill: ${kicadTheme.board.copper[key]};
         }
         `,
    )
    .join('')

export function SvgStyle() {
  return <style dangerouslySetInnerHTML={{ __html: styleString }} />
}
