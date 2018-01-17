/* eslint-disable no-underscore-dangle */

import {SheetsRegistry} from 'jss';
import {createMuiTheme, createGenerateClassName, } from 'material-ui/styles';
import lightBlue from 'material-ui/colors/lightBlue';
import amber from 'material-ui/colors/amber';
import blue from 'material-ui/colors/blue';


const theme = createMuiTheme({
    palette: {
     // primary: lightBlue,
     // secondary: amber,
      type: 'light'
    }
  });


function createPageContext() {
  return {
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    // The standard class name generator.
    generateClassName: createGenerateClassName(),
  };
}

export default function getPageContext() {
  // Make sure to create a new context for every server-side request so that data
  // isn't shared between connections (which would be bad).
  if (!process.browser) {
    return createPageContext();
  }

  // Reuse context on the client-side.
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createPageContext();
  }

  return global.__INIT_MATERIAL_UI__;
}
