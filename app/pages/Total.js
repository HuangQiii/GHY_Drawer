import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, Text, Image, TouchableOpacity, ListView, DeviceEventEmitter, NativeModules } from 'react-native';
import List from '../components/List';
import Button from '../components/Button';
import Icon from 'react-native-vector-icons/Ionicons';

const PRE_PRO = ['请回答2017', '摄影大赛', '柴火开发', '柳交所'];
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
        this.getProjects();
    }
    //获取projects数据
    getProjects() {
        var url = "http://gateway.deploy.saas.hand-china.com/uaa/v1/organization/" + this.props.navigation.state.params.currentOrganization.id + "/projects/self";
        fetch(url, {
            headers: {
                "Authorization": "Bearer eb51aa17-0148-43d5-87d3-e17254494543"
            }
        })
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData)
                })
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