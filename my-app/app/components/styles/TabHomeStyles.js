import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  safeAreaView: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginTop: 12,
    padding: 3,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  headerContainer: {
    marginHorizontal: 16,
    marginTop: 30,
  },
  headerText: {
    fontSize: 40,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 10,
  },
  searchContainer: {
    padding: 10,
    marginHorizontal: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  searchInput: {
    marginLeft: 10,
    color: 'gray',
    fontSize: 16,
    flex: 1,
  },
  searchFilter: {
    backgroundColor: 'white',
    borderRadius: 15,
  },
  scrollView: {
    marginVertical: 6,
    paddingVertical: 6,
    maxHeight: 80,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tabCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    margin: 5,
    justifyContent: 'center',
    width: '22%',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center'
  },
  activeText: {
    fontWeight: 'bold',
    color: '#FFAC1C',
  },
  activeTabCard: {
    backgroundColor: 'white',
  },
  exerciseSection: {
    marginVertical: 20,
  },
  exerciseHeader: {
    color: 'white',
    marginLeft: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 40
  },
  branchContainer: {
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  branchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  branchCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    width: 350,
    height: 500,
    alignSelf:'center'
  },
  membershipContainer: {
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  membershipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  membershipCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    width: 350,
    height: 500,
    alignSelf:'center'
  },
  aboutContainer: {
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  aboutCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  aboutImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  seeMoreButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  seeMoreText: {
    color: '#FFAC1C',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '30%',
},
});

export default styles;