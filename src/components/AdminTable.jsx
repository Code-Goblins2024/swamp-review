import React, { useEffect, useState } from "react";
import { Button, Link, Input, Typography, Chip, Avatar, Box, Modal, ModalDialog, ModalClose, Table, Sheet, Checkbox, Divider, FormControl, FormLabel, Select, Option, Menu, MenuButton } from "@mui/joy";
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

import { getFlaggedReviews, updateReviewStatus } from "../functions/reviewQueries";

const AdminTable = () => {
    const [selected, setSelected] = useState([]);
    const [open, setOpen] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchFlaggedReviews();
    }, []);

    const fetchFlaggedReviews = async (statusFilter = "in_review") => {
        try {
            setIsLoading(true);
            const reviews = await getFlaggedReviews();
            const filteredReviews = reviews.filter((review) => review.reviews.status === statusFilter);
            console.log(filteredReviews);
            setReviews(reviews);
        } catch (error) {
            console.log(error)
            setReviews([]);
        } finally {
            setIsLoading(false);
        }
    }


    async function handleApprove(review_id) {
        try {
            console.log("approving review");
            await updateReviewStatus(review_id, "approved");
            await fetchFlaggedReviews("in_review");
        } catch (error) {
            console.log(error)
        }
    }

    async function handleReject(review_id) {
        try {
            console.log("rejecting review");
            await updateReviewStatus(review_id, "rejected");
            await fetchFlaggedReviews("in_review");
        } catch (error) {
            console.log(error)
        }
    }

    function handleDelete() {
        // TODO: decide if we want to delete reviews
    }

    const RowMenu = ({ review_id }) => {
        return (
            <Dropdown>
                <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
                >
                    <MoreHorizRoundedIcon />
                </MenuButton>
                <Menu size="sm" sx={{ minWidth: 140 }}>
                    <MenuItem onClick={() => handleApprove(review_id)}>Approve</MenuItem>
                    <MenuItem onClick={() => handleReject(review_id)}>Reject</MenuItem>
                    <Divider />
                    <MenuItem color="danger" onClick={handleDelete}>Delete</MenuItem>
                </Menu>
            </Dropdown>
        );
    }

    const renderFilters = () => (
        <React.Fragment>
            <FormControl size="sm">
                <FormLabel>Status</FormLabel>
                <Select
                    size="sm"
                    placeholder="Filter by status"
                    slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
                >
                    <Option value="approved">Approved</Option>
                    <Option value="inReview">In Review</Option>
                    <Option value="rejected">Rejected</Option>
                </Select>
            </FormControl>
        </React.Fragment>
    );

    return (
        isLoading ? (
            <Box>
                <Typography>Real</Typography>
            </Box>
        ) : (
            <React.Fragment>
                <Sheet
                    className="SearchAndFilters-mobile"
                    sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
                >
                    <Input
                        size="sm"
                        placeholder="Search"
                        startDecorator={<SearchIcon />}
                        sx={{ flexGrow: 1 }}
                    />
                    <IconButton
                        size="sm"
                        variant="outlined"
                        color="neutral"
                        onClick={() => setOpen(true)}
                    >
                        <FilterAltIcon />
                    </IconButton>
                    <Modal open={open} onClose={() => setOpen(false)}>
                        <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
                            <ModalClose />
                            <Typography id="filter-modal" level="h2">
                                Filters
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {renderFilters()}
                                <Button color="primary" onClick={() => setOpen(false)}>
                                    Submit
                                </Button>
                            </Sheet>
                        </ModalDialog>
                    </Modal>
                </Sheet>
                <Box
                    className="SearchAndFilters-tabletUp"
                    sx={{
                        borderRadius: 'sm',
                        py: 2,
                        display: { xs: 'none', sm: 'flex' },
                        flexWrap: 'wrap',
                        gap: 1.5,
                        '& > *': {
                            minWidth: { xs: '120px', md: '160px' },
                        },
                    }}
                >
                    {renderFilters()}
                </Box>
                <Sheet
                    className="OrderTableContainer"
                    variant="outlined"
                    sx={{
                        display: { xs: 'none', sm: 'initial' },
                        width: '100%',
                        borderRadius: 'sm',
                        flexShrink: 1,
                        overflow: 'auto',
                        minHeight: 0,
                    }}
                >
                    <Table
                        aria-labelledby="tableTitle"
                        stickyHeader
                        hoverRow
                        sx={{
                            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                            '--Table-headerUnderlineThickness': '1px',
                            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                            '--TableCell-paddingY': '4px',
                            '--TableCell-paddingX': '8px',
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                                    <Checkbox
                                        size="sm"
                                        indeterminate={
                                            selected.length > 0 && selected.length !== reviews.length
                                        }
                                        checked={selected.length === reviews.length}
                                        onChange={(event) => {
                                            setSelected(
                                                event.target.checked ? reviews.map((row) => row.id) : [],
                                            );
                                        }}
                                        color={
                                            selected.length > 0 || selected.length === reviews.length
                                                ? 'primary'
                                                : undefined
                                        }
                                        sx={{ verticalAlign: 'text-bottom' }}
                                    />
                                </th>
                                <th style={{ width: 120, padding: '12px 6px' }}>
                                    <Link
                                        underline="none"
                                        color="primary"
                                        component="button"
                                        endDecorator={<ArrowDropDownIcon />}
                                    >
                                        Review
                                    </Link>
                                </th>
                                <th style={{ width: 140, padding: '12px 6px' }}>Date</th>
                                <th style={{ width: 140, padding: '12px 6px' }}>Status</th>
                                <th style={{ width: 240, padding: '12px 6px' }}>Content</th>
                                <th style={{ width: 240, padding: '12px 6px' }}>User</th>
                                <th style={{ width: 140, padding: '12px 6px' }}> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((row) => (
                                <tr key={row.id}>
                                    <td style={{ textAlign: 'center', width: 120 }}>
                                        <Checkbox
                                            size="sm"
                                            checked={selected.includes(row.id)}
                                            color={selected.includes(row.id) ? 'primary' : undefined}
                                            onChange={(event) => {
                                                setSelected((ids) =>
                                                    event.target.checked
                                                        ? ids.concat(row.id)
                                                        : ids.filter((itemId) => itemId !== row.id),
                                                );
                                            }}
                                            slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                                            sx={{ verticalAlign: 'text-bottom' }}
                                        />
                                    </td>
                                    <td>
                                        <Typography level="body-xs">{row.reviews.review_id}</Typography>
                                    </td>
                                    <td>
                                        <Typography level="body-xs">
                                            {new Date(row.reviews.created_at)
                                                .toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })
                                            }
                                        </Typography>
                                    </td>
                                    <td>
                                        <Chip
                                            variant="soft"
                                            size="sm"
                                            startDecorator={
                                                {
                                                    Paid: <CheckRoundedIcon />,
                                                    Refunded: <AutorenewRoundedIcon />,
                                                    Cancelled: <BlockIcon />,
                                                }[row.reviews.status]
                                            }
                                        >
                                            {row.reviews.status}
                                        </Chip>
                                    </td>
                                    <td>
                                        <Typography level="body-xs">{row.reviews.content}</Typography>
                                    </td>
                                    <td>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Avatar size="sm">{row.reviews.users.first_name[0]}</Avatar>
                                            <div>
                                                <Typography level="body-xs">{row.reviews.users.first_name + ' ' + row.reviews.users.last_name}</Typography>
                                                <Typography level="body-xs">{row.reviews.users.email}</Typography>
                                            </div>
                                        </Box>
                                    </td>
                                    <td>
                                        <RowMenu review_id={row.reviews.review_id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Sheet>
                <Box
                    className="Pagination-laptopUp"
                    sx={{
                        pt: 2,
                        gap: 1,
                        [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
                        display: {
                            xs: 'none',
                            md: 'flex',
                        },
                    }}
                >
                </Box>
            </React.Fragment>
        )
    );
};

export default AdminTable;
