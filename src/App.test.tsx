import React from 'react';
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect'

const history = createMemoryHistory()

test('renders learn react link', () => {
  history.push('/')
  let renderedPage = render(
    <Router history={history}>
      <App />
    </Router>
  )
  expect(renderedPage.container.querySelectorAll("a").length).toBe(1)
});
