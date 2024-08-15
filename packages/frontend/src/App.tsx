import { BrowserRouter as Router } from 'react-router-dom';

import Pages from './pages';
import { SnackbarProvider } from 'notistack';

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
