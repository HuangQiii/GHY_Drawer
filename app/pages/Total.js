import React, { Component, } from 'react';
import { View, Dimensions, StyleSheet, Text, Image, TouchableOpacity, ListView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import List from '../components/List';
import Button from '../components/Button';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { NativeModules } from 'react-native';

const PRE_PRO = ['请回答2017', '摄影大赛', '柴火开发', '柳交所'];
const { width, height } = Dimensions.get('window');
export default class Total extends Component {

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
            data: [],
            dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
        };
    }

    componentDidMount() {
        this.getMessage();
    }

    getMessage() {
        this.setState({
            data: PRE_PRO,
            dataSource: this.state.dataSource.cloneWithRows(PRE_PRO)
        })
    }

    write(list) {
        console.log("把项目写入配置文件");
        //=====================================================================================================================
        //NativeModules.NativeManager.writeUserConfig([this.props.navigation.state.params.org, list]);
        //=====================================================================================================================
        if (this.props.navigation.state.params.list != '') {
            //=====================================================================================================================
            //NativeModules.NativeManager.openFromMenuNew(this.props.navigation.state.params.list, this.props.navigation.state.params.org, list, false);
            //=====================================================================================================================
        }
    }

    renderList(list) {
        return (
            <List
                text={list}
                onPress={() => {
                    var resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({
                                routeName: 'FirstPage',
                                params: {
                                    project: list,
                                    list: this.props.navigation.state.params.list
                                }
                            })
                        ]
                    });
                    this.props.navigation.dispatch(resetAction);
                    this.write(list);
                }}
            />
        );
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderList.bind(this)}
                />
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
    headBlock: {
        width: width,
        height: 137,
        // flexDirection: 'row'
        backgroundColor: '#3F51B5'
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
        height: 65
    }
});