import { Link, useLocation } from 'react-router-dom';
import { Home, UserPlus, Timer, Search, Trophy } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const items = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/register', icon: UserPlus, label: 'Register' },
    { to: '/assess', icon: Timer, label: 'Assess' },
    { to: '/scout', icon: Search, label: 'Scout' },
    { to: '/challenges', icon: Trophy, label: 'Challenges' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <Link
          key={item.to}
          to={item.to}
          className={`bottom-nav-item ${item.to === '/' ? location.pathname === '/' ? 'active' : '' : location.pathname.startsWith(item.to) ? 'active' : ''}`}
        >
          <item.icon size={22} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
