import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {Main} from './index'

export const serverRender = ()=> {
 const html =  ReactDOMServer.renderToString(<Main />)
 console.log(html)
  return `
     <!doctype html>
     <html>
       <head>
         <title>Server Render </title>
       </head>
       <body>
         <div id="root">${html}</div>
       </body>
     </html>
     `
}