import React, { Component, } from 'react';
import { AppState, View, Dimensions, StyleSheet, Text, Image, TouchableOpacity, ListView, TouchableHighlight, DeviceEventEmitter, Alert } from 'react-native';
import { NativeModules, NetInfo } from 'react-native';
import List from '../components/List';
import Icon from 'react-native-vector-icons/Ionicons';

const PRE_ORG = [];
const LATEST_OPEN = [];
const LIST_ARRAY = [];
const ARRAY_TEMP = [];
const { width, height } = Dimensions.get('window');
export default class FirstPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userHeadImage: 'https://pic4.zhimg.com/v2-292a49c4ca7046333ec6e529c6485dbf_xl.jpg',
            userName: '',
            userEmail: '',
            organizationShow: false,
            currentOrganization: {},
            organizationsSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            currentProject: {},
            latestProjectsSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            currentBundle: {},
            bundlesSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
    }

    componentWillMount() {
        AppState.addEventListener('change', (appState) => { this.handleAppStateChange(appState) });
    }

    componentDidMount() {
        DeviceEventEmitter.addListener('chooseProject', (project) => { this.selectProject(project); });
        this.getMessage();
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('chooseProject');
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange(appState) {
        if (appState != 'active') {
            this.writeUserConfig();
        }
    }

    getMessage() {
        this.getUserMessage();
        this.getBundles();
        // this.getLatestProjects();
        //this.getCurrent();
        this.getUserConfig();
    }

    getUserMessage() {
        fetch("http://gateway.deploy.saas.hand-china.com/uaa/v1/users/querySelf", {
            headers: {
                "Authorization": "Bearer eb51aa17-0148-43d5-87d3-e17254494543"
            }
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    userHeadImage: 'https://pic4.zhimg.com/v2-292a49c4ca7046333ec6e529c6485dbf_xl.jpg',
                    userName: responseData.name,
                    userEmail: responseData.email,
                })

                var url = "http://gateway.deploy.saas.hand-china.com/uaa/v1/organizations/" + responseData.organizationId
                fetch(url, {
                    headers: {
                        "Authorization": "Bearer eb51aa17-0148-43d5-87d3-e17254494543"
                    }
                })
                    .then((res) => res.json())
                    .then((resData) => {
                        this.setState({
                            currentOrganization: resData
                        })
                    })
            })

    }

    getOrganizations() {
        fetch("http://gateway.deploy.saas.hand-china.com/uaa/v1/menus/select", {
            headers: {
                "Authorization": "Bearer eb51aa17-0148-43d5-87d3-e17254494543"
            }
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    organizationsSource: this.state.organizationsSource.cloneWithRows(responseData.organizations)
                })
            });
    }

    getUserConfig() {
        NativeModules.NativeManager.getUserConfig((back) => {
            console.log(back)
            var org = {};
            var project = {};
            var latest = [];
            if (back.currentOrganization != undefined) {
                org = back.currentOrganization
            }
            if (back.currentProject != undefined) {
                project = back.currentProject
            }
            if (back.latestProjects != undefined) {
                latest = back.latestProjects
            }
            this.setState({
                currentOrganization: org,
                currentProject: project,
                latestProjectsSource: this.state.latestProjectsSource.cloneWithRows(latest)
            });
            ARRAY_TEMP = latest.concat();
        })
    }

    getBundles() {
        //获取模块
        fetch("http://gateway.deploy.saas.hand-china.com/mobileCloud/v1/bundle/getData/2", {
            headers: {
                "Authorization": "Bearer eb51aa17-0148-43d5-87d3-e17254494543"
            }
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    bundlesSource: this.state.bundlesSource.cloneWithRows(responseData),
                });
            });
    }

    selectOrganization(organization) {
        this.setState({
            currentOrganization: organization,
            organizationShow: !this.state.organizationShow
        })
        if (this.state.currentBundle.id != undefined) {
            this.setState({
                currentProject: {}
            });
            this.openBundle(this.state.currentOrganization.id, '', this.state.currentBundle.name, true)
        }
        this.writeUserConfig();
    }

    selectProject(project) {
        //const pos = ARRAY_TEMP.indexOf(project);
        const pos = ARRAY_TEMP.findIndex(x => x.id == project.id)
        if (pos === -1) {
            ARRAY_TEMP.unshift(project);
            ARRAY_TEMP = ARRAY_TEMP.splice(0, 4);
            this.setState({
                currentProject: project,
                latestProjectsSource: this.state.latestProjectsSource.cloneWithRows(ARRAY_TEMP),

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
                latestProjectsSource: this.state.latestProjectsSource.cloneWithRows(ARRAY_TEMP),

            });
        }

        if (this.state.currentBundle.id != undefined) {
            this.openBundle(project.organizationId, project.id, this.state.currentBundle.name, true)
        }
        this.writeUserConfig();
    }

    selectBundle(bundle) {
        this.setState({
            currentBundle: bundle
        });
        var orgId = -1;
        var proId = -1;
        if (this.state.currentOrganization.id != undefined) {
            orgId = this.state.currentOrganization.id
        }
        if (this.state.currentProject.id != undefined) {
            proId = this.state.currentProject.id
        }
        //判断是否下载
        NativeModules.NativeManager.openBundle(bundle.name, orgId, proId, (type, result) => {
            let title = ""
            if (type == "update") {
                title = "发现新版本,是否升级?" + result;
            } else {
                title = "未安装应用，是否安装？"
            }
            Alert.alert(
                title,
                title,
                [
                    {
                        text: '是',
                        onPress: () => {
                            NetInfo.fetch().done((connectionInfo) => {
                                //var connectionType = connectionInfo.type;
                                // if (connectionType == 'wifi') {
                                if (connectionInfo == 'WIFI') {
                                    NativeModules.NativeManager.downloadAndOpenBundle(bundle.name, bundle.id, bundle.currentVersion, bundle.downloadUrl, (type, result) => {
                                        if (type == "netError") {
                                            Alert.alert("网络或服务器出错，请重启软件再尝试！");
                                        } else if (type == "success") {

                                        } else {
                                            Alert.alert(result);
                                        }
                                    });
                                } else {
                                    Alert.alert(
                                        "提示",
                                        "当前正在使用非wifi连接下载，确定要下载吗？",
                                        [
                                            {
                                                text: '是',
                                                onPress: () => {
                                                    NativeModules.NativeManager.downloadAndOpenBundle(bundle.name, bundle.id, bundle.currentVersion, bundle.downloadUrl, (type, result) => {
                                                        if (type == "netError") {
                                                            Alert.alert("网络或服务器出错，请重启软件再尝试！");
                                                        } else if (type == "success") {

                                                        } else {
                                                            Alert.alert(result);
                                                        }
                                                    });
                                                }
                                            },
                                            {
                                                text: '否'
                                            }
                                        ]
                                    )
                                }
                            });
                        }
                    },
                    {
                        text: '否'
                    }
                ]
            );
            // }
        });
        // if (this.state.currentOrganization.id != undefined && this.state.currentProject.id != undefined) {
        //     this.openBundle(this.state.currentOrganization.id, this.state.currentProject.id, bundle.id, true)
        // } else if (this.state.currentOrganization.id != undefined && this.state.currentProject.id === undefined) {
        //     this.openBundle(this.state.currentOrganization.id, '', bundle.id, true)
        // }
    }

    renderOrganization(organization) {
        var bgColor = organization.id == this.state.currentOrganization.id ? '#F3F3F3' : '#FEFEFE';
        return (
            <List
                text={organization.name}
                bgColor={bgColor}
                onPress={() => this.selectOrganization(organization)}
            />
        );
    }

    renderLatestProject(project) {
        var bgColor = project.id == this.state.currentProject.id ? '#F3F3F3' : '#FEFEFE';
        return (
            <List
                text={project.name}
                bgColor={bgColor}
                onPress={() => this.selectProject(project)}
            />
        )
    }

    renderBundle(bundle) {
        var bgColor = bundle.id == this.state.currentBundle.id ? '#F3F3F3' : '#FEFEFE';

        return (
            <List
                text={bundle.name}
                leftIconName={bundle.icon}
                listHeight={46}
                bgColor={bgColor}
                onPress={() => this.selectBundle(bundle)}
            />
        );
    }

    writeUserConfig() {
        var obj = {};
        obj.currentOrganization = this.state.currentOrganization;
        obj.currentProject = this.state.currentProject;
        obj.latestProjects = ARRAY_TEMP.concat();
        NativeModules.NativeManager.writeUserConfig(obj)
    }

    openBundle(organizationId, projectId, name, isClose) {
        console.log(
            "organization:" + organizationId +
            "projectId:" + projectId +
            "name:" + name
        )
        var orgId = -1;
        var proId = -1;
        if (organizationId != undefined && organizationId != '') {
            orgId = organizationId
        }
        if (projectId != undefined && projectId != '') {
            proId = projectId
        }
        NativeModules.NativeManager.openBundle(name, orgId, proId, (type, result) => {

        });
    }

    openLogin() {
        NativeModules.NativeManager.openLogin();
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={styles.topArea}>
                    <View style={styles.topAreaBasicInformation}>
                        <View style={styles.topAreaBasicInformationUserImage}>
                            <Image
                                source={{ uri: this.state.userHeadImage }}
                                style={styles.imageStyle}
                            />
                        </View>
                        <View style={styles.topAreaBasicInformationUserInformation} >
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
                        <TouchableOpacity onPress={() => this.openLogin()}>
                            <View style={styles.topAreaBasicInformationSetting}>
                                <Icon name="md-settings" size={20} color={'#FFF'} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            if (!this.state.organizationShow) { this.getOrganizations(); }
                            this.setState({
                                organizationShow: !this.state.organizationShow
                            });
                        }}
                    >
                        <View style={styles.topAreaOrganizationInformation}>
                            <View style={[styles.verticalCenter, { flex: 1, }]}>
                                <Text style={[styles.fontColorFFF, { fontSize: 14, marginLeft: 16 }]}>{this.state.currentOrganization.name}</Text>
                            </View>
                            <View style={[styles.verticalCenter, { width: 28, }]}>
                                <Icon name="md-arrow-dropdown" size={30} color={'#FFF'} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    this.state.organizationShow &&
                    <View style={{ height: height }}>
                        <ListView
                            dataSource={this.state.organizationsSource}
                            renderRow={this.renderOrganization.bind(this)}
                        />
                    </View>
                }
                {
                    <View>
                        <List
                            text={'最近打开的项目'}
                            overlayMarginTop={4}
                            textColor={'rgba(0,0,0,0.54)'}
                            underlayColor={'transparent'}
                            activeOpacity={1}
                        />
                        <ListView
                            dataSource={this.state.latestProjectsSource}
                            renderRow={this.renderLatestProject.bind(this)}
                        />

                        <List
                            text={'全部项目'}
                            listHeight={62}
                            leftIconName={'md-menu'}
                            rightIconName={'ios-arrow-forward'}
                            onPress={() => this.props.navigation.navigate('Total', { currentOrganization: this.state.currentOrganization })}
                        />
                        <View style={styles.listBottomBorder}></View>
                        <ListView
                            dataSource={this.state.bundlesSource}
                            renderRow={this.renderBundle.bind(this)}
                        />
                    </View>
                }
            </View >
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        height: height,
        backgroundColor: '#FEFEFE',
        flexDirection: 'column'
    },
    topArea: {
        height: 137,
        backgroundColor: '#3F51B5'
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
        width: width,
        height: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#D3D3D3',
        marginBottom: 8
    }
});