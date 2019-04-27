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
import BugReport from '@material-ui/icons/BugReport';
import SettingsIcon from '@material-ui/icons/Settings';
import BarChart from '@material-ui/icons/BarChart';
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
import { Switch, Route, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import GenericModal from './GenericModal';
import CreateSwimLaneModalContent from './CreateSwimLaneModalContent';
import { connect } from 'react-redux';
import { startCreatingNewSwimLane, getLabels, logout, getAllStatuses, setupAllInitialData, getAllStatusesAndBugs, switchProject, notAuthorizedConfirmed } from './redux-stuff/actions/actionCreators';
import ProjectSettings from './ProjectSettings';
import Statistics from './Statistics';
import axios from 'axios';
import NotificationsPopover from './popovers/NotificationsPopover';
import { Select } from '@material-ui/core';
import './Home.css';
import NotAuthorizedPopup from './popovers/NotAuthorizedPopup';

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
        overflowY: "auto",
        overflowX: "hidden",
        height: "100vh"
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
        modalType: null,
        numberOfNotifications: 0,
        notificationsAnchorEl: null,
        notifications: []
    };

    componentDidMount() {
        this.props.dispatch(setupAllInitialData());
        const queryNotificationsCount = () => {
            axios.get("http://localhost:8080/users/current/notifications/count")
                .then(({ data: newNumberOfNotifications }) => {
                    this.setState({
                        numberOfNotifications: newNumberOfNotifications
                    })
                })
        };
        queryNotificationsCount();
        setInterval(queryNotificationsCount, 2000);
    }

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    handleProfileMenuOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleMenuClose = () => {
        this.setState({ anchorEl: null });
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
        this.props.dispatch(startCreatingNewSwimLane(this.props.currentProjectId, newSwimLane));
    }

    onSignOut = () => {
        this.props.dispatch(logout());
    }

    closeNotificationsPopover = () => {
        this.setState({
            notificationsAnchorEl: null
        })
    }

    onNotificationsPress = (event) => {
        this.setState({
            notificationsAnchorEl: event.currentTarget
        })

        axios.get("http://localhost:8080/users/current/notifications")
            .then(({ data: notifications }) => {
                this.setState({
                    notifications
                })
                axios.put("http://localhost:8080/users/current/notifications/seen")
                    .then({

                    })
            })
    }

    getNotificationRelatedToBugClicked = (bugId) => () => {
        this.props.history.push(`/bugs/${bugId}`);
        this.closeNotificationsPopover();
    }

    onSelectProject = (projectId) => {
        this.props.dispatch(switchProject(projectId))
    }

    render() {
        const { classes, theme } = this.props;
        const { anchorEl, mobileMoreAnchorEl } = this.state;
        const isMenuOpen = Boolean(anchorEl);
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
        const isNotificationsOpen = Boolean(this.state.notificationsAnchorEl);

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
                <MenuItem onClick={this.onSignOut}>Sign out</MenuItem>
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
                            <ListItem button key="bugsOverViewListItem" onClick={() => this.props.history.push("/bugs")}>
                                <ListItemIcon> <BugReport /></ListItemIcon>
                                <ListItemText primary="Bugs Overview" />
                            </ListItem>
                            <ListItem button key="statisticsListItem" onClick={() => this.props.history.push("/statistics")}>
                                <ListItemIcon> <BarChart /></ListItemIcon>
                                <ListItemText primary="Statistics" />
                            </ListItem>
                            {this.props.isDEV ?
                                <ListItem button key="projectSettingsListItem" onClick={() => this.props.history.push("/projectSettings")}>
                                    <ListItemIcon> <SettingsIcon /></ListItemIcon>
                                    <ListItemText primary="Project settings" />
                                </ListItem>
                                :
                                null
                            }
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

                        <ProjectSelectorDropdown
                            projects={this.props.projects}
                            onSelectProject={this.onSelectProject}
                            selectedProject={this.props.currentProjectId} />

                        <section className="centered-vertically">
                            <Typography variant="subtitle2" color="inherit">
                                Welcome, {this.props.loggedInUserName}.
                                </Typography>
                        </section>
                        <div className={classes.sectionDesktop}>
                            <IconButton color="inherit" onClick={this.onNotificationsPress}>
                                <Badge badgeContent={this.state.numberOfNotifications} color="secondary">
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
                        render={() => <Redirect to="/bugs" />}
                    />
                    <Route
                        exact
                        path={`${this.props.match.path}bugs/:bugId?`}
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
                <NotificationsPopover
                    open={isNotificationsOpen}
                    anchorEl={this.state.notificationsAnchorEl}
                    onClose={this.closeNotificationsPopover}
                    notifications={this.state.notifications}
                    getNotificationRelatedToBugClicked={this.getNotificationRelatedToBugClicked} />

                {this.props.notAuthorizedMessage ?
                    <NotAuthorizedPopup
                        message={this.props.notAuthorizedMessage}
                        onConfirm={() => {
                            this.props.dispatch(notAuthorizedConfirmed())
                        }} />
                    :
                    null
                }
            </div>
        );
    }
}

ResponsiveDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
    // Injected by the documentation to work in an iframe.
    // You won't need it on your project.
    container: PropTypes.object,
    theme: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    currentProjectId: state.bugs.currentProjectId,
    username: state.security.username,
    loggedInUserName: state.security.loggedInUserName,
    projects: state.bugs.projects,
    notAuthorizedMessage: state.bugs.notAuthorizedMessage,
    isDEV: state.security.isDev
})

export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps)(ResponsiveDrawer)));

class ProjectSelectorDropdown extends React.PureComponent {
    state = {
    }

    onSelectionChange = (event) => {
        this.props.onSelectProject(event.target.value)
    }
    render() {
        return (
            <Select
                className="project-select"
                onChange={this.onSelectionChange}
                value={this.props.selectedProject}
                disableUnderline>
                {this.props.projects.map(project =>
                    <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
                )}
            </Select>
        )
    }
}