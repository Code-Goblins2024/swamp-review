/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Typography } from '@mui/joy';

import AdminTable from "../components/AdminTable";

const Admin = () => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
            <Box
                component="main"
                className="MainContent"
                sx={{
                    px: { xs: 2, md: 6 },
                    pt: {
                        xs: 'calc(12px + var(--Header-height))',
                        sm: 'calc(12px + var(--Header-height))',
                        md: 3,
                    },
                    pb: { xs: 2, sm: 2, md: 3 },
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    height: '100dvh',
                    gap: 1,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        mb: 1,
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'start', sm: 'center' },
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}
                >
                    <Typography level="h2" component="h1">
                        Reviews
                    </Typography>
                </Box>
                <AdminTable />
            </Box>
        </Box>
    );
}

export default Admin;
