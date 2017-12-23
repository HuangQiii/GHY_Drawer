import React, { Component } from 'react';
import { View, StyleSheet, ListView, DeviceEventEmitter, NativeModules } from 'react-native';
import List from '../components/List';
import Button from '../components/Button';
import Loading from '../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';

const PRE_PRO = ['A', 'B', 'C', 'D', 'E', 'F'];
export default class SelectProjects extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.org}下的所有项目`,
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
            loading: true,
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
    }

    componentDidMount() {
        this.getProjects();
    }

    getProjects() {
        setTimeout(() => {
            this.setState({
                loading: false,
                dataSource: this.state.dataSource.cloneWithRows(PRE_PRO)
            })
        }, 3000);
    }

    chooseProject(project) {
        DeviceEventEmitter.emit('chooseProject', project);
        this.props.navigation.dispatch({
            key: 'Menu',
            type: 'BcakToCurrentScreen',
            routeName: 'Menu',
        });
    }

    renderProject(project) {
        return (
            <List
                text={project}
                onPress={() => this.chooseProject(project)}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.loading &&
                    <Loading />
                }

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