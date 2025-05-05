import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <NavLink to="/">
        <button>
          Home Page
        </button>
      </NavLink>
      <NavLink to="/about">
        <button>
          About
        </button>
      </NavLink>
    </>
  );
};

export default Navbar;
