import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../store/authStore';
import { Sheet, IconButton, Box, Typography, Dropdown, Menu, MenuButton, MenuItem, Button, Stack, Avatar } from '@mui/joy';
import { Menu as MenuIcon, Person as PersonIcon } from '@mui/icons-material';
import supabase from '../config/supabaseClient';
import { getUserRole } from '../functions/userQueries';
import UserIcon from './UserIcon';

const Navbar = () => {
  const navigate = useNavigate();
  const { session, setSession } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (session) {
      fetchUserRole();
    }
  }, [session]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setSession(null);
      navigate('/');
    }
  };

  const fetchUserRole = async () => {
    try {
      const data = await getUserRole(session.user.id);
      setUserRole(data[0]);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setUserRole([]);
    }
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Search', path: '/search' },
    { label: 'About', path: '/about' },
  ];

  return (
    <Sheet
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        py: 1.5,
        gap: 5,
        px: { xs: 2, md: 4 },
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}>
          <img src="/swamp_review_logo.png" style={{ height: "2.5rem" }} alt="Swamp Review Logo" />
          <Typography level="h4" component="h1">
            SwampReview
          </Typography>
        </Box>
      </Link>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          display: { xs: 'none', md: 'flex' },
          marginRight: 'auto',
          marginLeft: 2,
        }}
      >
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="plain"
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        ))}
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {session ? (
          <Dropdown>
            <MenuButton
              variant="plain"
              sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: 'primary.main',
                }
              }}
            >
              {session ? <UserIcon /> : <PersonIcon />}
              <Typography level="body-sm">
                {session?.user?.email?.split('@')[0] || 'User'}
              </Typography>
            </MenuButton>
            <Menu placement="bottom-end">
              {userRole && userRole.role === 'admin' && (
              <MenuItem onClick={() => navigate('/admin')}>Admin</MenuItem>
              )}
              <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Dropdown>
        ) : (
          <Button
            variant="solid"
            color="primary"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </Button>
        )}

        <IconButton
          variant="outlined"
          color="neutral"
          onClick={() => setMenuOpen(true)}
          sx={{ display: { xs: 'flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {menuOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'background.body',
            zIndex: 1000,
            p: 2,
            display: { xs: 'block', md: 'none' },
          }}
        >
          <IconButton
            onClick={() => setMenuOpen(false)}
            sx={{ position: 'absolute', right: 2, top: 2 }}
          >
            Close
          </IconButton>
          <Stack spacing={2} sx={{ mt: 6 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                fullWidth
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Box>
      )}
    </Sheet>
  );
};

export default Navbar;