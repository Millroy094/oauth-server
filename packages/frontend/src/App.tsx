import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Pages from './pages';

function App() {
  return (
    <Router>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        preventDuplicate
      >
        <Pages />
      </SnackbarProvider>
    </Router>
  );
}

export default App;
