import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar glass-panel">
      <div className="navbar-brand">
        <h2>Crust & Crumb</h2>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className={isActive('/')}>Dashboard</Link>
        </li>
        <li>
          <Link to="/products" className={isActive('/products')}>Products</Link>
        </li>
        <li>
          <Link to="/sales" className={isActive('/sales')}>Sales (POS)</Link>
        </li>
        <li>
          <Link to="/inventory" className={isActive('/inventory')}>Inventory</Link>
        </li>
      </ul>
      <div className="navbar-user">
        <div className="avatar">Admin</div>
      </div>
    </nav>
  );
};

export default Navbar;
