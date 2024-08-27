import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Pages from './pages';
import AuthProvider from './context/AuthProvider';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          preventDuplicate
        >
          <Pages />
        </SnackbarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
