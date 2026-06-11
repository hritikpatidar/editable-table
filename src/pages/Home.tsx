import React from "react";
import {
    Box,
    Container,
    Typography,
} from "@mui/material";

import EditableTable from "../components/EditableTable";

const Home: React.FC = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f4f6f8",
                py: 4,
            }}
        >
            <Container maxWidth="xl">
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        mb: 2,
                    }}
                >
                    Advanced Editable Data Table
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Inline Editing, Sorting,
                    Filtering, Pagination,
                    CSV Export & Undo Support
                </Typography>

                <EditableTable />
            </Container>
        </Box>
    );
};

export default Home;