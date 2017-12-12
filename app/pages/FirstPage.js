import React, { Component, } from 'react';
import { View, Dimensions, StyleSheet, Text, Image, TouchableOpacity, ListView, TouchableHighlight,DeviceEventEmitter } from 'react-native';
import { NativeModules } from 'react-native';
import List from '../components/List';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen'

const PRE_ORG = ['开发部', '设计部', '软件园', '学苑', '新闻网', '生活网', '音乐网', '办公室', '运营部', '自媒体中心'];
const LATEST_OPEN = ['柴火开发','柳交所','摄影大赛'];
const LIST_ARRAY = [
    { name: '首页查询', icon: 'md-home' },
    { name: '进度跟进', icon: 'md-eye' },
    { name: '任务分配', icon: 'md-briefcase' },
    { name: '交流中心', icon: 'md-contact' },
    { name: '事后总结', icon: 'md-settings' }];
const ARRAY_TEMP=[];
const { width, height } = Dimensions.get('window');
export default class FirstPage extends Component {

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
        };
    }

    componentDidMount() {
        SplashScreen.hide();
        DeviceEventEmitter.addListener('chooseProject', (project) => {
            this.selectProject(project);
        });
        this.getMessage();
    }

    componentWillUnmount() {
        DeviceEventEmitter.removeAllListeners('chooseProject');
    }

    getMessage() {
        this.getUserMessage();
        this.getBundles();
        this.getLatestProjects();
        this.getCurrent();
    }

    getUserMessage(){
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

    getBundles(){
        this.setState({
            dataListSource: this.state.dataOrgSource.cloneWithRows(LIST_ARRAY),
        });
    }

    getLatestProjects(){
        this.setState({
            dataLatestOpenSource: this.state.dataOrgSource.cloneWithRows(LATEST_OPEN),
        });
        ARRAY_TEMP = LATEST_OPEN.concat();
    }

    getCurrent(){
        this.setState({
            currentOrganization:'开发部',
            currentProject:''
        });
    }

    selectOrganization(organization) {
        this.setState({ 
            currentOrganization: organization, 
            organizationShow: !this.state.organizationShow 
        })
        if(this.state.list != ""){
            this.setState({
                currentProject:''
            });
            console.log("触发事件打开"+organization+"项目下的"+this.state.list+"【组织层】数据")
        }
    }

    renderOrg(organization) {
        var bgColor = organization == this.state.currentOrganization ? '#F3F3F3' : '#FEFEFE';
        return (
            <List
                text={organization}
                bgColor={bgColor}
                onPress={() => this.selectOrganization(organization)}
            />
        );
    }

    selectProject(project){
        const pos = ARRAY_TEMP.indexOf(project);
        if (pos === -1) {
            ARRAY_TEMP.unshift(project);
            ARRAY_TEMP = ARRAY_TEMP.splice(0,4);
            this.setState({
                currentProject:project,
                dataLatestOpenSource: this.state.dataLatestOpenSource.cloneWithRows(ARRAY_TEMP),
                
            });
        } else if(pos === 0){
            this.setState({
                currentProject:project,
            });
        }else{
            ARRAY_TEMP.splice(pos, 1);
            ARRAY_TEMP.unshift(project);
            ARRAY_TEMP = ARRAY_TEMP.splice(0,4);
            this.setState({
                currentProject:project,
                dataLatestOpenSource: this.state.dataLatestOpenSource.cloneWithRows(ARRAY_TEMP),
                
            });
        }
        
        if(this.state.list != ''){
            console.log("触发事件打开"+this.state.currentOrganization+"项目下的"+project+"项目下的"+this.state.list+"【项目层】数据")
        }
    }

    selectList(list){
        this.setState({
            list: list.name
        });
        if(this.state.currentOrganization != '' && this.state.currentProject != ''){
            console.log("触发事件打开"+this.state.currentOrganization+"项目下的"+this.state.currentProject+"项目下的"+list.name+"【项目层】数据")
        }else if(this.state.currentOrganization != '' && this.state.currentProject === ''){
            console.log("触发事件打开"+this.state.currentOrganization+"项目下的"+list.name+"【组织层】数据")
        }
    }

    renderListLatestOpen(project) {
        var bgColor = project == this.state.currentProject ? '#F3F3F3' : '#FEFEFE';
        return (
            <List
                text={project}
                bgColor={bgColor}
                onPress={() => {
                    this.setState({
                        currentProject: project
                    });
                    this.selectProject(project);
                    this.openFromMenu(this.state.currentProject, this.state.currentOrganization, project, false);
                }}
            />
        )
    }

    renderList(list) {
        var bgColor = list.name == this.state.list ? '#F3F3F3' : '#FEFEFE';

        return (
            <List
                text={list.name}
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
        //var orgId = this.state.organization;
        //var proId = this.state.project
        //var proId = `${this.props.navigation.state.params ? this.props.navigation.state.params.project : '全部项目'}`;
        // if (proId === '全部项目') {
        //     alert("请选择项目");
        // } else {
        //alert(bundleName + '-' + orgId + '-' + proId);
        //打开子模块
        //=====================================================================================================================
        //NativeModules.NativeManager.openFromMenuNew(listName, orgId, proId, isClose);
        //=====================================================================================================================

        //}
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
                        <View style={styles.topAreaBasicInformationSetting}>
                            <Icon name="md-settings" size={20} color={'#FFF'} />
                        </View>
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
                                <Text style={[styles.fontColorFFF, { fontSize: 14, marginLeft: 16 }]}>{this.state.currentOrganization}</Text>
                            </View>
                            <View style={[styles.verticalCenter, { width: 28, }]}>
                                <Icon name="md-arrow-dropdown" size={30} color={'#FFF'} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    this.state.organizationShow &&
                    <View style={{height:height}}>
                        <ListView
                            dataSource={this.state.dataOrgSource}
                            renderRow={this.renderOrg.bind(this)}
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
                            dataSource={this.state.dataLatestOpenSource}
                            renderRow={this.renderListLatestOpen.bind(this)}
                        />

                        <List
                            text={'全部项目'}
                            listHeight={62}
                            leftIconName={'md-menu'}
                            rightIconName={'ios-arrow-forward'}
                            onPress={() => this.props.navigation.navigate('Total', { org: this.state.currentOrganization })}
                        />
                        <View style={styles.listBottomBorder}></View>
                        <ListView
                            dataSource={this.state.dataListSource}
                            renderRow={this.renderList.bind(this)}
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
        backgroundColor: '#Fab614'
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