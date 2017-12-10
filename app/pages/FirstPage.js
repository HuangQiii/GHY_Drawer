import React, { Component, } from 'react';
import { View, Dimensions, StyleSheet, Text, Image, TouchableOpacity, ListView, TouchableHighlight } from 'react-native';
import { NativeModules } from 'react-native';
import List from '../components/List';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen'

const PRE_ORG = ['开发部', '设计部', '软件园', '学苑', '新闻网', '生活网', '音乐网', '办公室', '运营部', '自媒体中心'];
const LATEST_OPEN = [];
const LIST_ARRAY = [
    { name: '首页查询', icon: 'md-home' },
    { name: '进度跟进', icon: 'md-eye' },
    { name: '任务分配', icon: 'md-briefcase' },
    { name: '交流中心', icon: 'md-contact' },
    { name: '事后总结', icon: 'md-settings' }];
const { width, height } = Dimensions.get('window');
export default class FirstPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userHeadImage: 'https://pic4.zhimg.com/v2-292a49c4ca7046333ec6e529c6485dbf_xl.jpg',
            userName: '',
            userEmail: '',
            organizationShow: false,
            organization: '',
            dataOrgSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            project: '',
            dataLatestOpenSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
            list: '',
            dataListSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
    }

    componentDidMount() {
        SplashScreen.hide();
        this.getConfig();
        this.getMessage();
    }

    getMessage() {
        this.setState({
            userHeadImage: 'https://pic4.zhimg.com/v2-292a49c4ca7046333ec6e529c6485dbf_xl.jpg',
            userName: '小勾兑',
            userEmail: 'qihuang@ghy.cn',
            organization: '开发部',
            dataListSource: this.state.dataLatestOpenSource.cloneWithRows(LIST_ARRAY)
        })
    }

    getConfig() {
        console.log("读配置文件里的当前组织this.state.organization，当前项目this.state.project和最近项目this.state.dataLatestOpenSource渲染到页面上")
        //=====================================================================================================================
        // NativeModules.NativeManager.getConfigData((back) => {
        //     console.log("---back:---");
        //     console.log(back);
        //     var temp = [];

        //     if (back.latestPros.first != '') {
        //         temp.push(back.latestPros.first)
        //     }
        //     if (back.latestPros.second != '') {
        //         temp.push(back.latestPros.second)
        //     }
        //     if (back.latestPros.third != '') {
        //         temp.push(back.latestPros.third)
        //     }
        //     this.setState({
        //         organization: back.orgId,
        //         project: back.proId,
        //         dataLatestOpenSource: this.state.dataLatestOpenSource.cloneWithRows(temp)
        //     });
        // });
        //=====================================================================================================================
    }

    getOrg() {
        this.setState({
            dataOrgSource: this.state.dataOrgSource.cloneWithRows(PRE_ORG),
        });
    }

    selectOrg(list) {
        this.setState({ organization: list, organizationShow: !this.state.organizationShow })
        console.log("把当前组织写入配置文件")
        //=====================================================================================================================
        //NativeModules.NativeManager.writeUserConfig([list, this.state.project]);
        //=====================================================================================================================
    }

    renderOrg(list) {
        var bgColor = list == this.state.organization ? '#F3F3F3' : '#FEFEFE';
        return (
            <List
                text={list}
                bgColor={bgColor}
                onPress={() => this.selectOrg(list)}
            />
        );
    }

    renderList(list) {
        var bgColor;
        if (this.state.list != '') {
            bgColor = list.name == this.state.list ? '#F3F3F3' : '#FEFEFE';
        } else if (this.props.navigation.state.params && this.props.navigation.state.params.list != '') {
            bgColor = list.name == this.props.navigation.state.params.list ? '#F3F3F3' : '#FEFEFE';
        } else {
            bgColor = list.name == "首页" ? '#F3F3F3' : '#FEFEFE';
        }

        return (
            <List
                text={list.name}
                leftIconName={list.icon}
                listHeight={46}
                bgColor={bgColor}
                onPress={() => {
                    this.openFromMenu(list.name, this.state.organization, this.state.project, true);
                    this.setState({
                        list: list.name
                    })
                }}
            />
        );
    }

    renderListLatestOpen(list) {
        var bgColor = list == this.state.project ? '#F3F3F3' : '#FEFEFE';
        return (
            <List
                text={list}
                bgColor={bgColor}
                onPress={() => {
                    //=====================================================================================================================
                    //NativeModules.NativeManager.writeUserConfig([this.state.organization, list]);
                    //=====================================================================================================================
                    this.setState({
                        project: list
                    });
                    this.openFromMenu(this.state.list, this.state.organization, list, false);
                }}
            />
        )
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
                            if (!this.state.organizationShow) { this.getOrg(); }
                            this.setState({
                                organizationShow: !this.state.organizationShow
                            });
                        }}
                    >
                        <View style={styles.topAreaOrganizationInformation}>
                            <View style={[styles.verticalCenter, { flex: 1, }]}>
                                <Text style={[styles.fontColorFFF, { fontSize: 14, marginLeft: 16 }]}>{this.state.organization}</Text>
                            </View>
                            <View style={[styles.verticalCenter, { width: 28, }]}>
                                <Icon name="md-arrow-dropdown" size={30} color={'#FFF'} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                {
                    this.state.organizationShow &&
                    <View>
                        <ListView
                            dataSource={this.state.dataOrgSource}
                            renderRow={this.renderOrg.bind(this)}
                        />
                    </View>
                }
                {
                    !this.state.organizationShow &&
                    <View>
                        <List
                            text={'最近打开的项目'}
                            overlayMarginTop={4}
                            textColor={'rgba(0,0,0,0.54)'}
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
                            onPress={() => this.props.navigation.navigate('Total', { org: this.state.organization, list: this.state.list })}
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