import { RouterProvider } from 'react-router-dom';
import router from './routes/Routes';
import './App.css';

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App; // ודא שיש כאן ייצוא ברירת מחדל
