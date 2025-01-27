import { View, Text, Image, Pressable } from 'react-native'
import React, { useCallback, useState } from 'react'
import { logoutAction } from '../../../(redux)/authSlice';
import LoadingScreen from '../../LodingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useRouter } from 'expo-router';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';


const CoachIndex = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const [screenLoading, setScreenLoading] = useState(false);
  const state = useSelector(state => state.auth);
  const [clients, setClients] = useState([]);

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/auth/login");
  };

  const getCoachClients = async () => {

    const { user: { user } } = state;

    try {

      const { data } = await axios.get(`${baseURL}/availTrainer/coach/${user._id}`);

      setClients(data);

    } catch (err) {
      console.log(err);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getCoachClients()
    }, [])
  )

  return (
    <>
      {screenLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <SafeAreaView>
            <View style={{ padding: 15, }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your Clients</Text>
              <View style={{ marginTop: 10, }}>
                <ClientLists users={clients} />
              </View>
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  )
}

const ClientLists = ({ users }) => {

  return (
    <View>
      <FlatList
        data={users}
        key={item => item._id}
        renderItem={({ item }) => <ClientServiceDetail item={item} />}
      />
    </View >
  )

}

const ClientServiceDetail = ({ item }) => {

  const router = useRouter();
  const [completedSession, setCompletedSession] = useState(0);

  const goToDetail = () => {
    router.push({
      pathname: '/components/Coach/screens/service-client-details',
      params: { id: item._id }
    });
  }

  useFocusEffect(
    useCallback(() => {

      const countCompleted = item.schedule.reduce((count, item) => {
        return item.status === "completed" ? count + 1 : count;
      }, 0);
      setCompletedSession(countCompleted);

    }, [])
  )

  return (
    <Pressable onPress={goToDetail}>
      <View style={{ padding: 10, borderRadius: 10, borderWidth: 1, marginBottom: 10, }} >
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10, }}>
          <Image height={65} width={65} borderRadius={5} source={{ uri: item.userId.image[0].url }} />
          <View style={{ alignSelf: 'center' }}>
            <Text>Name: {item.userId.name}</Text>
            <Text>Email: {item.userId.email}</Text>
            <Text>Phone: {item.userId.phone}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Text>
            {item.package}
          </Text>

          <Text>
            |
          </Text>

          <Text>
            {completedSession}/{item.sessions} Sessions
          </Text>

          <Text>
            |
          </Text>

          <Text>
            P{item.sessionRate} Rate
          </Text>
        </View>

        <View style={{ marginTop: 5, flexDirection: 'row', gap: 10 }}>
          <Text>Status: {item.status}</Text>

          <Text>
            |
          </Text>

          <Text>Next Schedule: {formatDate(item?.schedule[item?.schedule?.length - 1])}</Text>

        </View>

      </View>
    </Pressable>
  )
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Not Specified";
  }

  const options = { month: "short", day: "numeric", year: "numeric" };
  return date.toLocaleDateString("en-US", options).replace(",", "");
}

export default CoachIndex