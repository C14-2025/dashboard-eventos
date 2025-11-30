import { useAuth } from '@/context/AuthContext';
import { User } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-end px-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{user?.name || user?.email}</p>
          <p className="text-xs text-muted-foreground">Administrador</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
