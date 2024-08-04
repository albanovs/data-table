import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Box, Typography, CircularProgress, Paper, IconButton, TextField } from '@mui/material';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import { TailSpin } from 'react-loader-spinner';
import { API_KEY, BASE_URL } from '../config';
import CloseIcon from '@mui/icons-material/Close';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
        field: 'poster_path',
        headerName: 'Постер',
        width: 150,
        renderCell: (params) => (
            <LazyLoad height={200} placeholder={<CircularProgress />}>
                <img src={`https://image.tmdb.org/t/p/w200${params.value}`} alt="poster" style={{ width: '100%', borderRadius: 8 }} />
            </LazyLoad>
        ),
    },
    { field: 'title', headerName: 'Название', width: 200 },
    { field: 'release_date', headerName: 'Дата премьеры', width: 150 },
    { field: 'vote_average', headerName: 'Рейтинг', type: 'number', width: 130 },
];

const DataTable = () => {
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/movie/popular`, {
                    params: {
                        api_key: API_KEY,
                    },
                });
                setMovies(response.data.results);
                setFilteredMovies(response.data.results);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredMovies(
                movies.filter((movie) =>
                    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredMovies(movies);
        }
    }, [searchTerm, movies]);

    const handleRowClick = (params) => {
        setSelectedRow(params.row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{ height: '100%', width: '100%', padding: 20 }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <TailSpin height={80} width={80} color="grey" ariaLabel="loading" />
                </Box>
            ) : (
                <Paper elevation={3} style={{ padding: 20, borderRadius: 8 }}>
                    <TextField
                        label="Поиск по названию"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        sx={{ mb: 2 }}
                    />
                    <DataGrid
                        rows={filteredMovies}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        onRowClick={handleRowClick}
                        autoHeight
                        getRowId={(row) => row.id}
                        pagination
                    />
                </Paper>
            )}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: 800,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        overflow: 'hidden',
                    }}
                >
                    <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                        <CloseIcon />
                    </IconButton>
                    {selectedRow && (
                        <>
                            <LazyLoad height={400} placeholder={<CircularProgress />}>
                                <img src={`https://image.tmdb.org/t/p/w400${selectedRow.poster_path}`} alt="Large poster" style={{ width: '100%', borderRadius: 8 }} />
                            </LazyLoad>
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                                <Typography variant="h6" component="h2" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                                    {selectedRow.title}
                                </Typography>
                                <Typography sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                                    Дата премьеры: {selectedRow.release_date}
                                </Typography>
                                <Typography sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                                    Рейтинг: {selectedRow.vote_average}
                                </Typography>
                                <Typography sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                                    Описание: {selectedRow.overview}
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default DataTable;