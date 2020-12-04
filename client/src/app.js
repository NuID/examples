import logo from './logo.svg';
import './app.css';

const app = () => (
  <div className="app">
    <header className="app-header">
      <img src={logo} className="app-logo" alt="logo" />
      <p>
        Edit <code>src/app.js</code> and save to reload.
      </p>
      <a
        className="app-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
        >
        Learn React
      </a>
    </header>
  </div>
)

export default app
