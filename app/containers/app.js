import { StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';
import Menu from '../pages/Menu';
import SelectProjects from '../pages/SelectProjects';

const App = StackNavigator(
    {
        Menu: {
            screen: Menu,
            navigationOptions: {
                header: null
            }
        },
        SelectProjects: { screen: SelectProjects }
    },
    {
        headerMode: 'screen',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#fab614'
            },
            headerTitleStyle: {
                color: '#fff',
                fontSize: 18,
                alignSelf: 'center'
            },
            headerTintColor: '#fff'
        }
    }
);
const prevGetStateForAction = App.router.getStateForAction;
App.router.getStateForAction = (action, state) => {
    if (state && action.type === 'ReplaceCurrentScreen') {
        const routes = state.routes.slice(0, state.routes.length - 1);
        routes.push(action);
        return {
            ...state,
            routes,
            index: routes.length - 1,
        };
    }
    if (state && action.type === 'BcakToCurrentScreen') {
        function findDateInArr(arr, propertyName, value) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][propertyName] == value) {
                    return i;
                }
            }
            return -1;
        }
        var i = findDateInArr(state.routes, 'routeName', action.routeName);
        if (i != -1) {
            var routes = state.routes.slice(0, i + 1);
        }
        return {
            ...state,
            routes,
            index: routes.length - 1,
        }
    }
    return prevGetStateForAction(action, state);
};

export default App;