import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import InputBase from '@material-ui/core/InputBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/More';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import BugDetail from './BugDetail';
import BugsOverview from './BugsOverview';
import { Switch, Route } from 'react-router-dom'
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import GenericModal from './GenericModal';
import CreateSwimLaneModalContent from './CreateSwimLaneModalContent';
import { connect } from 'react-redux';
import { startCreatingNewSwimLane, getLabels } from './redux-stuff/actions/actionCreators';
import ProjectSettings from './ProjectSettings';
import Statistics from './Statistics';

const drawerWidth = 240;

const styles = theme => ({

    root: {
        display: 'flex',
    },
    grow: {
        flexGrow: 1
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        // padding: theme.spacing.unit * 3,
    },
    toolbar: theme.mixins.toolbar,
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
});

class ResponsiveDrawer extends React.Component {
    state = {
        mobileOpen: false,
        mobileMoreAnchorEl: null,
        anchorEl: null,
        modalOpened: false,
        modalType: null
    };

    componentDidMount() {
        this.props.dispatch(getLabels());
    }

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    handleProfileMenuOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: null });
        this.setState({
            modalOpened: true
        })
    };

    handleMobileMenuOpen = event => {
        this.setState({ mobileMoreAnchorEl: event.currentTarget });
    };

    handleMobileMenuClose = () => {
        this.setState({ mobileMoreAnchorEl: null });
    };

    renderModalWithCustomContent = (fContentCreator) => {

    }

    onGenericModalClose = () => {
        this.setState({
            modalOpened: false
        })
    }

    onModalOpenClick = (modalType) => {
        this.setState({
            modalType,
            modalOpened: true
        })
    }

    onNewSwimLaneDone = (newSwimLane) => {
        this.onGenericModalClose();
        this.props.dispatch(startCreatingNewSwimLane(newSwimLane));
    }

    render() {
        const { classes, theme } = this.props;
        const { anchorEl, mobileMoreAnchorEl } = this.state;
        const isMenuOpen = Boolean(anchorEl);
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

        const renderMenu = (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
            </Menu>
        );

        const renderMobileMenu = (
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMobileMenuOpen}
                onClose={this.handleMobileMenuClose}
            >
                <MenuItem>
                    <IconButton color="inherit" >
                        <Badge badgeContent={4} color="secondary">
                            <MailIcon />
                        </Badge>
                    </IconButton>
                    <p>Messages</p>
                </MenuItem>
                <MenuItem>
                    <IconButton color="inherit">
                        <Badge badgeContent={11} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <p>Notifications</p>
                </MenuItem>
                <MenuItem onClick={this.handleProfileMenuOpen}>
                    <IconButton color="inherit">
                        <AccountCircle />
                    </IconButton>
                    <p>Profile</p>
                </MenuItem>
            </Menu>
        );
        const drawer = (
            <div>
                <Grid
                    container>
                    <Grid item>
                        <List>
                            <ListItem button key="bugsOverViewListItem" onClick={() => this.props.history.push("/")}>
                                <ListItemIcon> <InboxIcon /></ListItemIcon>
                                <ListItemText primary="Bugs Overview" />
                            </ListItem>
                            <ListItem button key="statisticsListItem" onClick={() => this.props.history.push("/statistics")}>
                                <ListItemIcon> <InboxIcon /></ListItemIcon>
                                <ListItemText primary="Statistics" />
                            </ListItem>
                            <ListItem button key="projectSettingsListItem" onClick={() => this.props.history.push("/projectSettings")}>
                                <ListItemIcon> <InboxIcon /></ListItemIcon>
                                <ListItemText primary="Project settings" />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item>
                        {/* <ListItem button key="hideDrawerListItem">
                            <ListItemIcon> <InboxIcon /></ListItemIcon>
                            <ListItemText primary="Collapse Sidebar" />
                        </ListItem> */}
                    </Grid>
                </Grid>
            </div>
        );

        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Hidden mdUp implementation="css">
                            <IconButton
                                color="inherit"
                                aria-label="Open drawer"
                                onClick={this.handleDrawerToggle}
                                className={classes.menuButton}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Hidden>

                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            JBugger
                         </Typography>

                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />
                        </div>
                        <div className={classes.sectionDesktop}>
                            <IconButton color="inherit">
                                <Badge badgeContent={4} color="secondary">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                            <IconButton color="inherit">
                                <Badge badgeContent={17} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                                aria-haspopup="true"
                                onClick={this.handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        </div>
                        {/* <Button color="inherit" onClick={() => {
                            this.props.onLogout();
                            this.props.history.push("/login");
                        }}>Logout</Button> */}
                        <div className={classes.sectionMobile}>
                            <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                                <MoreIcon />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>

                {renderMenu}
                {renderMobileMenu}

                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden mdUp implementation="css">
                    <Drawer
                        container={this.props.container}
                        variant="temporary"
                        className={classes.drawer}
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={this.state.mobileOpen}
                        onClose={this.handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden smDown implementation="css">
                    <Drawer
                        className={classes.drawer}
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <div className={classes.toolbar} />
                        {drawer}
                    </Drawer>
                </Hidden>

                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <Route
                        exact
                        path={`${this.props.match.path}`}
                        render={() => <BugsOverview onModalOpenClick={this.onModalOpenClick} />}
                    />
                    <Route
                        path={`${this.props.match.path}bugs/bug/:bugId`}
                        component={BugDetail} />
                    <Route
                        exact
                        path={`${this.props.match.path}statistics`}
                        component={Statistics} />
                    <Route
                        exact
                        path={`${this.props.match.path}projectSettings`}
                        component={ProjectSettings} />
                </main>

                {this.state.modalOpened ?
                    <GenericModal onClose={this.onGenericModalClose}>
                        {this.state.modalType === "createSwimlaneModal" ?
                            <CreateSwimLaneModalContent onNewSwimLaneDone={this.onNewSwimLaneDone} />
                            :
                            ""}
                    </GenericModal>
                    :
                    ""}
            </div>
        );
    }
}

ResponsiveDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    // Injected by the documentation to work in an iframe.
    // You won't need it on your project.
    container: PropTypes.object,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(withRouter(connect()(ResponsiveDrawer)));