import React, { Component } from 'react';
import { ScrollView, AppState, View, Dimensions, StyleSheet, Text, Image, TouchableOpacity, ListView, TouchableHighlight, DeviceEventEmitter, NetInfo, NativeModules } from 'react-native';
import List from '../components/List';
import Loading from '../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen'

const PRE_ORG = new Array(20).fill('Hello');
const LATEST_OPEN = ['B', 'C', 'E'];
const LIST_ARRAY = [
    { name: 'AA', icon: 'md-home' },
    { name: 'BB', icon: 'md-eye' },
    { name: 'CC', icon: 'md-briefcase' },
    { name: 'DD', icon: 'md-contact' },
    { name: 'EE', icon: 'md-settings' },
    { name: 'FF', icon: 'md-home' },
    { name: 'GG', icon: 'md-eye' },
    { name: 'HH', icon: 'md-briefcase' },
    { name: 'II', icon: 'md-contact' },
    { name: 'JJ', icon: 'md-settings' },
];

const ARRAY_TEMP = [];
let CONNECT_BOOL;
const { width, height } = Dimensions.get('window');
export default class Menu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userHeadImage: 'https://pic4.zhimg.com/v2-292a49c4ca7046333ec6e529c6485dbf_xl.jpg',
            userName: '',
            userEmail: '',
            organizationShow: false,
            currentOrganization: '',
            dataOrgSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            currentProject: '',
            dataLatestOpenSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            list: '',
            dataListSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            downloading: [],
            loading: true,
        };
    }

    componentWillMount() {
        AppState.addEventListener(
            'change',
            (appState) => { this.handleAppStateChange(appState) }
        );
        NetInfo.isConnected.addEventListener(
            'connectionChange',
            (isConnected) => { this.handleIsConnectedChange(isConnected) }
        );
        DeviceEventEmitter.addListener(
            'chooseProject',
            (project) => { this.selectProject(project); }
        );
    }

    componentDidMount() {
        SplashScreen.hide();
        this.getMessage();
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('chooseProject');
        AppState.removeEventListener('change', this.handleAppStateChange);
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleIsConnectedChange);
    }

    handleIsConnectedChange(isConnected) {
        if (CONNECT_BOOL === false && isConnected === true) {
            console.log('网络发生变化了，当前为' + isConnected);
        }
        CONNECT_BOOL = isConnected;
    }

    handleAppStateChange(appState) {
        if (appState != 'active') {
            console.log('应用处于后台状态')
        }
    }

    getMessage() {
        this.getUserMessage();
        this.getBundles();
        this.getLatestProjects();
        this.getCurrent();
    }

    getUserMessage() {
        this.setState({
            userHeadImage: 'https://pic4.zhimg.com/v2-292a49c4ca7046333ec6e529c6485dbf_xl.jpg',
            userName: '小勾兑',
            userEmail: 'qihuang@ghy.cn',
        })
    }

    getOrganizations() {
        this.setState({
            dataOrgSource: this.state.dataOrgSource.cloneWithRows(PRE_ORG),
        });
    }

    getBundles() {
        setTimeout(() => {
            this.setState({
                loading: false,
                dataListSource: this.state.dataOrgSource.cloneWithRows(LIST_ARRAY),
            });
        }, 3000);
    }

    getLatestProjects() {
        this.setState({
            dataLatestOpenSource: this.state.dataOrgSource.cloneWithRows(LATEST_OPEN),
        });
        ARRAY_TEMP = LATEST_OPEN.concat();
    }

    getCurrent() {
        this.setState({
            currentOrganization: 'HELLO',
            currentProject: ''
        });
    }

    selectOrganization(organization) {
        this.setState({
            currentOrganization: organization,
            organizationShow: !this.state.organizationShow
        })
        if (this.state.list != "") {
            this.setState({
                currentProject: ''
            });
            this.openFromMenu(this.state.list, organization, '', true);
        }
    }

    selectProject(project) {
        const pos = ARRAY_TEMP.indexOf(project);
        if (pos === -1) {
            ARRAY_TEMP.unshift(project);
            ARRAY_TEMP = ARRAY_TEMP.splice(0, 4);
            this.setState({
                currentProject: project,
                dataLatestOpenSource: this.state.dataLatestOpenSource.cloneWithRows(ARRAY_TEMP),
            });
        } else if (pos === 0) {
            this.setState({
                currentProject: project,
            });
        } else {
            ARRAY_TEMP.splice(pos, 1);
            ARRAY_TEMP.unshift(project);
            ARRAY_TEMP = ARRAY_TEMP.splice(0, 4);
            this.setState({
                currentProject: project,
                dataLatestOpenSource: this.state.dataLatestOpenSource.cloneWithRows(ARRAY_TEMP),
            });
        }

        if (this.state.list != '') {
            this.openFromMenu(this.state.list, this.state.currentOrganization, project, true);
        }
    }

    selectList(list) {
        let arr = this.state.downloading.concat();
        arr.push(list.name);
        this.setState({
            list: list.name,
            downloading: arr
        });
        if (this.state.currentOrganization != '' && this.state.currentProject != '') {
            this.openFromMenu(list.name, this.state.currentOrganization, this.state.currentProject, true);
        } else if (this.state.currentOrganization != '' && this.state.currentProject === '') {
            this.openFromMenu(list.name, this.state.currentOrganization, '', true);
        }
        setTimeout(() => {
            var arr = this.state.downloading;
            arr.splice(arr.indexOf(list.name), 1);
            this.setState({
                downloading: arr
            });
        }, 3000);
    }

    renderOrg(organization) {
        const bgColor = organization == this.state.currentOrganization ? '#F3F3F3' : '#FEFEFE';
        return (
            <List
                text={organization}
                bgColor={bgColor}
                onPress={() => this.selectOrganization(organization)}
            />
        );
    }

    renderListLatestOpen(project) {
        const bgColor = project == this.state.currentProject ? '#F3F3F3' : '#FEFEFE';
        const disable = project == this.state.currentProject ? true : false;
        return (
            <List
                text={project}
                bgColor={bgColor}
                disable={disable}
                onPress={() => {
                    this.setState({
                        currentProject: project
                    });
                    this.selectProject(project);
                }}
            />
        )
    }

    renderList(list) {
        const bgColor = list.name == this.state.list ? '#F3F3F3' : '#FEFEFE';
        const disable = list.name == this.state.list ? true : false;
        const downloading = this.state.downloading.indexOf(list.name) >= 0 ? true : false;
        return (
            <List
                text={list.name}
                downloading={downloading}
                disable={disable}
                leftIconName={list.icon}
                listHeight={46}
                bgColor={bgColor}
                onPress={() => {
                    this.selectList(list)
                }}
            />
        );
    }

    openFromMenu(listName, orgId, proId, isClose) {
        if (proId != '') {
            console.log('组织：' + orgId + ',项目：' + proId + ',模块：' + listName + '【组织层】');
        } else {
            console.log('组织：' + orgId + ',项目：' + proId + ',模块：' + listName + '【项目层】');
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                {
                    this.state.organizationShow &&

                    <ScrollView style={{ position: 'absolute', marginTop: 137, top: 0, left: 0, width: width, height: height - 137, backgroundColor: '#FEFEFE', zIndex: 99 }}>
                        <ListView
                            dataSource={this.state.dataOrgSource}
                            renderRow={this.renderOrg.bind(this)}
                        />
                    </ScrollView>

                }
                <ScrollView
                    ref={(scrollView) => { _scrollView = scrollView; }}
                    style={{ flex: 1, flexDirection: 'column' }}
                >
                    <View style={styles.topArea}>
                        <View style={styles.topAreaBasicInformation}>
                            <View style={[styles.topAreaBasicInformationUserImage, { height: 81 }]}>
                                <Image
                                    source={{ uri: this.state.userHeadImage }}
                                    style={styles.imageStyle}
                                />
                            </View>
                            <View style={[styles.topAreaBasicInformationUserInformation, { height: 81, justifyContent: 'flex-end' }]} >
                                <Text
                                    style={[styles.fontColorFFF, { fontSize: 16 }]}
                                    numberOfLines={1}
                                >
                                    {this.state.userName}
                                </Text>
                                <Text
                                    style={[styles.fontColorFFF, { fontSize: 14 }]}
                                    numberOfLines={1}
                                >
                                    {this.state.userEmail}
                                </Text>
                            </View>
                            <View style={{ justifyContent: 'space-between', height: 81, paddingTop: 16 }}>
                                <TouchableOpacity onPress={() => console.log('refresh')}>
                                    <View style={styles.topAreaBasicInformationSetting}>
                                        <Icon name="md-refresh" size={20} color={'#FFF'} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => console.log('sign-out')}>
                                    <View style={styles.topAreaBasicInformationSetting}>
                                        <Icon name="md-log-out" size={20} color={'#FFF'} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                if (!this.state.organizationShow) { this.getOrganizations(); }
                                this.setState({
                                    organizationShow: !this.state.organizationShow
                                });
                                _scrollView.scrollTo({ x: 0, y: 0, animated: true })
                            }}
                        >
                            <View style={styles.topAreaOrganizationInformation}>
                                <View style={[styles.verticalCenter, { flex: 1, }]}>
                                    <Text style={[styles.fontColorFFF, { fontSize: 14, marginLeft: 16 }]}>{this.state.currentOrganization}</Text>
                                </View>
                                <View style={[styles.verticalCenter, { width: 28, }]}>
                                    <Icon name="md-arrow-dropdown" size={30} color={'#FFF'} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomArea}>
                        <List
                            text={'最近打开的项目'}
                            overlayMarginTop={4}
                            textColor={'rgba(0,0,0,0.54)'}
                            underlayColor={'transparent'}
                            activeOpacity={1}
                        />
                        <View>
                            <ListView
                                dataSource={this.state.dataLatestOpenSource}
                                renderRow={this.renderListLatestOpen.bind(this)}
                            />
                        </View>
                        <List
                            text={'全部项目'}
                            listHeight={62}
                            leftIconName={'md-menu'}
                            rightIconName={'ios-arrow-forward'}
                            onPress={() => this.props.navigation.navigate('SelectProjects', { org: this.state.currentOrganization })}
                        />
                        <View>
                            <View style={styles.listBottomBorder}></View>
                            {
                                this.state.loading &&
                                <Loading />
                            }
                            <ListView
                                dataSource={this.state.dataListSource}
                                renderRow={this.renderList.bind(this)}
                            />
                        </View>
                    </View >
                </ScrollView>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE',
        flexDirection: 'column',
    },
    topArea: {
        height: 137,
        backgroundColor: '#Fab614'
    },
    bottomArea: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    topAreaBasicInformation: {
        flex: 1,
        height: 81,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    topAreaOrganizationInformation: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    topAreaBasicInformationUserImage: {
        width: 81,
        paddingLeft: 16,
        justifyContent: 'flex-end'
    },
    topAreaBasicInformationUserInformation: {
        flex: 1,
        paddingLeft: 11,
        paddingRight: 11
    },
    topAreaBasicInformationSetting: {
        width: 28
    },
    userName: {
        flex: 1,
        height: height * 0.2,
        paddingTop: 40,
        paddingLeft: 20
    },
    userImage: {
        width: 65,
        height: 65,
        alignSelf: 'center',
        marginRight: 30
    },
    imageStyle: {
        width: 65,
        height: 65,
        borderRadius: 32.5
    },
    fontColorFFF: {
        color: '#FFF'
    },
    verticalCenter: {
        justifyContent: 'center'
    },
    listBottomBorder: {
        height: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#D3D3D3',
        marginBottom: 8
    }
});