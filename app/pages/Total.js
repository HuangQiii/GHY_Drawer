import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, Text, Image, TouchableOpacity, ListView, DeviceEventEmitter, NativeModules } from 'react-native';
import List from '../components/List';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/Ionicons';

const PRE_PRO = ['请回答2017', '摄影大赛', '柴火开发', '柳交所'];
// const token = "Bearer 98907fb8-39f7-4e07-afed-3f73c6462296";
const token = "";
// const baseUrl = 'http://gateway.deploy.saas.hand-china.com';
const baseUrl = "";
export default class Total extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.currentOrganization.name}下的所有项目`,
        headerRight: (
            <Icon.Button
                name="md-search"
                backgroundColor="transparent"
                underlayColor="transparent"
                activeOpacity={0.8}
                onPress={() => alert("Qyellow")}
            />
        )
    });

    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
    }

    componentDidMount() {
        NativeModules.NativeManager.getConfigData((back) => {
            baseUrl = back.mainUrl;
            console.log(baseUrl);
            token = back.token;
            console.log(token);
            this.getProjects();
        });
    }
    //获取projects数据
    getProjects() {
        var url = baseUrl + "/uaa/v1/organization/" + this.props.navigation.state.params.currentOrganization.id + "/projects/self";
        fetch(url, {
            headers: {
                "Authorization": token
            }
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("*********项目");
                console.log(responseData);
                if (responseData.error == undefined) {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(responseData)
                    })
                } else if (responseData.error == "invalid_token") {
                    //token失效
                    ToastAndroid.show("登录失效", ToastAndroid.SHORT);
                    this.openLogin();
                } else {
                    // this.loadLoaclData();
                    // arr = arr.concat(responseData);
                    ToastAndroid.show("网络错误", ToastAndroid.SHORT);
                }
            });
    }

    chooseProject(project) {
        DeviceEventEmitter.emit('chooseProject', project);
        this.props.navigation.dispatch({
            key: 'FirstPage',
            type: 'BcakToCurrentScreen',
            routeName: 'FirstPage',
        });
    }

    renderProject(project) {
        return (
            <List
                text={project.name}
                onPress={() => this.chooseProject(project)}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderProject.bind(this)}
                />
            </View >
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FEFEFE',
    }
});