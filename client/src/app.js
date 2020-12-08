import React from 'react'
import Router from './router'

import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'

const app = () => (
  <React.Fragment>
    <CssBaseline />
    <Container maxWidth='sm'>
      <Router />
    </Container>
  </React.Fragment>
)

export default app
