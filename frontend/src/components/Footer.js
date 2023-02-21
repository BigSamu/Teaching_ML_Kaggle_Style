import React from 'react';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';


// *****************************************************************************
// A) Component Code
// *****************************************************************************

const Footer = () => {

  // ---------------------------------------------------------------------------
  // I) JSX
  // ---------------------------------------------------------------------------

  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Computational Privacy Group 2021
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

export default Footer;
