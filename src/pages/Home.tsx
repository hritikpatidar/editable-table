import React from "react";
import {
    Box,
    Container,
    Typography,
    Breadcrumbs,
    Link,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import EditableTable from "../components/EditableTable";

const Home: React.FC = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                py: { xs: 2, sm: 3, md: 4 },
                px: { xs: 1, sm: 2, md: 0 },
            }}
        >
            <Container maxWidth="xl">
                <Breadcrumbs
                    sx={{
                        mb: 3,
                        "& .MuiBreadcrumbs-separator": {
                            color: "var(--text-lighter)",
                        },
                    }}
                >
                    <Link
                        underline="hover"
                        color="inherit"
                        href="#"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "var(--text-light)",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            "&:hover": {
                                color: "var(--primary)",
                            },
                        }}
                    >
                        <HomeIcon sx={{ fontSize: "1.2rem" }} />
                        Dashboard
                    </Link>
                    <Typography
                        sx={{
                            color: "var(--text)",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                        }}
                    >
                        Employee Management
                    </Typography>
                </Breadcrumbs>
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "var(--text)",
                            mb: 1,
                            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
                        }}
                    >
                        Employee Management System
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "var(--text-light)",
                            fontSize: { xs: "0.95rem", sm: "1rem" },
                            maxWidth: "600px",
                            lineHeight: 1.6,
                        }}
                    >
                        Manage, edit, and organize employee records with inline editing, advanced filtering,
                        sorting, and export capabilities.
                    </Typography>
                </Box>
                <EditableTable />
            </Container>
        </Box>
    );
};

export default Home;